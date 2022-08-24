const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/util");

module.exports = {
  getAllRole: async (search, limit, offset) => {
    try{
      const limitOffset = getByLimitAndOffset(limit, offset);
      const getRole = await postgresql.query(`SELECT * FROM account_role WHERE ${
        search && search !== "undefined"
          ? `role_name LIKE '%${search}%'`
          : `role_name != ''`
      } ORDER BY role_id DESC ${limitOffset}`)
      return getRole?.rows || []
    }catch(error){
      console.log("getAllRole >>>> ", error);
      return [];
    }
  },

  createRoleData: async (name, role_function) => {
    try {
      const createRes = await postgresql.query(
        `INSERT INTO account_role(role_name, role_function, created_day) VALUES('${name}', '${role_function}', Now())`
      );
      if (createRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("createRoleData error >>>> ", error);
      return false;
    }
  },

  deleteRoleData: async(roleId) => {
    try{
      const deleteAccountRes =  await postgresql.query(
        `DELETE FROM admin WHERE role_id=${Number(roleId)}`
      );
      if( deleteAccountRes?.rows ){
        const deleteRoleRes = await postgresql.query(
          `DELETE FROM account_role WHERE role_id=${Number(roleId)}`
        );
        return deleteRoleRes?.rows ? true : false
      }
      return false
    }catch (error) {
      console.log("deleteRoleData error >>>> ", error);
      return false;
    }
  },

  updateRoleData: async(name, role_function, roleId) => {
    try{
      const updateRes = await postgresql.query(`UPDATE account_role SET role_name='${name}', role_function='${role_function}' WHERE role_id=${Number(roleId)}`)
      return updateRes?.rows ? true: false
    }catch (error) {
      return false;
    }
  },

  getRoleFunctionByName: async(name) => {
    try{
      const role = await postgresql.query(`SELECT * FROM account_role WHERE role_name='${name}'`)
      return role?.rows?.length ? role?.rows?.[0] : {}
    }catch (error) {
      return {};
    }
  },

  getRoleByAdminId: async(adminId) => {
    try{
      const role = await postgresql.query(`SELECT r.* FROM admin ad JOIN account_role r ON ad.role_id = r.role_id WHERE ad.admin_id='${adminId}'`)
      return role?.rows?.length ? role?.rows?.[0] : {}
    }catch (error) {
      return {};
    }
  },
}