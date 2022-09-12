import React from "react";
import LoginIcon from "@mui/icons-material/Login";
import { USER_CART_INFO, USER_INFO_KEY } from "../../utils/constants";
import { useRouter } from "next/router";

export default function Header() {
  const userData =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(USER_INFO_KEY))
      : {};
  const router = useRouter();

  return (
    <div
      className="container-fluid fixed-top px-0 wow fadeIn"
      data-wow-delay="0.1s"
    >
      <div className="top-bar row gx-0 align-items-center d-none d-lg-flex">
        <div className="col-lg-6 px-5 text-start">
          <small>
            <i className="fa fa-map-marker-alt me-2" />
            Trường Đại học Bách Khoa Hà Nội
          </small>
          <small className="ms-4">
            <i className="fa fa-envelope me-2" />
            info@example.com
          </small>
        </div>
        <div className="col-lg-6 px-5 text-end">
          <small>Theo dõi chúng tôi tại:</small>
          <a className="text-body ms-3" href>
            <i className="fab fa-facebook-f" />
          </a>
          <a className="text-body ms-3" href>
            <i className="fab fa-twitter" />
          </a>
          <a className="text-body ms-3" href>
            <i className="fab fa-linkedin-in" />
          </a>
          <a className="text-body ms-3" href>
            <i className="fab fa-instagram" />
          </a>
        </div>
      </div>
      <nav
        className="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <a href="/" className="navbar-brand ms-4 ms-lg-0">
          <h1 className="fw-bold text-primary m-0">
            F<span className="text-secondary">oo</span>dy
          </h1>
        </a>
        <button
          type="button"
          className="navbar-toggler me-4"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto p-4 p-lg-0">
            <a href="/" className="nav-item nav-link active">
              Trang chủ
            </a>
            <a href="/product" className="nav-item nav-link">
              Sản phẩm
            </a>
            <a href="/post" className="nav-item nav-link">
              Bài viết
            </a>
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                Dịch vụ
              </a>
              <div className="dropdown-menu m-0">
                <a
                  className="dropdown-item"
                  style={{ cursor: "pointer" }}
                  href="/electricity-water-payment"
                >
                  Thanh toán điện nước
                </a>
                <a
                  className="dropdown-item"
                  style={{ cursor: "pointer" }}
                  href="/livestream"
                >
                  Live Stream
                </a>
                <a
                  className="dropdown-item"
                  style={{ cursor: "pointer" }}
                  href="/cooking-recipe"
                >
                  Công thức nấu ăn
                </a>
              </div>
            </div>
            <a href="/about" className="nav-item nav-link">
              Về chúng tôi
            </a>
            <a href="/feedback" className="nav-item nav-link">
              Góp ý
            </a>
            <a href="/faq" className="nav-item nav-link">
              FAQ
            </a>
          </div>
          <div className="d-none d-lg-flex ms-2">
            {userData?.user_id ? (
              <div className="nav-item dropdown">
                <a className="btn-sm-square bg-white rounded-circle ms-3">
                  <small className="fa fa-user text-body" />
                </a>
                <div className="dropdown-menu" style={{ marginLeft: "-40px" }}>
                  <a
                    className="dropdown-item"
                    style={{ cursor: "pointer" }}
                    href="/personal"
                  >
                    Trang cá nhân
                  </a>
                  <a
                    className="dropdown-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      localStorage.removeItem(USER_INFO_KEY);
                      localStorage.removeItem(USER_CART_INFO);
                      router.push("/login");
                    }}
                  >
                    Đăng xuất
                  </a>
                </div>
              </div>
            ) : (
              <a
                className="btn-sm-square bg-white rounded-circle ms-3"
                href="/login"
              >
                <LoginIcon sx={{ marginLeft: "-5px" }} />
              </a>
            )}
            <a
              className="btn-sm-square bg-white rounded-circle ms-3"
              href="/cart"
            >
              <small className="fa fa-shopping-bag text-body" />
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
