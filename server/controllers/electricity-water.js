const asyncHandler = require("express-async-handler");
const { electricityPayment, getListElectricityPayment, getTotalElectricitPayment, waterPayment, getListWaterPayment, getTotalWaterPayment } = require("../models/electricity-water");

module.exports = {
  electricityPayment: asyncHandler(async (req, res) => {
    const {
      paymentId,
      money,
      province,
      customerPhone,
      customerName,
      customerCode,
      userId,
    } = req?.body;
    const response = await electricityPayment(
      paymentId,
      money,
      province,
      customerPhone,
      customerName,
      customerCode,
      userId
    );
    res.send({ success: response });
  }),

  getListElectricityPayment: asyncHandler(async (req, res) => {
    const {limit, offset, userId} = req?.query
    const response = await getListElectricityPayment(limit, offset, userId)
    const total = await getTotalElectricitPayment(userId)
    res.send({ success: true, payload: {payment: response, total} });
  }),

  waterPayment: asyncHandler(async (req, res) => {
    const {
      paymentId,
      money,
      province,
      customerPhone,
      customerName,
      customerCode,
      userId,
      waterSupperlier
    } = req?.body;
    const response = await waterPayment(
      paymentId,
      money,
      province,
      customerPhone,
      customerName,
      customerCode,
      userId,
      waterSupperlier
    );
    res.send({ success: response });
  }),

  getListWaterPayment: asyncHandler(async (req, res) => {
    const {limit, offset, userId} = req?.query
    const response = await getListWaterPayment(limit, offset, userId)
    const total = await getTotalWaterPayment(userId)
    res.send({ success: true, payload: {payment: response, total} });
  }),

};
