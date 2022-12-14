const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/util");

module.exports = {
  getUserByEmail: async (email) => {
    try {
      const user = await postgresql.query(
        `SELECT user_id, first_name, last_name, email, password, status, created_day, phone_number, address FROM users WHERE email='${email}'`
      );
      if (user?.rows?.length) {
        return user?.rows[0];
      }
      return {};
    } catch (error) {
      console.log("get user by email error >>>> ", error);
      return {};
    }
  },

  getAdminByEmail: async (email) => {
    try {
      const admin = await postgresql.query(
        `SELECT admin_id, first_name, last_name, email, password, status, created_day, phone_number, address, role_id FROM admin WHERE email='${email}'`
      );
      if (admin?.rows?.length) {
        return admin?.rows[0];
      }
      return {};
    } catch (error) {
      console.log("get admin by email error >>>> ", error);
      return {};
    }
  },

  getUserList: async (limit, offset, search) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const userList = await postgresql.query(
        `SELECT ur.user_id, ur.first_name, ur.last_name, ur.email, ur.status, ur.created_day, ur.phone_number, ur.address
        FROM users ur WHERE ${
          search && search !== "undefined"
            ? `ur.first_name LIKE '%${search}%' OR ur.last_name LIKE '%${search}%'`
            : `ur.user_id != 0`
        }  ORDER BY ur.user_id DESC ${limitOffset}`
      );

      if (userList?.rows) {
        return userList?.rows;
      }
      return [];
    } catch (error) {
      console.log("get user list error >>>> ", error);
      return [];
    }
  },

  countTotalUser: async (search) => {
    try {
      const count = await postgresql.query(
        `SELECT COUNT(user_id) as count_user FROM users WHERE ${
          search && search !== "undefined"
            ? `users.first_name LIKE '%${search}%' OR users.last_name LIKE '%${search}%'`
            : `users.user_id != 0`
        }`
      );
      if (count?.rows?.length) return count?.rows[0]?.count_user;
      return 0;
    } catch (error) {
      console.log("countTotalUser error >>>> ", error);
      return 0;
    }
  },

  getUserById: async (userId) => {
    try {
      const userInfo = await postgresql.query(
        `SELECT ur.user_id, ur.first_name, ur.last_name, ur.email, ur.status, ur.created_day, ur.phone_number, ur.address
        FROM users ur WHERE ur.user_id = ${Number(userId)}`
      );

      if (userInfo?.rows) return userInfo?.rows[0];
      return {};
    } catch (error) {
      console.log("getUserById error >>>> ", error);
      return {};
    }
  },

  getAdminList: async (search) => {
    try {
      const adminList = await postgresql.query(
        `SELECT admin_id, first_name, last_name, email, status, created_day, phone_number, address, role_id FROM admin WHERE ${
          search && search !== "undefined"
            ? `admin.first_name LIKE '%${search}%' OR admin.last_name LIKE '%${search}%'`
            : `admin.admin_id != 0`
        }`
      );

      if (adminList?.rows) {
        return adminList?.rows;
      }
      return [];
    } catch (error) {
      console.log("get user list error >>>> ", error);
      return [];
    }
  },

  deleteUserInfo: async (user_id) => {
    try {
      const deleteRes = await postgresql.query(
        `DELETE FROM users WHERE user_id=${Number(user_id)}`
      );

      if (deleteRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("delete user info error >>>> ", error);
      return false;
    }
  },

  deleteAdminInfo: async (admin_id) => {
    try {
      const deleteRes = await postgresql.query(
        `DELETE FROM admin WHERE admin_id=${Number(admin_id)}`
      );

      if (deleteRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("delete admin info error >>>> ", error);
      return false;
    }
  },

  updateUserStatus: async (user_id, status) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE users SET status=${Number(status)} WHERE user_id=${Number(
          user_id
        )}`
      );

      if (updateRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("update user info error >>>> ", error);
      return false;
    }
  },

  updateAdminStatus: async (admin_id, status) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE admin SET status=${Number(status)} WHERE admin_id=${Number(
          admin_id
        )}`
      );

      if (updateRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("update admin info error >>>> ", error);
      return false;
    }
  },

  countUser: async (fromDate, toDate) => {
    try {
      const userQuantity = await postgresql.query(
        `SELECT COUNT(user_id) AS user_quantity FROM users WHERE ${
          fromDate !== "undefined"
            ? `date(created_day) >= date('${fromDate}')`
            : "created_day is not null"
        } AND 
        ${
          toDate !== "undefined"
            ? `date(created_day) <= date('${toDate}')`
            : "created_day is not null"
        }`
      );

      if (userQuantity?.rows?.length)
        return userQuantity?.rows[0]?.user_quantity;
      return 0;
    } catch (error) {
      console.log("countUser error >>>> ", error);
      return 0;
    }
  },

  updateUserName: async (first_name, last_name, userId) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE users SET first_name='${first_name}', last_name='${last_name}' WHERE user_id=${Number(
          userId
        )}`
      );
      if (updateRes?.rows) return true;
      return false;
    } catch (error) {
      console.log("updateUserName error >>>> ", error);
      return false;
    }
  },

  updateUserAvatar: async (avatar, userId) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE users SET avatar='${avatar}' WHERE user_id=${Number(userId)}`
      );
      if (updateRes?.rows) return true;
      return false;
    } catch (error) {
      console.log("updateUserAvatar error >>>> ", error);
      return false;
    }
  },

  updateUserInfo: async (
    id,
    email,
    first_name,
    last_name,
    address,
    phone_number
  ) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE users SET first_name='${first_name}', last_name='${last_name}', address='${address}', phone_number='${phone_number}', email='${email}' WHERE user_id=${Number(
          id
        )}`
      );
      if (updateRes?.rows) return true;
      return false;
    } catch (error) {
      console.log("updateUserInfo error >>>> ", error);
      return false;
    }
  },

  updateAdminRole: async (adminId, role) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE admin SET role_id=${Number(role)} WHERE admin_id=${Number(
          adminId
        )}`
      );
      if (updateRes?.rows) return true;
      return false;
    } catch (error) {
      console.log("updateAdminRole error >>>> ", error);
      return false;
    }
  },
};
