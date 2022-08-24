const {
  createNewProductPromo,
  getPromoDataById,
  getPromoFreeProduct,
  getPromoProduct,
} = require("../models/product");

const createNewProductPromoData = async (
  promoData,
  discountRule,
  listFreeProduct,
  listPromoProduct
) => {
  const createRes = await createNewProductPromo(
    promoData,
    discountRule,
    listFreeProduct,
    listPromoProduct
  );

  return createRes;
};

const getPromoById = async (promoId) => {
  const promoData = await getPromoDataById(promoId);
  let listFreeProduct = [];
  let listPromoProduct = [];

  if (promoData?.promo_id && promoData?.rule_type !== "DISCOUNT") {
    listFreeProduct = await getPromoFreeProduct(promoId);
  }

  if (promoData?.promo_id) {
    listPromoProduct = await getPromoProduct(promoId);
  }

  return {
    success: true,
    payload: {
      promoData,
      listFreeProduct: listFreeProduct?.map((item) => item?.product_id),
      listPromoProduct: listPromoProduct?.map((item) => item?.product_id),
    },
  };
};

module.exports.productMiddleware = {
  createNewProductPromoData,
  getPromoById,
};
