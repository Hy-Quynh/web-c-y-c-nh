const { postgresql } = require("../config/connect");
const bcrypt = require("bcrypt");

module.exports = {
  userSignUp: async (
    firstName,
    lastName,
    email,
    password,
    role,
    status,
    phone_number,
    address,
    type,
  ) => {
    try {
      if (type === 'user') {
        const hash = bcrypt.hashSync(password, 10);
        const signupRes = await postgresql.query(
          `INSERT INTO users(first_name, last_name, email, password, created_day, status, phone_number, address) VALUES('${firstName}', '${lastName}', '${email}', '${hash}', Now(), ${Number(
            status
          )}, '${phone_number ? phone_number : ""}', '${
            address ? address : ""
          }')`
        );
        if (signupRes) return true;
      }

      if (type === 'admin') {
        const hash = bcrypt.hashSync(password, 10);
        const signupRes = await postgresql.query(
          `INSERT INTO admin(first_name, last_name, email, password, created_day, status, phone_number, address, role_id) VALUES('${firstName}', '${lastName}', '${email}', '${hash}', Now(), ${Number(
            status
          )}, '${phone_number ? phone_number : ""}', '${
            address ? address : ""
          }', ${Number(role)})`
        );
        if (signupRes) return true;
      }
      return false;
    } catch (error) {
      console.log("user sign up error >>>> ", error);
      return false;
    }
  },
};
