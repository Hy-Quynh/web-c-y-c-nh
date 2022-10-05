const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/util");
const moment = require("moment");
const Stripe = require("stripe");
const stripe = new Stripe(
  "sk_test_51KHAdUKzeo9d90anaaPYVtbwYcvv6MXdZ1StdTl4z0YOsywAp0e1F2cNhX5JyjoAtoqLmQFtLOZZSMLOY0D2MpiE00qjsdPDRR"
);

module.exports = {
  getProductList: async (
    search,
    category,
    limit,
    offset,
    minPrice,
    maxPrice
  ) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const res = await postgresql.query(
        `SELECT * FROM product WHERE ${
          search && search !== "undefined"
            ? `lower(unaccent(product_name)) LIKE '%${search
                ?.toLowerCase()
                ?.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")}%'`
            : `product_name != ''`
        } AND ${
          category && category !== "undefined"
            ? `product_category = ${category}`
            : `product_category != -1`
        } AND ${
          minPrice && minPrice !== "undefined"
            ? `product_price >= ${minPrice}`
            : `product_price >= 0`
        } AND ${
          maxPrice && maxPrice !== "undefined"
            ? `product_price <= ${maxPrice}`
            : `product_price >= 0`
        } ORDER BY product_id DESC ${limitOffset} `
      );
      return res?.rows || [];
    } catch (error) {
      console.log("getProductList error >>>> ", error);
      return [];
    }
  },

  getTotalProduct: async (search, category, minPrice, maxPrice) => {
    try {
      const res = await postgresql.query(
        `SELECT COUNT(product_id) as total_product FROM product WHERE ${
          search && search !== "undefined"
            ? `product_name LIKE '%${search}%'`
            : `product_name != ''`
        } AND ${
          category && category !== "undefined"
            ? `product_category = ${category}`
            : `product_category != -1`
        } AND ${
          minPrice && minPrice !== "undefined"
            ? `product_price >= ${minPrice}`
            : `product_price >= 0`
        } AND ${
          maxPrice && maxPrice !== "undefined"
            ? `product_price <= ${maxPrice}`
            : `product_price >= 0`
        }`
      );

      if (res?.rows?.length) return res?.rows[0]?.total_product;
      return 0;
    } catch (error) {
      console.log("getTotalProduct error >>>> ", error);
      return 0;
    }
  },

  getProductById: async (productId) => {
    try {
      const res = await postgresql.query(
        `SELECT p.*, c.category_name, (SELECT COUNT(review_id) FROM product_review pr WHERE pr.product_id = p.product_id ) as total_review FROM product p JOIN category c ON p.product_category = c.category_id WHERE p.product_id=${Number(
          productId
        )}`
      );
      return res?.rows?.[0] || {};
    } catch (error) {
      console.log("getProductById error >>>> ", error);
      return {};
    }
  },

  createNewProduct: async (
    product_name,
    product_description,
    product_image,
    product_price,
    product_category,
    product_quantity
  ) => {
    try {
      const res =
        await postgresql.query(`INSERT INTO product(product_name, product_description, product_image, product_price, 
        product_category, product_status, create_at, product_quantity) VALUES('${product_name}', '${product_description}', '${product_image}', ${Number(
          product_price
        )}, ${Number(product_category)}, 1, Now(), ${Number(
          product_quantity
        )})`);
      return res?.rows ? true : false;
    } catch (error) {
      console.log("createNewProduct error >>>> ", error);
      return false;
    }
  },

  updateProductData: async (
    {
      product_name,
      product_description,
      product_image,
      product_price,
      product_category,
      product_quantity,
    },
    productId
  ) => {
    try {
      const res =
        await postgresql.query(`UPDATE product SET product_name='${product_name}', product_description='${product_description}', product_image='${product_image}',
      product_price=${Number(product_price)}, product_category=${Number(
          product_category
        )}, product_quantity=${Number(
          product_quantity
        )} WHERE product_id=${Number(productId)}`);
      return res?.rows ? true : false;
    } catch (error) {
      console.log("updateProductData error >>>> ", error);
      return false;
    }
  },

  deleteProductData: async (productId) => {
    try {
      const res = await postgresql.query(
        `DELETE FROM product WHERE product_id=${Number(productId)}`
      );
      return res?.rows ? true : false;
    } catch (error) {
      console.log("deleteProductData error >>>> ", error);
      return false;
    }
  },

  getReviewByProductId: async (productId, limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const reviewRes = await postgresql.query(
        `SELECT tr.*, ur.first_name, ur.last_name FROM product_review tr JOIN users ur ON tr.user_id = ur.user_id WHERE product_id=${Number(
          productId
        )} ORDER BY review_date DESC ${limitOffset}`
      );

      const reviewData = [...(reviewRes?.rows || [])];

      for (let i = 0; i < reviewData?.length; i++) {
        const userChildrenReview = await postgresql.query(
          `SELECT prc.*,  ur.first_name, ur.last_name FROM product_review_children prc JOIN users ur ON prc.user_id = ur.user_id WHERE review_id=${Number(
            reviewData?.[i]?.review_id
          )} AND author_type != 'admin'`
        );
        const adminChildrenReview = await postgresql.query(
          `SELECT prc.* FROM product_review_children prc WHERE review_id=${Number(
            reviewData?.[i]?.review_id
          )} AND author_type = 'admin'`
        );
        const allChildrenReview = (userChildrenReview?.rows || [])?.concat(
          adminChildrenReview?.rows || []
        );

        allChildrenReview?.sort(function (x, y) {
          return y.review_date - x.review_date;
        });

        reviewData[i].children_review = [...allChildrenReview];
      }

      return reviewData || [];
    } catch (error) {
      console.log("getReviewByProductId error >>>> ", error);
      return [];
    }
  },

  getTotalReviewByProductId: async (productId) => {
    try {
      const allItem = await postgresql.query(
        `select COUNT(product_review.review_id) as total_item from product_review WHERE product_id=${Number(
          productId
        )}`
      );

      return allItem?.rows?.[0]?.total_item || 0;
    } catch (error) {
      console.log("getTotalReviewByProductId error >>>> ", error);
      return 0;
    }
  },

  createNewReview: async (user_id, review, product_id, star) => {
    try {
      const reviewRes = await postgresql.query(
        `INSERT INTO product_review(review_date, user_id, review, product_id, status, star) VALUES(Now(), ${Number(
          user_id
        )}, '${review}', ${Number(product_id)}, 1, ${Number(star)})`
      );
      return reviewRes?.rows ? true : false;
    } catch (error) {
      console.log("createNewReview error >>>> ", error);
      return false;
    }
  },

  changeReviewStatus: async (reviewId, status) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE product_review SET status=${Number(
          status
        )} WHERE review_id=${reviewId}`
      );

      return updateRes?.rows ? true : false;
    } catch (error) {
      console.log("changeReviewStatus error >>>> ", error);
      return false;
    }
  },

  getAllReview: async () => {
    try {
      const review = await postgresql.query(
        `SELECT tr.*, pd.name as product_name, pd.image as product_image, ur.name as user_name, (SELECT COUNT(*) AS number_of_user FROM product_review 
        WHERE product_id = tr.product_id) 
        FROM product_review tr JOIN users ur ON tr.user_id = ur.user_id JOIN product pd ON pd.product_id = tr.product_id`
      );
      return review?.rows || [];
    } catch (error) {
      console.log("getAllReview error >>>> ", error);
      return [];
    }
  },

  getProductQuantity: async (productId) => {
    try {
      const response = await postgresql.query(
        `SELECT product_quantity FROM product WHERE product_id=${Number(
          productId
        )}`
      );
      if (response?.rows) {
        return response?.rows?.[0]?.product_quantity;
      }
      return 0;
    } catch (error) {
      console.log("getProductQuantity error >>>> ", error);
      return 0;
    }
  },

  createCartData: async (
    cartData,
    totalPrice,
    paymentMethod,
    userInfo,
    paymentId,
    pickUpOption,
    pickUpTime
  ) => {
    try {
      let checkValid = true;
      for (
        let productIndex = 0;
        productIndex < cartData?.length;
        productIndex++
      ) {
        const quantity = await postgresql.query(
          `SELECT product_quantity FROM product WHERE product_id=${Number(
            cartData?.[productIndex]?.product_id
          )}`
        );
        if (
          quantity?.rows?.[0]?.product_quantity <
          cartData?.[productIndex]?.quantity
        ) {
          checkValid = false;
          break;
        }
      }

      if (!checkValid) {
        return {
          success: false,
          message: "Số lượng sản phẩm trong giỏ hàng vượt quá số lượng hiện có",
        };
      }

      if (paymentMethod === "VISA") {
        const payment = await stripe.paymentIntents.create({
          amount: totalPrice,
          currency: "VND",
          description: "pay water",
          payment_method: paymentId,
          confirm: true,
        });

        if (!payment)
          return {
            success: false,
            message: "Thanh toán thất bại, vui lòng thử lại sau",
          };
      }

      const pickup_time =
        pickUpTime && pickUpTime !== "undefined"
          ? moment(
              moment(pickUpTime, "YYYY-MM-DD")?.startOf("day").toDate()
            ).format("YYYY-MM-DD")
          : "";

      const insertProduct =
        await postgresql.query(`INSERT INTO product_checkout(checkout_date, total_price, user_id, user_first_name, user_last_name, user_address, user_phone, user_email, status, payment_method, pickup_method, pickup_date)
      VALUES(Now(), ${Number(totalPrice)}, ${Number(userInfo?.user_id)}, '${
          userInfo?.first_name
        }', '${userInfo?.last_name}', '${userInfo?.address}', '${
          userInfo?.phone_number
        }', '${
          userInfo?.email
        }', 1, '${paymentMethod}', '${pickUpOption}', '${pickup_time}')`);

      if (insertProduct) {
        const productInsert = await postgresql.query(
          `SELECT checkout_id from product_checkout ORDER BY checkout_date DESC
          LIMIT 1`
        );

        if (productInsert) {
          const { checkout_id } = productInsert?.rows[0];
          for (let i = 0; i < cartData?.length; i++) {
            await postgresql.query(`INSERT INTO product_checkout_detail(checkout_id, product_id, product_name, product_price, product_sale, product_quanlity, proudct_image, free_product) VALUES
            (${Number(checkout_id)}, ${Number(cartData[i]?.product_id)}, '${
              cartData[i]?.product_name
            }', ${Number(cartData[i]?.product_price)}, ${
              Number(cartData[i]?.product_sale) >= 0 &&
              Number(cartData[i]?.product_sale) !==
                Number(cartData[i]?.product_price)
                ? Number(cartData[i]?.product_sale)
                : 0
            }, ${Number(cartData[i]?.quantity)}, '${
              cartData[i]?.product_image
            }', '${JSON.stringify(cartData[i]?.free_product)}')`);
          }

          for (let i = 0; i < cartData?.length; i++) {
            const quantity = await postgresql.query(
              `SELECT product_quantity FROM product WHERE product_id=${Number(
                cartData?.[i]?.product_id
              )}`
            );

            await postgresql.query(
              `UPDATE product SET product_quantity=${Number(
                Number(quantity?.rows?.[0]?.product_quantity) -
                  Number(cartData?.[i]?.quantity)
              )} WHERE product_id=${Number(cartData?.[i]?.product_id)} `
            );
          }

          return { success: true };
        }
      }
      return { success: false, message: "Thêm sản phẩm vào giỏ hàng thất bại" };
    } catch (error) {
      console.log("createCartData error >>>> ", error);
      return { success: false, message: "Thêm sản phẩm vào giỏ hàng thất bại" };
    }
  },

  getAllCheckoutProduct: async (fromData, toDate, limit, offset, status) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);

      const date_from =
        fromData && fromData !== "undefined"
          ? moment(
              moment(fromData, "YYYY-MM-DD")?.startOf("day").toDate()
            ).format("YYYY-MM-DD hh:mm:ss")
          : "";

      const date_to =
        toDate && toDate !== "undefined"
          ? moment(moment(toDate, "YYYY-MM-DD")?.endOf("day").toDate()).format(
              "YYYY-MM-DD hh:mm:ss"
            )
          : "";

      const checkoutRes = await postgresql.query(
        `SELECT payment_method, pickup_method, pickup_date, checkout_id, checkout_date, total_price, user_id, user_first_name, user_last_name, user_address, user_phone, user_email, status 
        FROM product_checkout 
        WHERE ${
          date_from && date_from !== "undefined"
            ? `date(checkout_date) >= date('${date_from}')`
            : " checkout_date is not null "
        } AND ${
          date_to && date_to !== "undefined"
            ? `date(checkout_date) <= date('${date_to}')`
            : "checkout_date is not null "
        } AND ${
          status && status !== "undefined" && Number(status) !== -1
            ? `status = ${Number(status)}`
            : "status > -1"
        }
        ORDER BY checkout_date DESC ${limitOffset}`
      );
      return checkoutRes?.rows || [];
    } catch (error) {
      console.log("getAllCheckoutProduct error >>>> ", error);
      return [];
    }
  },

  deleteCheckoutById: async (checkoutId) => {
    try {
      const deleteCheckoutRes = await postgresql.query(
        `DELETE FROM product_checkout_detail WHERE checkout_id=${checkoutId}`
      );

      if (deleteCheckoutRes) {
        const deleteCheckoutDetailRes = await postgresql.query(
          `DELETE FROM product_checkout WHERE checkout_id=${checkoutId}`
        );

        if (deleteCheckoutDetailRes?.rows) return true;
      }
      return false;
    } catch (error) {
      console.log("deleteCheckoutById error >>>> ", error);
      return false;
    }
  },

  changeCheckoutStatus: async (checkoutId, status) => {
    try {
      if (Number(status) >= 0) {
        const updateRes = await postgresql.query(
          `UPDATE product_checkout SET status=${status} WHERE checkout_id=${checkoutId}`
        );
        if (updateRes) return true;
      }
      return false;
    } catch (error) {
      console.log("changeCheckoutStatus error >>>> ", error);
      return false;
    }
  },

  getCheckoutById: async (checkoutId) => {
    try {
      const checkoutRes = await postgresql.query(
        `SELECT pcheckout.*, pcheckoutd.* FROM product_checkout AS pcheckout JOIN product_checkout_detail pcheckoutd ON pcheckout.checkout_id = pcheckoutd.checkout_id WHERE pcheckout.checkout_id=${Number(
          checkoutId
        )}`
      );

      return checkoutRes?.rows || [];
    } catch (error) {
      console.log("getCheckoutById error >>>> ", error);
      return [];
    }
  },

  getCheckoutByUserId: async (userId) => {
    try {
      const productRes = await postgresql.query(
        `SELECT checkout_id, checkout_date, total_price, user_id, user_first_name, user_last_name, user_address, user_phone, user_email, status FROM product_checkout WHERE user_id=${Number(
          userId
        )} ORDER BY checkout_date DESC`
      );

      return productRes?.rows || [];
    } catch (error) {
      console.log("getCheckoutByUserId error >>>> ", error);
      return [];
    }
  },

  createNewProductPromo: async (
    promoData,
    discountRule,
    listFreeProduct,
    listPromoProduct
  ) => {
    try {
      const { promo_name, promo_start, promo_end, promo_rule } = promoData;
      const { type, value } = discountRule;

      const date_from = moment(
        moment(promo_start, "YYYY-MM-DD")?.startOf("day").toDate()
      ).format("YYYY-MM-DD hh:mm:ss");

      const date_to = moment(
        moment(promo_end, "YYYY-MM-DD")?.endOf("day").toDate()
      ).format("YYYY-MM-DD hh:mm:ss");

      const addPromo = await postgresql.query(
        `INSERT INTO product_promo(promo_name, promo_start, promo_end, promo_rule, promo_status, rule_type, rule_value, created_day) VALUES 
        ('${promo_name}', '${date_from}', '${date_to}', '${promo_rule}', 1, '${type}', ${Number(
          value
        )}, Now())`
      );

      if (addPromo?.rows) {
        const promoId =
          await postgresql.query(`SELECT promo_id from product_promo ORDER BY created_day DESC
        LIMIT 1`);

        if (promoId) {
          const { promo_id } = promoId?.rows?.[0];

          for (let i = 0; i < listPromoProduct?.length; i++) {
            await postgresql.query(
              `INSERT INTO promo_product(promo_id, product_id) VALUES(${Number(
                promo_id
              )}, ${Number(listPromoProduct[i])})`
            );
          }

          if (promo_rule === "FREE_PRODUCT") {
            for (let i = 0; i < listFreeProduct?.length; i++) {
              await postgresql.query(
                `INSERT INTO promo_free_product(promo_id, product_id) VALUES(${Number(
                  promo_id
                )}, ${Number(listFreeProduct[i])})`
              );
            }
          }
        }
        return true;
      }
      return false;
    } catch (error) {
      console.log("createNewProductPromo error >>>> ", error);
      return false;
    }
  },

  updatePromoData: async (
    promoData,
    discountRule,
    listFreeProduct,
    listPromoProduct,
    promoId
  ) => {
    try {
      const { promo_name, promo_start, promo_end, promo_rule } = promoData;
      const { type, value } = discountRule;

      const date_from = moment(
        moment(promo_start, "YYYY-MM-DD")?.startOf("day").toDate()
      ).format("YYYY-MM-DD hh:mm:ss");

      const date_to = moment(
        moment(promo_end, "YYYY-MM-DD")?.endOf("day").toDate()
      ).format("YYYY-MM-DD hh:mm:ss");

      const addPromo = await postgresql.query(
        `UPDATE product_promo SET promo_name='${promo_name}', promo_start='${date_from}', promo_end='${date_to}',
        promo_rule='${promo_rule}', rule_type='${type}', rule_value=${Number(
          value
        )} WHERE promo_id=${Number(promoId)}`
      );

      if (addPromo) {
        await postgresql.query(
          `DELETE FROM promo_free_product WHERE promo_id=${Number(promoId)}`
        );
        await postgresql.query(
          `DELETE FROM promo_product WHERE promo_id=${Number(promoId)}`
        );

        for (let i = 0; i < listPromoProduct?.length; i++) {
          await postgresql.query(
            `INSERT INTO promo_product(promo_id, product_id) VALUES(${Number(
              promoId
            )}, ${Number(listPromoProduct[i])})`
          );
        }

        if (promo_rule === "FREE_PRODUCT") {
          for (let i = 0; i < listFreeProduct?.length; i++) {
            await postgresql.query(
              `INSERT INTO promo_free_product(promo_id, product_id) VALUES(${Number(
                promoId
              )}, ${Number(listFreeProduct[i])})`
            );
          }
        }
        return true;
      }
      return false;
    } catch (error) {
      console.log("updatePromoData error >>>> ", error);
      return false;
    }
  },

  getPromoList: async () => {
    try {
      const list = await postgresql.query(
        `SELECT * FROM product_promo ORDER BY promo_id DESC`
      );
      return list?.rows || [];
    } catch (error) {
      console.log("getPromoList error >>>> ", error);
      return [];
    }
  },

  deletePromoData: async (promoId) => {
    try {
      await postgresql.query(
        `DELETE FROM promo_free_product WHERE promo_id=${Number(promoId)}`
      );
      await postgresql.query(
        `DELETE FROM promo_product WHERE promo_id=${Number(promoId)}`
      );
      await postgresql.query(
        `DELETE FROM product_promo WHERE promo_id=${Number(promoId)}`
      );

      return true;
    } catch (error) {
      console.log("deletePromoData error >>>> ", error);
      return false;
    }
  },

  getPromoDataById: async (promoId) => {
    try {
      const res = await postgresql.query(
        `SELECT * FROM product_promo WHERE promo_id=${Number(promoId)}`
      );
      return res?.rows ? res?.rows?.[0] : {};
    } catch (error) {
      console.log("getPromoDataById error >>>> ", error);
      return {};
    }
  },

  getPromoFreeProduct: async (promoId) => {
    try {
      const res = await postgresql.query(
        `SELECT pfp.*, p.product_name, p.product_price, p.product_image FROM promo_free_product pfp JOIN product p ON pfp.product_id = p.product_id WHERE pfp.promo_id=${Number(
          promoId
        )}`
      );
      return res?.rows || [];
    } catch (error) {
      console.log("getPromoFreeProduct error >>>> ", error);
      return [];
    }
  },

  getPromoProduct: async (promoId) => {
    try {
      const res = await postgresql.query(
        `SELECT * FROM promo_product WHERE promo_id=${Number(promoId)}`
      );
      return res?.rows || [];
    } catch (error) {
      console.log("getPromoProduct error >>>> ", error);
      return [];
    }
  },

  getProductPromo: async (productId) => {
    try {
      const promo = await postgresql.query(
        `SELECT pp1.* FROM promo_product pp2 JOIN product_promo pp1 ON pp2.promo_id = pp1.promo_id WHERE pp2.product_id=${Number(
          productId
        )}`
      );
      return promo?.rows || [];
    } catch (error) {
      console.log("getProductPromo error >>>> ", error);
      return [];
    }
  },

  checkUserProductPurchase: async (productId, userId) => {
    try {
      const response = await postgresql.query(
        `SELECT pcd.product_id FROM product_checkout_detail pcd JOIN product_checkout pc ON pcd.checkout_id = pc.checkout_id WHERE pc.user_id=${Number(
          userId
        )} AND pcd.product_id=${Number(productId)}`
      );
      return response?.rows?.length ? true : false;
    } catch (error) {
      console.log("checkUserProductPurchase error >>>> ", error);
      return false;
    }
  },

  deleteReviewData: async (reviewId) => {
    try {
      await postgresql.query(
        `DELETE FROM product_review_children WHERE review_id=${Number(
          reviewId
        )}`
      );

      const response = await postgresql.query(
        `DELETE FROM product_review WHERE review_id=${Number(reviewId)}`
      );

      return response?.rows ? true : false;
    } catch (error) {
      console.log("deleteReviewData error >>>> ", error);
      return false;
    }
  },

  updateReviewData: async (reviewId, review) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE product_review SET review='${review}' WHERE review_id=${reviewId}`
      );

      return updateRes?.rows ? true : false;
    } catch (error) {
      console.log("updateReviewData error >>>> ", error);
      return false;
    }
  },

  createReviewChildren: async (review_id, user_id, review, author_type) => {
    try {
      const response =
        await postgresql.query(`INSERT INTO product_review_children(review_id, user_id, review, status, review_date, author_type) 
      VALUES(${Number(review_id)}, ${Number(
          user_id
        )}, '${review}', 1, Now(), '${author_type}')`);
      return response?.rows ? true : false;
    } catch (error) {
      console.log("createReviewChildren error >>>> ", error);
      return false;
    }
  },

  deleteReviewChildren: async (childrenId) => {
    try {
      const response = await postgresql.query(
        `DELETE FROM product_review_children WHERE review_children_id=${Number(
          childrenId
        )}`
      );
      return response?.rows ? true : false;
    } catch (error) {
      console.log("deleteReviewChildren error >>>> ", error);
      return false;
    }
  },

  updateReviewChildrenStatus: async (childrenId, status) => {
    try {
      const response = await postgresql.query(
        `UPDATE product_review_children SET status = ${Number(
          status
        )} WHERE review_children_id=${Number(childrenId)}`
      );
      return response?.rows ? true : false;
    } catch (error) {
      console.log("updateReviewChildrenStatus error >>>> ", error);
      return false;
    }
  },

  updateUserReviewChildren: async (childrenId, review) => {
    try {
      const response = await postgresql.query(
        `UPDATE product_review_children SET review = '${review}' WHERE review_children_id=${Number(
          childrenId
        )}`
      );
      return response?.rows ? true : false;
    } catch (error) {
      console.log("updateUserReviewChildren error >>>> ", error);
      return false;
    }
  },

  getSellingProduct: async (limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const response = await postgresql.query(
        `select pd.* from product pd join product_checkout_detail pcd on pd.product_id = pcd.product_id group by pd.product_id  order by count(pd.product_id) DESC ${limitOffset}`
      );
      return response?.rows || [];
    } catch (error) {
      console.log("getSellingProduct error >>>> ", error);
      return [];
    }
  },

  createKeyWordSearch: async (search) => {
    try {
      const keyWordRes = await postgresql.query(`SELECT * FROM keyword_search`);
      const allKeyWord = keyWordRes?.rows;
      const searchIndex = allKeyWord?.findIndex(
        (item) => item?.keyword === search
      );
      if (searchIndex < 0) {
        const response = await postgresql.query(
          `INSERT INTO keyword_search(keyword, created_day, search_number) VALUES('${search}', Now(), 0)`
        );
        return response?.rows ? true : false;
      } else {
        const response = await postgresql.query(
          `UPDATE keyword_search SET search_number=${
            Number(allKeyWord[searchIndex]?.search_number) + 1
          } WHERE keyword_id=${Number(allKeyWord[searchIndex]?.keyword_id)}`
        );
        return response?.rows ? true : false;
      }
    } catch (error) {
      console.log("createKeyWordSearch error >>>> ", error);
      return false;
    }
  },

  getProductMostSearch: async () => {
    try {
      const keyWordRes = await postgresql.query(
        `SELECT * FROM keyword_search ORDER BY search_number DESC LIMIT 10 OFFSET 0`
      );
      const keyWordList = keyWordRes?.rows;
      const allProduct = [];
      for (let i = 0; i < keyWordList?.length; i++) {
        const product = await postgresql.query(
          `SELECT * FROM product WHERE lower(unaccent(product_name)) LIKE '%${keyWordList?.[i]?.keyword
            ?.toLowerCase()
            ?.normalize("NFD")
            .replace(
              /[\u0300-\u036f]/g,
              ""
            )}%' ORDER BY product_id DESC`
        );
        allProduct?.push(...product?.rows)
      }
      const filterProduct = []
      allProduct.forEach((item) => {
        const index = filterProduct?.findIndex((it) => it?.product_id === item?.product_id)
        if ( index < 0 ){
          filterProduct?.push(item)
        }
      })
      return filterProduct?.slice(0, 10);
    } catch (error) {
      console.log("getProductMostSearch error >>>> ", error);
      return [];
    }
  },
};
