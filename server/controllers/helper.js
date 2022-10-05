const asyncHandler = require("express-async-handler");
const { getAllHelper, createHelperData, updateHelperData, deleteHelperData, getAllWarranty, createWaranty, updateWaranty } = require("../models/helper");

module.exports = {
  getAllHelper: asyncHandler(async (req, res) => {
    const helperList = await getAllHelper();
    res.send({ success: true, payload: helperList });
  }),

  getAllWarranty: asyncHandler(async (req, res) => {
    const warrantyList = await getAllWarranty();
    res.send({ success: true, payload: warrantyList });
  }),

  createWaranty: asyncHandler(async (req, res) => {
    const {warrantyContent} = req?.body;
    const createRes = await createWaranty(warrantyContent);
    res.send({ success: createRes })
  }),

  updateWarranty: asyncHandler(async (req, res) => {
    const {warrantyId} = req?.params
    const {warrantyContent} = req?.body;
    const updateRes = await updateWaranty(warrantyId, warrantyContent);
    res.send({ success: updateRes })
  }),

  createNewHelper: asyncHandler(async (req, res) => {
    const {helperData} = req.body
    const {helperText, helperDescription} = helperData
    const createRes = await createHelperData(helperText, helperDescription)
    res.send({ success: createRes });
  }),

  updateHelperData: asyncHandler(async (req, res) => {
    const {helperData} = req.body
    const {helperId} = req.params
    const {helperText, helperDescription} = helperData

    const updateRes = await updateHelperData(helperText, helperDescription, helperId)
    res.send({ success: updateRes });
  }),

  deleteHelperData: asyncHandler(async (req, res) => {
    const {helperId} = req.params
    const deleteRes = await deleteHelperData(helperId)
    res.send({ success: deleteRes });
  })
};
