const { postgresql } = require("../config/connect");

module.exports = {
  getUserChatMessage: async (userId) => {
    try {
      const data = await postgresql.query(
        `SELECT uc.* FROM user_chat uc WHERE uc.user_id=${Number(userId)}`
      );
      const userReply =
        await postgresql.query(`SELECT ucr.user_id, ucr.message AS reply_message, ucr.created_day, ad.first_name AS reply_first_name, ad.last_name AS reply_last_name  
      FROM  user_chat_reply ucr
      LEFT JOIN admin ad ON ucr.owner_reply = ad.admin_id
      WHERE ucr.user_id=${Number(userId)}`);

      if (data?.rows) {
        const dataMessage = [...data?.rows];
        dataMessage?.push(...(userReply?.rows || []));
        dataMessage?.sort(function (x, y) {
          return x.created_day - y.created_day;
        });
        return dataMessage;
      }
      return [];
    } catch (error) {
      console.log("getUserChatMessage error >>>> ", error);
      return [];
    }
  },

  createUserChat: async (userId, message) => {
    try {
      const res = await postgresql.query(
        `INSERT INTO user_chat(user_id, message, created_day) VALUES(${Number(
          userId
        )}, '${message}', Now())`
      );
      return res?.rows ? true : false;
    } catch (error) {
      console.log("createUserChat error >>>> ", error);
      return false;
    }
  },

  createUserChatReply: async (userId, message, owner_reply) => {
    try {
      const res = await postgresql.query(
        `INSERT INTO user_chat_reply(user_id, owner_reply, message, created_day) VALUES(${Number(
          userId
        )}, ${Number(owner_reply)},'${message}', Now())`
      );
      return res?.rows ? true : false;
    } catch (error) {
      console.log("createUserChat error >>>> ", error);
      return false;
    }
  },

  getAllUserHaveChat: async () => {
    try {
      const response = await postgresql.query(
        `SELECT ur.user_id, ur.first_name, ur.last_name, ur.email, ur.phone_number, (SELECT user_chat.created_day from user_chat where user_chat.user_id = ur.user_id ORDER BY user_chat.created_day DESC LIMIT 1) as new_created_message FROM user_chat uc JOIN users ur ON uc.user_id = ur.user_id GROUP BY ur.user_id`
      );
      const chatReply = await postgresql.query(
        `SELECT ur.user_id, ur.first_name, ur.last_name, ur.email, ur.phone_number, (SELECT user_chat_reply.created_day from user_chat_reply where user_chat_reply.user_id = ur.user_id ORDER BY user_chat_reply.created_day DESC LIMIT 1) as new_created_message FROM user_chat_reply uc JOIN users ur ON uc.user_id = ur.user_id GROUP BY ur.user_id`
      );
      const allUser = [];
      if (response?.rows) allUser?.push(...response?.rows);
      if (chatReply?.rows) allUser?.push(...chatReply?.rows);

      allUser?.sort(function (x, y) {
        return (
          new Date(y.new_created_message) - new Date(x.new_created_message)
        );
      });

      const obj = {};
      for (const item of allUser) {
        if (!obj[item.user_id]?.user_id) {
          obj[item.user_id] = item;
        }
      }

      const output = Object.values(obj);
      output?.sort(function (x, y) {
        return (
          new Date(y.new_created_message) - new Date(x.new_created_message)
        );
      });
      return output || [];
    } catch (error) {
      console.log("getAllUserHaveChat error >>>> ", error);
      return [];
    }
  },
};
