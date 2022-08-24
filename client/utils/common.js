import moment from "moment";
import { USER_CART_INFO } from "./constants";

const hasNumber = (string) => {
  return /\d/.test(string);
};

const hasSpecicalCharacter = (string) => {
  return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(string);
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const isVietnamesePhoneNumber = (number) => {
  return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
};

const dateTimeConverter = (dateTime) => {
  if (dateTime) {
    return moment(dateTime).format("DD-MM-YYYY");
  }
  return "";
};

const parseJSON = (inputString, fallback) => {
  if (inputString) {
    try {
      return JSON.parse(inputString);
    } catch (e) {
      return fallback;
    }
  }
};

const addProductToCart = (cardData) => {
  const currCart =
    typeof window !== "undefined" && localStorage.getItem(USER_CART_INFO)
      ? parseJSON(localStorage.getItem(USER_CART_INFO))
      : [];

  if (currCart?.length) {
    const findPrd = currCart?.findIndex(
      (item) => item?.product_id === cardData?.product_id
    );
    if (findPrd >= 0) {
      currCart[findPrd].quantity =
        Number(currCart[findPrd].quantity) + Number(cardData?.quantity);
      return localStorage.setItem(USER_CART_INFO, JSON.stringify(currCart));
    }
  }
  currCart?.push(cardData);
  localStorage.setItem(USER_CART_INFO, JSON.stringify(currCart));
};

export {
  hasNumber,
  validateEmail,
  isVietnamesePhoneNumber,
  hasSpecicalCharacter,
  dateTimeConverter,
  parseJSON,
  addProductToCart,
};
