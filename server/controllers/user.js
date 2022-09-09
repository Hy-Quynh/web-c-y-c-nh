const asyncHandler = require("express-async-handler");
const {
  getUserList,
  getAdminList,
  deleteUserInfo,
  deleteAdminInfo,
  updateUserStatus,
  updateAdminStatus,
  getUserById,
  updateUserName,
  countTotalUser,
  updateUserAvatar,
  updateUserInfo,
  updateAdminRole,
} = require("../models/user");

module.exports = {
  getUserList: asyncHandler(async (req, res) => {
    const { type, limit, offset, sort, search } = req.query;
    let listData = [];
    if (type === 'user') {
      listData = await getUserList(limit, offset, search);
      const totalUser = await countTotalUser(search);
      res.send({ success: true, payload: {user: listData, total: totalUser} });
    }

    if (type === 'admin') {
      listData = await getAdminList(search, limit, offset);
      res.send({ success: true, payload: {user: listData} });
    }
    
  }),

  getUserById: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const userInfp = await getUserById(userId);
    res.send({ success: true, payload: userInfp });
  }),

  deleteUserInfo: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { type } = req.query;
    let deleteRes = false;
    if (type === 'user') {
      deleteRes = await deleteUserInfo(userId);
    }

    if (type === 'admin') {
      deleteRes = await deleteAdminInfo(userId);
    }
    res.send({ success: deleteRes });
  }),

  updateUserStatus: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { type, status } = req.query;
    let updateRes = false;
    if (type === 'user') {
      updateRes = await updateUserStatus(userId, status);
    }

    if (type === 'admin') {
      updateRes = await updateAdminStatus(userId, status);
    }
    res.send({ success: updateRes });
  }),

  updateUserName: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const {first_name, last_name} = req.body
    const updateRes = await updateUserName(first_name, last_name, userId)
    res.send({ success: updateRes });
  }),

  updateUserAvatar: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const {avatar} = req.body
    const updateRes = await updateUserAvatar(avatar, userId)
    res.send({ success: updateRes });
  }),

  updateUserInfo: asyncHandler(async (req, res) => {
    const {userId} = req?.params
    const {email, first_name, last_name, address, phone_number} = req?.body
    const updateRes = await updateUserInfo(userId, email, first_name, last_name, address, phone_number)
    res.send({ success: updateRes });
  }),

  updateAdminRole: asyncHandler(async (req, res) => {
    const {adminId} = req?.params
    const {role} = req?.body
    const updateRes = await updateAdminRole(adminId, role)
    res.send({ success: updateRes });
  }),
};
