import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FORMAT_NUMBER,
  USER_CART_INFO,
  USER_INFO_KEY,
} from "../../utils/constants";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  isVietnamesePhoneNumber,
  parseJSON,
  validateEmail,
} from "../../utils/common";
import CustomDialog from "../../components/CustomDialog";
import CustomInput from "../../components/CustomInput";
import { checkoutCart } from "../../services/product";
import _ from "lodash";

const PAYMENT_METHOD = [
  { label: "Thanh toán khi nhận hàng", value: "COD" },
  { label: "Thanh toán qua thẻ", value: "VISA" },
];

export default function CartPage() {
  const [cartProduct, setCartProduct] = useState([]);
  const [visibleCheckoutModal, setVisibleCheckoutModal] = useState(false);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [userInfo, setUserInfo] = useState({});

  const userData =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(USER_INFO_KEY))
      : {};
  const router = useRouter();

  useEffect(() => {
    if (!userData?.user_id) {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này");
      router.push("/login");
    } else {
      const currCart = localStorage.getItem(USER_CART_INFO)
        ? parseJSON(localStorage.getItem(USER_CART_INFO))
        : [];
      setCartProduct(currCart);
      setUserInfo(userData);
    }
  }, []);

  const handleCheckout = async () => {
    const { first_name, last_name, email, address, phone_number } = userInfo;

    const checkNull = _.compact([
      first_name,
      last_name,
      email,
      address,
      phone_number,
    ]);
    if (checkNull.length < 5) {
      toast.error("Thông tin không được để trống");
      return false;
    }

    if (!isVietnamesePhoneNumber(phone_number)) {
      toast.error("Số điện thoại sai định dạng");
      return false;
    }

    if (!validateEmail(email)) {
      toast.error("Email sai định dạng");
      return false;
    }
    const totalPrice = calculateTotalPrice(cartProduct);

    const checkoutResponse = await checkoutCart(
      cartProduct,
      paymentOption,
      totalPrice,
      userInfo
    );
    if (checkoutResponse?.data?.success) {
      localStorage.removeItem(USER_CART_INFO);
      setCartProduct([]);
      setVisibleCheckoutModal(false);
      return true;
    }
    return false;
  };

  const calculateTotalPrice = (lstProduct) => {
    const total = lstProduct?.reduce((previous, next) => {
      if (
        Number(next.product_sale) > 0 &&
        Number(next.product_sale) !== Number(next.product_price)
      ) {
        return previous + Number(next.quantity) * Number(next.product_sale);
      } else {
        return previous + Number(next.quantity) * Number(next.product_price);
      }
    }, 0);
    return total || 0;
  };

  return (
    <div className="container" style={{ marginTop: "250px" }}>
      <table id="cart" className="table table-hover table-condensed">
        <thead>
          <tr>
            <th style={{ width: "50%" }}>Sản phẩm</th>
            <th style={{ width: "10%" }}>Giá</th>
            <th style={{ width: "10%" }}>Giá giảm</th>
            <th style={{ width: "8%" }}>Số lượng</th>
            <th style={{ width: "22%" }} className="text-center">
              Tổng
            </th>
            <th style={{ width: "10%" }} />
          </tr>
        </thead>
        <tbody>
          {cartProduct?.map((cartItem, cartIndex) => {
            return (
              <tr key={`cart-item-${cartIndex}`}>
                <td data-th="Product">
                  <div className="row">
                    <div className="col-sm-2 hidden-xs">
                      <img
                        src={cartItem?.product_image}
                        alt="..."
                        className="img-responsive"
                        width={50}
                        height={50}
                      />
                    </div>
                    <div className="col-sm-10">
                      <h5 className="nomargin">{cartItem?.product_name}</h5>
                    </div>
                  </div>
                </td>
                <td data-th="Price">
                  {FORMAT_NUMBER.format(Number(cartItem.product_price))} đ
                </td>
                <td data-th="Price">
                  {cartItem.product_sale > 0 &&
                  cartItem.product_sale !== cartItem.product_price
                    ? FORMAT_NUMBER.format(Number(cartItem.product_sale)) + "đ"
                    : ""}
                </td>
                <td data-th="Quantity">
                  <input
                    type="number"
                    className="form-control text-center"
                    value={cartItem?.quantity}
                    onChange={(event) => {
                      const currCart = [...cartProduct];
                      const findIndex = currCart?.findIndex(
                        (item) => item?.product_id === cartItem?.product_id
                      );
                      if (findIndex >= 0) {
                        currCart[findIndex].quantity = event.target.value;
                        setCartProduct(currCart);
                        localStorage.setItem(
                          USER_CART_INFO,
                          JSON.stringify(currCart)
                        );
                      }
                    }}
                  />
                </td>
                <td data-th="Subtotal" className="text-center">
                  {FORMAT_NUMBER.format(
                    Number(cartItem?.quantity) *
                      (cartItem.product_sale > 0 &&
                      cartItem.product_sale !== cartItem.product_price
                        ? Number(cartItem?.product_sale)
                        : Number(cartItem?.product_price))
                  )}{" "}
                  đ
                </td>
                <td className="actions" data-th>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      const currCart = [...cartProduct]?.filter(
                        (item) => item?.product_id !== cartItem?.product_id
                      );
                      localStorage.setItem(
                        USER_CART_INFO,
                        JSON.stringify(currCart)
                      );
                      setCartProduct(currCart);
                    }}
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="visible-xs">
            <td className="text-center">
              <strong>
                Tổng: {FORMAT_NUMBER.format(calculateTotalPrice(cartProduct))} đ
              </strong>
            </td>
          </tr>
          <tr>
            <td>
              <a href="/" className="btn btn-warning">
                <i className="fa fa-angle-left" /> Tiếp tục mua sắm
              </a>
            </td>
            <td colSpan={2} className="hidden-xs" />
            <td className="hidden-xs text-center">
              <strong style={{ whiteSpace: "nowrap" }}>
                Tổng: {FORMAT_NUMBER.format(calculateTotalPrice(cartProduct))} đ
              </strong>
            </td>
            <td colSpan={1} className="hidden-xs" />
            <td style={{ textAlign: "right" }}>
              <a
                className="btn btn-success btn-block"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  width: "fit-content",
                }}
                onClick={() => setVisibleCheckoutModal(true)}
              >
                <span>Thanh toán </span>
                <span style={{ marginLeft: "20px" }}>
                  <i className="fa fa-angle-right" />
                </span>
              </a>
            </td>
          </tr>
        </tfoot>
      </table>

      {visibleCheckoutModal && (
        <CustomDialog
          onClose={() => setVisibleCheckoutModal(false)}
          visible={visibleCheckoutModal}
          title="Xác nhận thanh toán"
          closeTitle="Đóng"
          closeSubmitTitle="Xác nhận"
          handleSubmit={() => {
            return handleCheckout();
          }}
          maxWidth="700px"
          width="700px"
        >
          <h5 style={{ textAlign: "center" }}>Thông tin khách hàng</h5>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ width: "48%" }}>
              <CustomInput
                label="Họ"
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                value={userInfo?.first_name}
                onChange={(event) =>
                  setUserInfo({
                    ...userInfo,
                    first_name: event.target.value,
                  })
                }
              />
            </div>
            <div style={{ width: "48%" }}>
              <CustomInput
                label="Tên"
                id="post-title"
                variant="filled"
                style={{ marginTop: 11, textAlign: "left" }}
                value={userInfo?.last_name}
                onChange={(event) =>
                  setUserInfo({
                    ...userInfo,
                    last_name: event.target.value,
                  })
                }
              />
            </div>
          </div>
          <CustomInput
            label="Số điện thoại"
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            value={userInfo?.phone_number}
            onChange={(event) =>
              setUserInfo({
                ...userInfo,
                phone_number: event.target.value,
              })
            }
          />
          <CustomInput
            label="Email"
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            value={userInfo?.email}
            onChange={(event) =>
              setUserInfo({ ...userInfo, email: event.target.value })
            }
          />

          <CustomInput
            label="Địa chỉ"
            id="post-title"
            variant="filled"
            style={{ marginTop: 11, textAlign: "left" }}
            value={userInfo?.address}
            onChange={(event) =>
              setUserInfo({
                ...userInfo,
                address: event.target.value,
              })
            }
          />
          <hr />
          <h5 style={{ textAlign: "center", marginTop: "20px" }}>
            Phương thức thanh toán
          </h5>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            {PAYMENT_METHOD?.map((item, index) => {
              return (
                <div
                  key={`payment-item-${index}`}
                  onClick={() => {
                    if (item?.value === "VISA") {
                      return toast.error(
                        "Chưa hỗ trợ chức năng thanh toán này"
                      );
                    }
                    setPaymentOption(item?.value);
                  }}
                  style={{
                    padding: "30px",
                    border: "1px solid rgb(60,185,20)",
                    background:
                      paymentOption === item?.value
                        ? "rgb(60,185,20)"
                        : "white",
                    width: "40%",
                  }}
                >
                  {item?.label}
                </div>
              );
            })}
          </div>
          <hr />
          <h6 style={{ color: "red", textAlign: "right" }}>
            Số tiền thanh toán:{" "}
            {FORMAT_NUMBER.format(calculateTotalPrice(cartProduct))}đ
          </h6>
        </CustomDialog>
      )}
    </div>
  );
}
