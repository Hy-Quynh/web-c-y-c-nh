const asyncHandler = require("express-async-handler");
const { getProductList, createNewProduct, getProductById, updateProductData, deleteProductData } = require("../models/product");

module.exports = {
  getAllProduct: asyncHandler(async (req, res) => {
    const {search, limit, offset} = req?.query
    const response = await getProductList(search, limit, offset)
    res.send({ success: true, payload: response });
  }),

  getProductById: asyncHandler(async (req, res) => {
    const {productId} = req?.params
    const response = await getProductById(productId)
    res.send({ success: true, payload: response });
  }),

  createNewProduct: asyncHandler(async (req, res) => {
    const {productData} = req?.body
    const {product_name, product_description, product_image, product_price, product_category} = productData
    const response = await createNewProduct(product_name, product_description, product_image, product_price, product_category)
    res.send({ success: true, payload: response });
  }),

  updateProductData: asyncHandler(async (req, res) => {
    const {productData} = req?.body
    const {productId} = req?.params
    const response = await updateProductData(productData, productId)
    res.send({ success: response });
  }),

  deleteProductData: asyncHandler(async (req, res) => {
    const {productId} = req?.params
    const response = await deleteProductData(productId)
    res.send({ success: response });
  })
}