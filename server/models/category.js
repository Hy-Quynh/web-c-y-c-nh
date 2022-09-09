const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/util");

module.exports = {
  getAllCategory: async (limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const categoryData = await postgresql.query(`SELECT c.* FROM category c ORDER BY category_id DESC ${limitOffset}`);
      if (categoryData?.rows) {
        return categoryData?.rows;
      }
      return [];
    } catch (error) {
      console.log("getAllCategory error >>>> ", error);
      return [];
    }
  },

  getTotalCategory: async() => {
    try{
      const total = await postgresql.query(`SELECT COUNT(category_id) as count_category FROM category`)
      if ( total?.rows?.length ) return total?.rows[0]?.count_category
      return 0
    }catch (error) {
      console.log("getTotalCategory error >>>> ", error);
      return 0;
    }
  },

  createCategoryData: async (name, image, category_description) => {
    try {
      const createRes = await postgresql.query(
        `INSERT INTO category(category_name, category_description, category_image, created_day) VALUES('${name}', '${category_description}', '${image}', Now())`
      );
      if (createRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("createCategoryData error >>>> ", error);
      return false;
    }
  },

  updateCategoryData: async (name, image, category_description, categoryId) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE category SET category_name='${name}', category_description='${category_description}', category_image='${image}' WHERE category_id=${Number(
          categoryId
        )}`
      );
      if (updateRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("updateCategoryData error >>>> ", error);
      return false;
    }
  },

  deleteCategoryData: async (categoryId) => {
    try {
      await postgresql.query(
        `DELETE FROM product WHERE product_category=${Number(categoryId)}`
      );
      const deleteRes = await postgresql.query(
        `DELETE FROM category WHERE category_id=${Number(categoryId)}`
      );
      if (deleteRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("deleteCategoryData error >>>> ", error);
      return false;
    }
  },
};
