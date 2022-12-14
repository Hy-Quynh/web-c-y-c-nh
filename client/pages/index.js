import * as React from "react";
import { useRouter } from "next/router";
import ProductList from "../components/ProductList";
import { getAllCategory } from "../services/category";
import { getListProduct, getMostSearchProduct, getSellingProduct } from "../services/product";
import { getAllPostList } from "../services/post";
import { dateTimeConverter } from "../utils/common";

const LIMIT_CATEGORY = 5;
const LIMIT_PRODUCT = 12;
const LIMIT_POST = 12;

export default function HomePage() {
  const [listCategory, setListCategory] = React.useState([]);
  const [listProduct, setListProduct] = React.useState([]);
  const [sellingProduct, setSellingProduct] = React.useState([]);
  const [mostSearchProduct, setMostSearchProduct] = React.useState([]);
  const [activeCategory, setActiveCategory] = React.useState(0);
  const [listPost, setListPost] = React.useState([]);
  const serviceRef = React.useRef(null);

  const getCategoryData = async () => {
    const categoryList = await getAllCategory(LIMIT_CATEGORY, 0);
    const category = categoryList?.data?.payload?.category;
    if (category?.length) {
      setListCategory(category);
      setActiveCategory(category[0]?.category_id);
    }
  };

  const getProductData = async (categoryId) => {
    const productList = await getListProduct("", LIMIT_PRODUCT, 0, categoryId);
    const { product } = productList?.data?.payload;
    if (product) {
      setListProduct(product);
    }
  };

  const getPostData = async () => {
    const postList = await getAllPostList(LIMIT_POST, 0);
    if (postList?.data?.success) {
      setListPost(postList?.data?.payload?.post);
    }
  };

  const getSellingProductInfo = async () => {
    const productList = await getSellingProduct();
    if (productList?.data?.success) {
      setSellingProduct(productList?.data?.payload);
    }
  };

  const getMostSearchProductData = async () => {
    const productList = await getMostSearchProduct()
    if ( productList?.data?.success){
      setMostSearchProduct(productList?.data?.payload)
    }
  }

  React.useEffect(() => {
    getCategoryData();
    getPostData();
    getSellingProductInfo();
    getMostSearchProductData()
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
                        Rau xanh n??ng t???m s???c kho???
                      </h1>
                      <a
                        href="/product"
                        className="btn btn-primary rounded-pill py-sm-3 px-sm-5"
                        style={{ zIndex: 1000000 }}
                      >
                        S???n ph???m
                      </a>
                      <a
                        style={{ zIndex: 1000000 }}
                        className="btn btn-secondary rounded-pill py-sm-3 px-sm-5 ms-3"
                        onClick={() => serviceRef.current.scrollIntoView()}
                      >
                        D???ch v???
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
          {/* <button
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
          </button> */}
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
                Tr??i c??y v?? rau h???u c?? t???t nh???t
              </h1>
              <p className="mb-4">
                Rau h???u c?? (Rau organic) l?? lo???i rau ???????c tr???ng v?? s???n xu???t theo
                ph????ng ph??p v?? ti??u chu???n c???a n??ng nghi???p h???u c??. ????y la?? m???t l???a
                ch???n h??ng ?????u cho ng?????i ti??u d??ng, cung c???p c??c lo???i rau c??? t????i
                ngon. Rau h???u c?? c??ng c?? h??m l?????ng dinh d?????ng cao v???i h????ng v???
                t??? nhi??n, ?????m b???o an to??n cho con ng?????i. ?????ng th???i rau h???u c??
                gi??p ?????m b???o h??? sinh th??i v?? ??a d???ng sinh h???c.
              </p>
              <p className="mb-4">
                Rau s??? ???????c tr???ng ho??n to??n t??? nhi??n, kh??ng s??? d???ng c??c ch???t ?????c
                h???i trong qu?? tr??nh tr???ng tr???t ?????n kh??u thu ho???ch v?? b???o qu???n.
                Rau h???u c?? s??? c???n ph???i ????p ???ng ???????c c??c ti??u ch??:
              </p>
              <p>
                <i className="fa fa-check text-primary me-3" />
                Kh??ng s??? d???ng ch???t bi???n ?????i gen.
              </p>
              <p>
                <i className="fa fa-check text-primary me-3" />
                Kh??ng phun thu???c di???t c??? v?? tr??? s??u.
              </p>
              <p>
                <i className="fa fa-check text-primary me-3" />
                Kh??ng phun thu???c di???t c??? v?? tr??? s??u.
              </p>
              <a
                className="btn btn-primary rounded-pill py-3 px-5 mt-3"
                href="/about"
              >
                Xem th??m
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

      {/* Feature Start */}
      <div
        className="container-fluid bg-light bg-icon my-5 py-6"
        ref={serviceRef}
      >
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">D???ch v??? c???a ch??ng t??i</h1>
            <p>C??c d???ch v??? ti???n ??ch lu??n s???n s??ng h??? tr??? b???n</p>
          </div>
          <div className="row g-4">
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img
                  className="img-fluid mb-4"
                  src="img/dien-nuoc.png"
                  alt=""
                  style={{ width: "180px", height: "180px" }}
                />
                <h4 className="mb-3">Thanh to??n ??i???n n?????c</h4>
                <p className="mb-4">
                  B???n c?? th??? d??? d??ng thanh to??n ho?? ????n ??i???n n?????c th??ng qua v??i
                  b?????c ????n gi???n
                </p>
                <a
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href="/electricity-water-payment"
                >
                  Xem th??m
                </a>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img
                  className="img-fluid mb-4"
                  src="img/live-stream.png"
                  alt=""
                  style={{ width: "180px", height: "180px" }}
                />
                <h4 className="mb-3">LiveStream h??ng ho??</h4>
                <p className="mb-4">
                  Gi???i thi???u v??? c??c s???n ph???m m???i, gi??p b???n hi???u h??n v??? s???n ph???m
                  c???a ch??ng t??i
                </p>
                <a
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href="/livestream"
                >
                  Xem th??m
                </a>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <div className="bg-white text-center h-100 p-4 p-xl-5">
                <img
                  className="img-fluid mb-4"
                  src="img/nau-an.png"
                  alt=""
                  style={{ width: "180px", height: "180px" }}
                />
                <h4 className="mb-3">C??ng th???c n???u ??n</h4>
                <p className="mb-4">
                  Nh???ng m??n ??n ?????c s???c v?? h???p d???n s??? gi??p b???a c??m h??ng ng??y c???a
                  b???n th??m ??a d???ng
                </p>
                <a
                  className="btn btn-outline-primary border-2 py-2 px-4 rounded-pill"
                  href
                >
                  Xem th??m
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
                <h1 className="display-5 mb-3">S???n ph???m m???i</h1>
                <p>Lu??n ?????m b???o AN TO??N - CH???T L?????NG - S???C KHO??? cho b???n</p>
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
                      style={{ marginTop: "20px" }}
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
                <h1 className="display-5 mb-3">S???n ph???m b??n ch???y</h1>
                <p>
                  S???n ph???m ???????c ti??u th??? nhi???u nh???t trong th???i gian qua - M???t
                  g???i ?? tuy???t v???i d??nh cho b???n
                </p>
              </div>
            </div>
          </div>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane fade show p-0 active">
              <ProductList dataSource={sellingProduct} />
            </div>
          </div>
        </div>
      </div>
      {/* Product End */}

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
                <h1 className="display-5 mb-3">S???n ph???m g???i ??</h1>
                <p>
                  S???n ph???m ???????c nhi???u ng?????i t??m ki???m nh???t trong th???i gian v???a qua
                </p>
              </div>
            </div>
          </div>
          <div className="tab-content">
            <div id="tab-1" className="tab-pane fade show p-0 active">
              <ProductList dataSource={mostSearchProduct} />
            </div>
          </div>
        </div>
      </div>
      {/* Product End */}

      {/* Blog Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div
            className="section-header text-center mx-auto mb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "500px" }}
          >
            <h1 className="display-5 mb-3">B??i vi???t m???i nh???t</h1>
            <p>Nh???ng b??i vi???t hay, cung c???p ki???n th???c tuy???t v???i d??nh cho b???n</p>
          </div>
          <div className="row g-4">
            {listPost?.map((postItem, postIndex) => {
              return (
                <div
                  className="col-lg-4 col-md-6 wow fadeInUp"
                  data-wow-delay="0.1s"
                  key={`post-item-${postIndex}`}
                >
                  <img
                    className="img-fluid"
                    src={postItem?.blog_image}
                    alt=""
                    style={{ height: "250px", width: "100%" }}
                  />
                  <div className="bg-light p-4">
                    <a
                      className="d-block h5 lh-base mb-4"
                      href={`/post/${postItem?.blog_id}`}
                      style={{
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      {postItem?.blog_title}
                    </a>
                    <div className="text-muted border-top pt-4">
                      <small className="me-3">
                        <i className="fa fa-calendar text-primary me-2" />
                        {dateTimeConverter(postItem?.create_at)}
                      </small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Blog End */}
    </div>
  );
}
