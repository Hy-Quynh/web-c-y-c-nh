const asyncHandler = require("express-async-handler");
const { productMiddleware } = require("../middlewares/product");
const {
  getProductList,
  createNewProduct,
  getProductById,
  updateProductData,
  deleteProductData,
  getTotalProduct,
  getReviewByProductId,
  getTotalReviewByProductId,
  createNewReview,
  changeReviewStatus,
  getAllReview,
  createCartData,
  getAllCheckoutProduct,
  deleteCheckoutById,
  changeCheckoutStatus,
  getCheckoutById,
  getCheckoutByUserId,
  getPromoList,
  deletePromoData,
  updatePromoData,
  getProductPromo,
  getPromoFreeProduct,
  checkUserProductPurchase,
  getProductQuantity,
  deleteReviewData,
  updateReviewData,
  createReviewChildren,
  deleteReviewChildren,
  updateReviewChildrenStatus,
  updateUserReviewChildren,
  getSellingProduct,
  createKeyWordSearch,
  getProductMostSearch,
} = require("../models/product");
const moment = require("moment");

module.exports = {
  getAllProduct: asyncHandler(async (req, res) => {
    const { search, category, limit, offset, minPrice, maxPrice } = req?.query;
    const response = await getProductList(
      search,
      category,
      limit,
      offset,
      minPrice,
      maxPrice
    );
    const newProduct = [];

    for (let i = 0; i < response?.length; i++) {
      const promo = await getProductPromo(response[i]?.product_id);
      let product_sale = response?.[i]?.product_price;
      const newPromo = promo?.filter((item) => {
        if (
          moment(item?.promo_start).isSameOrBefore(moment(), "day") &&
          moment(item?.promo_end).isSameOrAfter(moment(), "day")
        ) {
          return true;
        }
      });

      for (let j = 0; j < newPromo?.length; j++) {
        if (newPromo?.[j]?.promo_rule !== "DISCOUNT") {
          freeProduct = await getPromoFreeProduct(newPromo?.[j]?.promo_id);
          newPromo[j].free_product = freeProduct;
        } else {
          if (newPromo?.[j]?.rule_type === "MONEY") {
            product_sale = product_sale - newPromo?.[j]?.rule_value;
          } else {
            product_sale =
              product_sale -
              response?.[i]?.product_price * (newPromo?.[j]?.rule_value / 100);
          }
        }
      }
      newProduct?.push({
        ...response?.[i],
        product_sale,
        promo: [...newPromo],
      });
    }

    const totalProduct = await getTotalProduct(
      search,
      category,
      minPrice,
      maxPrice
    );

    res.send({
      success: true,
      payload: { product: newProduct, total: totalProduct },
    });
  }),

  getProductById: asyncHandler(async (req, res) => {
    const { productId } = req?.params;
    const response = await getProductById(productId);
    const newProduct = { ...response };

    const promo = await getProductPromo(response?.product_id);
    let product_sale = response?.product_price;

    const newPromo = promo?.filter((item) => {
      if (
        moment(item?.promo_start).isSameOrBefore(moment(), "day") &&
        moment(item?.promo_end).isSameOrAfter(moment(), "day")
      ) {
        return true;
      }
    });

    for (let j = 0; j < newPromo?.length; j++) {
      if (newPromo?.[j]?.promo_rule !== "DISCOUNT") {
        freeProduct = await getPromoFreeProduct(newPromo?.[j]?.promo_id);
        newPromo[j].free_product = freeProduct;
      } else {
        if (newPromo?.[j]?.rule_type === "MONEY") {
          product_sale = product_sale - newPromo?.[j]?.rule_value;
        } else {
          product_sale =
            product_sale -
            response?.product_price * (newPromo?.[j]?.rule_value / 100);
        }
      }
    }
    newProduct.product_sale = product_sale;
    newProduct.promo = [...newPromo];
    res.send({ success: true, payload: newProduct });
  }),

  createNewProduct: asyncHandler(async (req, res) => {
    const { productData } = req?.body;
    const {
      product_name,
      product_description,
      product_image,
      product_price,
      product_category,
      product_quantity,
    } = productData;
    const response = await createNewProduct(
      product_name,
      product_description,
      product_image,
      product_price,
      product_category,
      product_quantity
    );
    res.send({ success: true, payload: response });
  }),

  updateProductData: asyncHandler(async (req, res) => {
    const { productData } = req?.body;
    const { productId } = req?.params;
    const response = await updateProductData(productData, productId);
    res.send({ success: response });
  }),

  deleteProductData: asyncHandler(async (req, res) => {
    const { productId } = req?.params;
    const response = await deleteProductData(productId);
    res.send({ success: response });
  }),

  getReviewByProductId: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { limit, page } = req.query;
    const response = await getReviewByProductId(productId, limit, page);
    const total = await getTotalReviewByProductId(productId);
    res.send({ success: true, payload: { review: response, total: total } });
  }),

  createNewReview: asyncHandler(async (req, res) => {
    const { user_id, review, product_id, star } = req.body;
    const response = await createNewReview(user_id, review, product_id, star);
    res.send({ success: response });
  }),

  changeReviewStatus: asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { status } = req.body;
    const response = await changeReviewStatus(reviewId, status);
    res.send({ success: response });
  }),

  getAllReview: asyncHandler(async (req, res) => {
    const response = await getAllReview();
    res.send({ success: true, payload: response });
  }),

  checkoutCart: asyncHandler(async (req, res) => {
    const {
      cartData,
      totalPrice,
      paymentMethod,
      userInfo,
      paymentId,
      pickUpOption,
      pickUpTime,
    } = req.body;

    const response = await createCartData(
      cartData,
      totalPrice,
      paymentMethod,
      userInfo,
      paymentId,
      pickUpOption,
      pickUpTime
    );
    res.send(response);
  }),

  getListCheckout: asyncHandler(async (req, res) => {
    const { fromData, toDate, limit, offset, status } = req?.query;
    const response = await getAllCheckoutProduct(
      fromData,
      toDate,
      limit,
      offset,
      status
    );
    res.send({ success: true, payload: response });
  }),

  deleteCheckoutById: asyncHandler(async (req, res) => {
    const { checkoutId } = req?.params;
    const response = await deleteCheckoutById(checkoutId);
    res.send({ success: response });
  }),

  changeCheckoutStatus: asyncHandler(async (req, res) => {
    const { checkoutId } = req?.params;
    const { status } = req?.body;
    const response = await changeCheckoutStatus(checkoutId, status);
    res.send({ success: response });
  }),

  getCheckoutById: asyncHandler(async (req, res) => {
    const { checkoutId } = req?.params;
    const response = await getCheckoutById(checkoutId);
    res.send({ success: true, payload: response });
  }),

  getCheckoutByUserId: asyncHandler(async (req, res) => {
    const { userId } = req?.params;
    const response = await getCheckoutByUserId(userId);
    res.send({ success: true, payload: response });
  }),

  createNewPromo: asyncHandler(async (req, res) => {
    const { promoData, discountRule, listFreeProduct, listPromoProduct } =
      req?.body;

    const response = await productMiddleware.createNewProductPromoData(
      promoData,
      discountRule,
      listFreeProduct,
      listPromoProduct
    );
    res.send({ success: response });
  }),

  updatePromoData: asyncHandler(async (req, res) => {
    const { promoId } = req?.params;
    const { promoData, discountRule, listFreeProduct, listPromoProduct } =
      req?.body;
    const response = await updatePromoData(
      promoData,
      discountRule,
      listFreeProduct,
      listPromoProduct,
      promoId
    );
    res.send({ success: response });
  }),

  getPromoList: asyncHandler(async (req, res) => {
    const response = await getPromoList();
    res.send({ success: true, payload: response });
  }),

  deletePromoData: asyncHandler(async (req, res) => {
    const { promoId } = req?.params;
    const response = await deletePromoData(promoId);
    res.send({ success: response });
  }),

  getPromoById: asyncHandler(async (req, res) => {
    const { promoId } = req?.params;
    const response = await productMiddleware.getPromoById(promoId);
    res.send(response);
  }),

  checkUserProductPurchase: asyncHandler(async (req, res) => {
    const { productId, userId } = req?.params;
    const response = await checkUserProductPurchase(productId, userId);
    res.send({ success: true, payload: response });
  }),

  getProductQuantity: asyncHandler(async (req, res) => {
    const { productId } = req?.params;
    const response = await getProductQuantity(productId);
    res.send({ success: true, payload: response });
  }),

  deleteReviewData: asyncHandler(async (req, res) => {
    const { reviewId } = req?.params;
    const response = await deleteReviewData(reviewId);
    res.send({ success: response });
  }),

  updateUserReview: asyncHandler(async (req, res) => {
    const { reviewId } = req?.params;
    const { review } = req?.body;
    const response = await updateReviewData(reviewId, review);
    res.send({ success: response });
  }),

  createReviewChildren: asyncHandler(async (req, res) => {
    const { review_id, user_id, review, author_type } = req?.body;
    const response = await createReviewChildren(
      review_id,
      user_id,
      review,
      author_type
    );
    res.send({ success: response });
  }),

  deleteReviewChildren: asyncHandler(async (req, res) => {
    const { childrenId } = req?.params;
    const response = await deleteReviewChildren(childrenId);
    res.send({ success: response });
  }),

  updateReviewChildrenStatus: asyncHandler(async (req, res) => {
    const { childrenId } = req?.params;
    const { status } = req?.body;
    const response = await updateReviewChildrenStatus(childrenId, status);
    res.send({ success: response });
  }),

  updateUserReviewChildren: asyncHandler(async (req, res) => {
    const { childrenId } = req?.params;
    const { review } = req?.body;
    const response = await updateUserReviewChildren(childrenId, review);
    res.send({ success: response });
  }),

  getSellingProduct: asyncHandler(async (req, res) => {
    const { limit, offset } = req?.query;
    const response = await getSellingProduct(limit, offset);

    const newProduct = [];
    for (let i = 0; i < response?.length; i++) {
      const promo = await getProductPromo(response[i]?.product_id);
      let product_sale = response?.[i]?.product_price;
      const newPromo = promo?.filter((item) => {
        if (
          moment(item?.promo_start).isSameOrBefore(moment(), "day") &&
          moment(item?.promo_end).isSameOrAfter(moment(), "day")
        ) {
          return true;
        }
      });

      for (let j = 0; j < newPromo?.length; j++) {
        if (newPromo?.[j]?.promo_rule !== "DISCOUNT") {
          freeProduct = await getPromoFreeProduct(newPromo?.[j]?.promo_id);
          newPromo[j].free_product = freeProduct;
        } else {
          if (newPromo?.[j]?.rule_type === "MONEY") {
            product_sale = product_sale - newPromo?.[j]?.rule_value;
          } else {
            product_sale =
              product_sale -
              response?.[i]?.product_price * (newPromo?.[j]?.rule_value / 100);
          }
        }
      }
      newProduct?.push({
        ...response?.[i],
        product_sale,
        promo: [...newPromo],
      });
    }

    res.send({ success: true, payload: newProduct });
  }),

  createKeyWordSearch: asyncHandler(async (req, res) => {
    const { search } = req?.body;
    const response = await createKeyWordSearch(search);
    res.send({ success: response });
  }),

  getProductMostSearch: asyncHandler(async (req, res) => {
    const response = await getProductMostSearch();
    const newProduct = [];

    for (let i = 0; i < response?.length; i++) {
      const promo = await getProductPromo(response[i]?.product_id);
      let product_sale = response?.[i]?.product_price;
      const newPromo = promo?.filter((item) => {
        if (
          moment(item?.promo_start).isSameOrBefore(moment(), "day") &&
          moment(item?.promo_end).isSameOrAfter(moment(), "day")
        ) {
          return true;
        }
      });

      for (let j = 0; j < newPromo?.length; j++) {
        if (newPromo?.[j]?.promo_rule !== "DISCOUNT") {
          freeProduct = await getPromoFreeProduct(newPromo?.[j]?.promo_id);
          newPromo[j].free_product = freeProduct;
        } else {
          if (newPromo?.[j]?.rule_type === "MONEY") {
            product_sale = product_sale - newPromo?.[j]?.rule_value;
          } else {
            product_sale =
              product_sale -
              response?.[i]?.product_price * (newPromo?.[j]?.rule_value / 100);
          }
        }
      }
      newProduct?.push({
        ...response?.[i],
        product_sale,
        promo: [...newPromo],
      });
    }
    
    res.send({ success: true, payload: newProduct });
  }),
};
