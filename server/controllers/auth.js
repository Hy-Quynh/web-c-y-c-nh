const asyncHandler = require("express-async-handler");
const asyncBusboy = require("async-busboy");
const bcrypt = require("bcrypt");
const { userSignUp } = require("../models/auth");
const { getUserByEmail, getAdminByEmail } = require("../models/user");

module.exports = {
  SIGNUP: asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phone_number,
      address,
      type
    } = req.body;
    const getUser = await getUserByEmail(email);
    const getAdmin = await getAdminByEmail(email);

    if (getUser?.user_id || getAdmin?.admin_id) {
      return res.send({ success: false, error: "Email đã tồn tại" });
    }

    const signupResult = await userSignUp(
      firstName,
      lastName,
      email,
      password,
      role,
      1, // status,
      phone_number,
      address,
      type,
    );

    if (!signupResult) {
      return res.send({ success: false, error: "Đăng kí tài khoản thất bại" });
    }
    return res.send({ success: true });
  }),

  LOGIN: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const getUser = await getUserByEmail(email);
    const getAdmin = await getAdminByEmail(email);

    if (!getUser?.user_id && !getAdmin?.admin_id) {
      return res.send({ success: false, error: "Email không tồn tại" });
    }

    const isMatchUser = bcrypt.compareSync(password, getUser?.password || "");

    const isMatchAdmin = bcrypt.compareSync(password, getAdmin?.password || "");

    if (!isMatchUser && !isMatchAdmin) {
      return res.send({ success: false, error: "Sai mật khẩu" });
    }

    if (getUser?.status === 0 || getAdmin?.status === 0) {
      return res.send({ success: false, error: "Tài khoản đã bị vô hiệu hoá" });
    }
    req.session.userID = isMatchUser ? getUser.user_id : getAdmin?.admin_id;
    
    return res.send({
      success: true,
      payload: isMatchUser ? { ...getUser, type: 'user'} : { ...getAdmin, type: 'admin' },
    });
  }),
};
