import * as React from "react";
import { useRouter } from "next/router";
import ProductList from "../components/ProductList";
import { getAllCategory } from "../services/category";
import { getListProduct } from "../services/product";

export default function HomePage() {
  const [listCategory, setListCategory] = React.useState([]);
  const [listProduct, setListProduct] = React.useState([]);
  const [activeCategory, setActiveCategory] = React.useState(0);
  const router = useRouter();

  const getCategoryData = async () => {
    const categoryList = await getAllCategory(5, 0);
    const category = categoryList?.data?.payload?.category;
    if (category?.length) {
      setListCategory(category);
      setActiveCategory(category[0]?.category_id);
    }
  };

  const getProductData = async (categoryId) => {
    const productList = await getListProduct("", 12, 0, categoryId);
    const { product } = productList?.data?.payload;
    if (product?.length) {
      setListProduct(product);
    }
  };

  React.useEffect(() => {
    getCategoryData();
  }, []);

  React.useEffect(() => {
    if (activeCategory > 0) {
      getProductData(activeCategory);
    }
  }, [activeCategory]);

  return (
    <div>
      <div
        className="container-fluid p-0 mb-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div
          id="header-carousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img className="w-100" src="img/carousel-1.jpg" alt="Image" />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-lg-7">
                      <h1 className="display-2 mb-5 animated slideInDown">
                        Organic Food Is Good For Health
                      </h1>
                      <a
                        href
                        className="btn btn-primary rounded-pill py-sm-3 px-sm-5"
                      >
                        Sản phẩm
                      </a>
                      <a
                        href
                        className="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3"
                      >
                        Dịch vụ
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img className="w-100" src="img/carousel-2.jpg" alt="Image" />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-lg-7">
                      <h1 className="display-2 mb-5 animated slideInDown">
                        Natural Food Is Always Healthy
                      </h1>
                      <a
                        href
                        className="btn btn-primary rounded-pill py-sm-3 px-sm-5"
                      >
                        Products
                      </a>
                      <a
                        href
                        className="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3"
                      >
                        Services
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#header-carousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      {/* Carousel End */}
      {/* About Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
              <div className="about-img position-relative overflow-hidden p-5 pe-0">
                <img className="img-fluid w-100" src="img/about.jpg" />
              </div>
            </div>
            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
              <h1 className="display-5 mb-4">
                Trái cây và rau hữu cơ tốt nhất
              </h1>
              <p className="mb-4">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit,
                sed stet lorem sit clita duo justo magna dolore erat amet
              </p>
              <p>
                <i className="fa fa-check text-primary me-3" />
                Tempor erat elitr rebum at clita
              </p>
              <p>
                <i className="fa fa-check text-primary me-3" />
                Aliqu diam amet diam et eos
              </p>
              <p>
                <i className="fa fa-check text-primary me-3" />
                Clita duo justo magna dolore erat amet
              </p>
              <a className="btn btn-primary rounded-pill py-3 px-5 mt-3" href>
                Xem thêm
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}
      {/* Feature Start */}
      <div className="container-fluid bg-light bg-icon my-5 py-6">
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">Dịch vụ của chúng tôi</h1>
            <p>
              Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam
              justo sed rebum vero dolor duo.
            </p>
          </div>
          <div className="row g-4">
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img className="img-fluid mb-4" src="img/icon-1.png" alt="" />
                <h4 className="mb-3">Natural Process</h4>
                <p className="mb-4">
                  Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum
                  diam justo sed vero dolor duo.
                </p>
                <a
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href
                >
                  Xem thêm
                </a>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img className="img-fluid mb-4" src="img/icon-2.png" alt="" />
                <h4 className="mb-3">Organic Products</h4>
                <p className="mb-4">
                  Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum
                  diam justo sed vero dolor duo.
                </p>
                <a
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href
                >
                  Xem thêm
                </a>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img className="img-fluid mb-4" src="img/icon-3.png" alt="" />
                <h4 className="mb-3">Biologically Safe</h4>
                <p className="mb-4">
                  Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum
                  diam justo sed vero dolor duo.
                </p>
                <a
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href
                >
                  Xem thêm
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Feature End */}
      {/* Product Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-0 gx-5 align-items-end">
            <div className="col-lg-6">
              <div
                className="section-header text-start mb-5 wow fadeInUp"
                data-wow-delay="0.1s"
                style={{ maxWidth: "500px" }}
              >
                <h1 className="display-5 mb-3">Sản phẩm của tôi</h1>
                <p>
                  Luôn đảm bảo AN TOÀN - CHẤT LƯỢNG - SỨC KHOẺ cho bạn
                </p>
              </div>
            </div>
            <div
              className="col-lg-6 text-start text-lg-end wow slideInRight"
              data-wow-delay="0.1s"
            >
              <ul className="nav nav-pills d-inline-flex justify-content-end mb-5">
                {listCategory?.map((item, index) => {
                  return (
                    <li
                      className="nav-item me-2"
                      key={`home-category-item-${index}`}
                      onClick={() => {
                        setActiveCategory(item?.category_id);
                      }}
                    >
                      <a
                        className={`btn btn-outline-primary border-2 ${
                          activeCategory === item?.category_id ? "active" : ""
                        }`}
                        data-bs-toggle="pill"
                      >
                        {item?.category_name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane fade show p-0 active">
              <ProductList dataSource={listProduct} />
            </div>
          </div>
        </div>
      </div>
      {/* Product End */}
      
      {/* Testimonial Start */}
      <div className="container-fluid bg-light bg-icon py-6 mb-5">
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">Đánh giá của khách hàng</h1>
            <p>
              Những đánh giá chân thật từ khách hàng sẽ giúp bạn có những lựa chọn tốt hơn
            </p>
          </div>
          <div
            className="owl-carousel testimonial-carousel wow fadeInUp"
            data-wow-delay="0.1s"
          >
            <div className="testimonial-item position-relative bg-white p-5 mt-4">
              <i className="fa fa-quote-left fa-3x text-primary position-absolute top-0 start-0 mt-n4 ms-5" />
              <p className="mb-4">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam
                amet diam et eos. Clita erat ipsum et lorem et sit.
              </p>
              <div className="d-flex align-items-center">
                <img
                  className="flex-shrink-0 rounded-circle"
                  src="img/testimonial-1.jpg"
                  alt=""
                />
                <div className="ms-3">
                  <h5 className="mb-1">Client Name</h5>
                  <span>Profession</span>
                </div>
              </div>
            </div>
            <div className="testimonial-item position-relative bg-white p-5 mt-4">
              <i className="fa fa-quote-left fa-3x text-primary position-absolute top-0 start-0 mt-n4 ms-5" />
              <p className="mb-4">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam
                amet diam et eos. Clita erat ipsum et lorem et sit.
              </p>
              <div className="d-flex align-items-center">
                <img
                  className="flex-shrink-0 rounded-circle"
                  src="img/testimonial-2.jpg"
                  alt=""
                />
                <div className="ms-3">
                  <h5 className="mb-1">Client Name</h5>
                  <span>Profession</span>
                </div>
              </div>
            </div>
            <div className="testimonial-item position-relative bg-white p-5 mt-4">
              <i className="fa fa-quote-left fa-3x text-primary position-absolute top-0 start-0 mt-n4 ms-5" />
              <p className="mb-4">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam
                amet diam et eos. Clita erat ipsum et lorem et sit.
              </p>
              <div className="d-flex align-items-center">
                <img
                  className="flex-shrink-0 rounded-circle"
                  src="img/testimonial-3.jpg"
                  alt=""
                />
                <div className="ms-3">
                  <h5 className="mb-1">Client Name</h5>
                  <span>Profession</span>
                </div>
              </div>
            </div>
            <div className="testimonial-item position-relative bg-white p-5 mt-4">
              <i className="fa fa-quote-left fa-3x text-primary position-absolute top-0 start-0 mt-n4 ms-5" />
              <p className="mb-4">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam
                amet diam et eos. Clita erat ipsum et lorem et sit.
              </p>
              <div className="d-flex align-items-center">
                <img
                  className="flex-shrink-0 rounded-circle"
                  src="img/testimonial-4.jpg"
                  alt=""
                />
                <div className="ms-3">
                  <h5 className="mb-1">Client Name</h5>
                  <span>Profession</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonial End */}
      {/* Blog Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">Bài viết mới nhất</h1>
            <p>
              Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam
              justo sed rebum vero dolor duo.
            </p>
          </div>
          <div className="row g-4">
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <img className="img-fluid" src="img/blog-1.jpg" alt="" />
              <div className="bg-light p-4">
                <a className="d-block h5 lh-base mb-4" href>
                  How to cultivate organic fruits and vegetables in own firm
                </a>
                <div className="text-muted border-top pt-4">
                  <small className="me-3">
                    <i className="fa fa-user text-primary me-2" />
                    Admin
                  </small>
                  <small className="me-3">
                    <i className="fa fa-calendar text-primary me-2" />
                    01 Jan, 2045
                  </small>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <img className="img-fluid" src="img/blog-2.jpg" alt="" />
              <div className="bg-light p-4">
                <a className="d-block h5 lh-base mb-4" href>
                  How to cultivate organic fruits and vegetables in own firm
                </a>
                <div className="text-muted border-top pt-4">
                  <small className="me-3">
                    <i className="fa fa-user text-primary me-2" />
                    Admin
                  </small>
                  <small className="me-3">
                    <i className="fa fa-calendar text-primary me-2" />
                    01 Jan, 2045
                  </small>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <img className="img-fluid" src="img/blog-3.jpg" alt="" />
              <div className="bg-light p-4">
                <a className="d-block h5 lh-base mb-4" href>
                  How to cultivate organic fruits and vegetables in own firm
                </a>
                <div className="text-muted border-top pt-4">
                  <small className="me-3">
                    <i className="fa fa-user text-primary me-2" />
                    Admin
                  </small>
                  <small className="me-3">
                    <i className="fa fa-calendar text-primary me-2" />
                    01 Jan, 2045
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Blog End */}

      {/* Back to Top */}
      <a
        href="#"
        className="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"
      >
        <i className="bi bi-arrow-up" />
      </a>
    </div>
  );
}
