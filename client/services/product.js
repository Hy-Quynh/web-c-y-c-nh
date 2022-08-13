import { request } from "../utils/request";

export async function getListProduct(search, limit, offset) {
  return request({
    method: "GET",
    url: `/product?search=${search}&limit=${limit}&offset=${offset}`
  });
}

export async function getProductById(productId) {
  return request({
    method: "GET",
    url: `/product/${productId}`
  });
}

export async function createNewProduct(productData) {
  return request({
    method: "POST",
    url: `/product`,
    body: {productData}
  });
}

export async function updateProductData(productData, productId) {
  return request({
    method: "PUT",
    url: `/product/${productId}`,
    body: {productData}
  });
}

export async function deleteProductData(productId) {
  return request({
    method: "DELETE",
    url: `/product/${productId}`
  });
}