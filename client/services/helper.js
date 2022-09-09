import { request } from "../utils/request";

export function getAllHelper() {
  return request({
    method: "GET",
    url: `/helper`,
  });
}

export function createNewHelper(helperData) {
  return request({
    method: "POST",
    url: `/helper`,
    body: {helperData}
  });
}

export function updateHelperData(helperData, helperId) {
  return request({
    method: "PUT",
    url: `/helper/${helperId}`,
    body: {helperData}
  });
}

export function deleteHelper(helperId) {
  return request({
    method: "DELETE",
    url: `/helper/${helperId}`,
  });
}