const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/util");

module.exports = {
  getProductList: async (search, limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const res = await postgresql.query(
        `SELECT * FROM product WHERE ${
          search && search !== "undefined"
            ? `product_name LIKE '%${search}%'`
            : `product_name != ''`
        } ORDER BY product_id DESC ${limitOffset} `
      );
      return res?.rows || [];
    } catch (error) {
      console.log("getProductList error >>>> ", error);
      return [];
    }
  },

  getProductById: async (productId) => {
    try {
      const res = await postgresql.query(
        `SELECT * FROM product WHERE product_id=${Number(productId)}`
      );
      return res?.rows?.[0] || {};
    } catch (error) {
      console.log("getProductById error >>>> ", error);
      return {};
    }
  },

  createNewProduct: async (
    product_name,
    product_description,
    product_image,
    product_price,
    product_category,
  ) => {
    try {
      const res =
        await postgresql.query(`INSERT INTO product(product_name, product_description, product_image, product_price, 
        product_category, product_status, create_at) VALUES('${product_name}', '${product_description}', '${product_image}', ${Number(
          product_price
        )}, ${Number(product_category)}, 1, Now())`);
      return res?.rows ? true : false;
    } catch (error) {
      console.log("createNewProduct error >>>> ", error);
      return false;
    }
  },

  updateProductData: async (
    {
      product_name,
      product_description,
      product_image,
      product_price,
      product_category,
    },
    productId
  ) => {
    try {
      const res =
        await postgresql.query(`UPDATE product SET product_name='${product_name}', product_description='${product_description}', product_image='${product_image}',
      product_price=${Number(product_price)}, product_category=${Number(
          product_category
        )} WHERE product_id=${Number(
          productId
        )}`);
      return res?.rows ? true : false;
    } catch (error) {
      console.log("updateProductData error >>>> ", error);
      return false;
    }
  },

  deleteProductData: async(productId) => {
    try{
      const res = await postgresql.query(`DELETE FROM product WHERE product_id=${Number(productId)}`)
      return res?.rows ? true : false;
    }catch (error) {
      console.log("deleteProductData error >>>> ", error);
      return false;
    }
  }
};
