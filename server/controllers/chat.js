const asyncHandler = require("express-async-handler");
const { getUserChatMessage, createUserChat, createUserChatReply, getAllUserHaveChat } = require("../models/chat");

module.exports = {
  getChatByUserId: asyncHandler(async (req, res) => {
    const {userId} = req?.params
    const data = await getUserChatMessage(userId)
    res.send({ success: true, payload: data });
  }),

  createUserChat: asyncHandler(async (req, res) => {
    const {userId} = req?.params
    const {message} = req?.body
    const response = await createUserChat(userId, message)
    res.send({ success: response });
  }),

  createUserChatReply: asyncHandler(async (req, res) => {
    const {userId} = req?.params
    const {message, owner_reply} = req?.body
    const response = await createUserChatReply(userId, message, owner_reply)
    res.send({ success: response });
  }),

  getAllUserHaveChat: asyncHandler(async (req, res) => {
      const data = await getAllUserHaveChat();
      res.send({ success: true, payload: data });
  })
};
