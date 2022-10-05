const { postgresql } = require("../config/connect");

module.exports = {
  getAllHelper: async () => {
    try {
      const helperData = await postgresql.query(`SELECT * FROM helper ORDER BY helper_id DESC`);
      if (helperData?.rows) {
        return helperData?.rows;
      }
      return [];
    } catch (error) {
      console.log("getAllHelper error >>>> ", error);
      return [];
    }
  },

  getAllWarranty: async () => {
    try{
      const warrantyData = await postgresql.query(`SELECT * FROM warranty ORDER BY warranty_id DESC`)
      if (warrantyData?.rows) {
        return warrantyData?.rows;
      }
      return [];
    }catch (error) {
      console.log("getAllWarranty error >>>> ", error);
      return [];
    }
  },

  createWaranty: async(warrantyContent) => {
    try{
      const createRes = await postgresql.query(
        `INSERT INTO warranty(warranty_content, created_day) VALUES('${warrantyContent}', Now())`
      );
      return createRes?.rows ? true : false
    }catch (error) {
      console.log("createWaranty error >>>> ", error);
      return false;
    }
  },

  updateWaranty: async(warrantyId, warrantyContent) => {
    try{
      const updateRes = await postgresql.query(`UPDATE warranty SET warranty_content='${warrantyContent}' WHERE warranty_id=${Number(warrantyId)}`)
      return updateRes?.rows ? true : false
    }catch (error) {
      console.log("updateWaranty error >>>> ", error);
      return false;
    }
  },

  createHelperData: async (helperText, helperDescription) => {
    try {
      const createRes = await postgresql.query(
        `INSERT INTO helper(helper_text, helper_description, create_at) VALUES('${helperText}', '${helperDescription}', Now())`
      );
      if (createRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("createHelperData error >>>> ", error);
      return false;
    }
  },

  updateHelperData: async (helperText, helperDescription, helperId) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE helper SET helper_text='${helperText}', helper_description='${helperDescription}' WHERE helper_id=${Number(
          helperId
        )}`
      );
      if (updateRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("updateTopicData error >>>> ", error);
      return false;
    }
  },

  deleteHelperData: async (helperId) => {
    try {
      const deleteRes = await postgresql.query(
        `DELETE FROM helper WHERE helper_id=${Number(helperId)}`
      );
      if (deleteRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("deleteHelperData error >>>> ", error);
      return false;
    }
  },
};
