import { request } from "../utils/request";

export async function getListProduct(
  search,
  limit,
  offset,
  category,
  minPrice,
  maxPrice
) {
  return request({
    method: "GET",
    url: `/product?search=${search}&limit=${limit}&offset=${offset}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
  });
}

export async function getProductById(productId) {
  return request({
    method: "GET",
    url: `/product/${productId}`,
  });
}

export async function createNewProduct(productData) {
  return request({
    method: "POST",
    url: `/product`,
    body: { productData },
  });
}

export async function updateProductData(productData, productId) {
  return request({
    method: "PUT",
    url: `/product/${productId}`,
    body: { productData },
  });
}

export async function deleteProductData(productId) {
  return request({
    method: "DELETE",
    url: `/product/${productId}`,
  });
}

export async function getReviewByProduct({ productId, limit, page }) {
  return request({
    method: "GET",
    url: `/product/review/${productId}?limit=${limit}&page=${page}`,
  });
}

export async function createCustomerReview({ user_id, review, product_id }) {
  return request({
    method: "POST",
    url: `/product/review`,
    body: { user_id, review, product_id },
  });
}

export async function getAllReview() {
  return request({
    method: "GET",
    url: `/product/review`,
  });
}

export async function updateReviewStatus(reviewId, status) {
  return request({
    method: "PUT",
    url: `/product/review/${reviewId}/status`,
    body: { status },
  });
}

export async function checkoutCart(
  cartData,
  paymentMethod,
  totalPrice,
  userInfo
) {
  return request({
    method: "POST",
    url: `/product/cart`,
    body: { cartData, paymentMethod, totalPrice, userInfo },
  });
}

export async function getListCheckout(fromData, toDate, limit, offset) {
  return request({
    method: "GET",
    url: `/product/checkout/list?fromData=${fromData}&toDate=${toDate}&limit=${limit}&${offset}`,
  });
}

export async function deleteCheckoutProduct(checkoutId) {
  return request({
    method: "DELETE",
    url: `/product/checkout/${checkoutId}`,
  });
}

export async function changeCheckoutStatus(status, checkoutId) {
  return request({
    method: "PUT",
    url: `/product/checkout/status/${checkoutId}`,
    body: { status },
  });
}

export async function getCheckoutById(checkoutId) {
  return request({
    method: "GET",
    url: `/product/checkout/${checkoutId}`,
  });
}

export async function getCheckoutByUserId(userId) {
  return request({
    method: "GET",
    url: `/product/checkout/user/${userId}`,
  });
}

export async function createNewPromo({
  promoData,
  discountRule,
  listFreeProduct,
  listPromoProduct,
}) {
  return request({
    method: "POST",
    url: `/product/promo`,
    body: {
      promoData,
      discountRule,
      listFreeProduct,
      listPromoProduct,
    },
  });
}

export async function updatePromoData(
  { promoData, discountRule, listFreeProduct, listPromoProduct },
  promoId
) {
  return request({
    method: "PUT",
    url: `/product/promo/${promoId}`,
    body: {
      promoData,
      discountRule,
      listFreeProduct,
      listPromoProduct,
    },
  });
}

export async function getPromoList() {
  return request({
    method: "GET",
    url: `/product/promo/list`,
  });
}

export async function deletePromoData(promoId) {
  return request({
    method: "DELETE",
    url: `/product/promo/${promoId}`,
  });
}

export async function getPromoById(promoId) {
  return request({
    method: "GET",
    url: `/product/promo/${promoId}`,
  });
}
