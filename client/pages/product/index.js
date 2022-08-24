import React, { useEffect, useRef, useState } from "react";
import ProductList from "../../components/ProductList";
import { getAllCategory } from "../../services/category";
import { getListProduct } from "../../services/product";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import style from "./style.module.scss";
import { FORMAT_NUMBER } from "../../utils/constants";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useRouter } from "next/router";

const PRODUCT_IN_PAGE = 2;
const MIN_PRICE = 1000;
const MAX_PRICE = 10000000;

const PrettoSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 60,
    height: 60,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export default function Product() {
  const [listCategory, setListCategory] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [activeCategory, setActiveCategory] = useState(-1);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [priceSlider, setPriceSlider] = useState([MIN_PRICE, MAX_PRICE]);
  const searchText = useRef("");
  const searchInputRef = useRef(null);

  const getCategoryData = async () => {
    const categoryList = await getAllCategory();
    const category = categoryList?.data?.payload?.category;
    if (category?.length) {
      setListCategory(category);
      setActiveCategory(category[0]?.category_id);
    }
  };

  const getProductData = async (
    categoryId,
    page,
    search,
    minPrice,
    maxPrice
  ) => {
    const productList = await getListProduct(
      search,
      PRODUCT_IN_PAGE,
      page,
      categoryId,
      minPrice,
      maxPrice
    );
    const product = productList?.data?.payload?.product;
    const total = productList?.data?.payload?.total;
    if (product) {
      if (page > currentPage) {
        const newPrd = [...listProduct];
        newPrd?.push(...product);
        setListProduct(newPrd);
      } else {
        setListProduct(product);
      }

      setTotalPage(Math.ceil(total / PRODUCT_IN_PAGE));
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  React.useEffect(() => {
    if (activeCategory > 0) {
      getProductData(
        activeCategory,
        currentPage,
        searchText.current,
        priceSlider?.[0],
        priceSlider?.[1]
      );
    }
  }, [activeCategory]);

  return (
    <div>
      <div
        className="container-fluid page-header mb-5 wow fadeIn"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <h1 className="display-3 mb-3 animated slideInDown">Trang sản phẩm</h1>
          <nav aria-label="breadcrumb animated slideInDown">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a className="text-body" href="/">
                  Trang chủ
                </a>
              </li>
              <li
                className="breadcrumb-item text-dark active"
                aria-current="page"
              >
                Sản phẩm
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Page Header End */}
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
                <h1 className="display-5 mb-3">Sản phẩm</h1>
                <p>
                  Luôn cam kết mang đến những sản phẩm tốt và chất lượng nhất đến với bạn
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
          <div className="row g-0 gx-5 align-items-start mb-5">
            <div className={`col-lg-5`}>
              <Typography gutterBottom>Tìm kiếm</Typography>
              <div className={style.productSearchBox}>
                <form onSubmit={(event) => event.preventDefault()}>
                  <input
                    type="search"
                    plaseholder="search"
                    onChange={(event) =>
                      (searchText.current = event.target.value)
                    }
                    ref={searchInputRef}
                  />
                  <button
                    type="submit"
                    onClick={() =>
                      getProductData(
                        activeCategory,
                        currentPage,
                        searchText.current,
                        priceSlider?.[0],
                        priceSlider?.[1]
                      )
                    }
                  >
                    <i className="fa fa-search" aria-hidden="true" />
                  </button>
                </form>
              </div>
            </div>
            <div className={`col-lg-2`} />
            <div className="col-lg-5">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div style={{ width: "calc(100% - 90px)" }}>
                  <Typography gutterBottom>Lọc theo giá</Typography>
                  <PrettoSlider
                    valueLabelDisplay="auto"
                    aria-label="pretto slider"
                    value={priceSlider}
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    onChange={(event, newValue) => {
                      setPriceSlider(newValue);
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="px-3 py-1"
                      style={{
                        border: "1px solid rgb(60,185,20)",
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {FORMAT_NUMBER.format(priceSlider[0])}
                    </div>
                    <div
                      className="px-3 py-1"
                      style={{
                        border: "1px solid rgb(60,185,20)",
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {FORMAT_NUMBER.format(priceSlider[1])}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "60px",
                    marginLeft: "30px",
                    marginTop: "-15px",
                  }}
                >
                  <FilterAltIcon
                    sx={{ cursor: "pointer", color: "#3CB914" }}
                    onClick={() =>
                      getProductData(
                        activeCategory,
                        currentPage,
                        searchText.current,
                        priceSlider?.[0],
                        priceSlider?.[1]
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="tab-content">
            {listProduct?.length ? (
              <ProductList
                dataSource={listProduct?.map((item) => ({
                  ...item,
                  badge: false,
                }))}
              />
            ) : (
              <div style={{textAlign: 'center'}}>Không có sản phẩm phù hợp</div>
            )}
            {currentPage + 1 < totalPage ? (
              <div class="col-12 text-center mt-5">
                <a
                  class="btn btn-primary rounded-pill py-3 px-5"
                  onClick={() =>
                    getProductData(
                      activeCategory,
                      currentPage + 1,
                      searchText.current,
                      priceSlider[0],
                      priceSlider[1]
                    )
                  }
                >
                  Xem thêm
                </a>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      {/* Product End */}
    </div>
  );
}
