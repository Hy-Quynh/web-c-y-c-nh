const { postgresql } = require("../config/connect");
const Stripe = require("stripe");
const { getByLimitAndOffset } = require("../utils/util");
const stripe = new Stripe(
  "sk_test_51KHAdUKzeo9d90anaaPYVtbwYcvv6MXdZ1StdTl4z0YOsywAp0e1F2cNhX5JyjoAtoqLmQFtLOZZSMLOY0D2MpiE00qjsdPDRR"
);

module.exports = {
  electricityPayment: async (
    paymentId,
    money,
    province,
    customerPhone,
    customerName,
    customerCode,
    userId
  ) => {
    try {
      const payment = await stripe.paymentIntents.create({
        amount: money,
        currency: "VND",
        description: "pay electricity",
        payment_method: paymentId,
        confirm: true,
      });

      if (!payment) return false;

      const response =
        await postgresql.query(`INSERT INTO electricity_payment(user_id, moneny, province, customer_code, customer_name, customer_phone, created_day) 
      VALUES(${Number(userId)}, ${Number(
          money
        )}, '${province}', '${customerCode}', '${customerName}', '${customerPhone}', Now())`);

      return response?.rows ? true : false;
    } catch (error) {
      console.log("electricityPayment error >>>> ", error);
      return false;
    }
  },

  getListElectricityPayment: async (limit, offset, userId) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const payment = await postgresql.query(
        `SELECT * FROM electricity_payment WHERE ${
          userId && userId !== "undefined"
            ? `user_id = ${Number(userId)}`
            : `user_id > 0`
        } ${limitOffset}`
      );
      return payment?.rows || [];
    } catch (error) {
      console.log("getListElectricityPayment error >>>> ", error);
      return [];
    }
  },

  getTotalElectricitPayment: async (userId) => {
    try {
      const payment = await postgresql.query(
        `SELECT COUNT(payment_id) as total_payment FROM electricity_payment WHERE ${
          userId && userId !== "undefined"
            ? `user_id = ${Number(userId)}`
            : `user_id > 0`
        }`
      );
      return payment?.rows?.[0]?.total_payment || 0;
    } catch (error) {
      console.log("getTotalElectricitPayment error >>>> ", error);
      return 0;
    }
  },

  waterPayment: async (
    paymentId,
    money,
    province,
    customerPhone,
    customerName,
    customerCode,
    userId,
    waterSupperlier
  ) => {
    try {
      const payment = await stripe.paymentIntents.create({
        amount: money,
        currency: "VND",
        description: "pay water",
        payment_method: paymentId,
        confirm: true,
      });

      if (!payment) return false;

      const response =
        await postgresql.query(`INSERT INTO water_payment(user_id, moneny, province, customer_code, customer_name, customer_phone, created_day, water_supperlier) 
      VALUES(${Number(userId)}, ${Number(
          money
        )}, '${province}', '${customerCode}', '${customerName}', '${customerPhone}', Now(), '${waterSupperlier}')`);

      return response?.rows ? true : false;
    } catch (error) {
      console.log("waterPayment error >>>> ", error);
      return false;
    }
  },

  getListWaterPayment: async (limit, offset, userId) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const payment = await postgresql.query(
        `SELECT * FROM water_payment WHERE ${
          userId && userId !== "undefined"
            ? `user_id = ${Number(userId)}`
            : `user_id > 0`
        } ${limitOffset}`
      );
      return payment?.rows || [];
    } catch (error) {
      console.log("getListWaterPayment error >>>> ", error);
      return [];
    }
  },

  getTotalWaterPayment: async (userId) => {
    try {
      const payment = await postgresql.query(
        `SELECT COUNT(payment_id) as total_payment FROM water_payment WHERE ${
          userId && userId !== "undefined"
            ? `user_id = ${Number(userId)}`
            : `user_id > 0`
        }`
      );
      return payment?.rows?.[0]?.total_payment || 0;
    } catch (error) {
      console.log("getTotalElectricitPayment error >>>> ", error);
      return 0;
    }
  },
};
