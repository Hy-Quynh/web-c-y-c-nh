const { postgresql } = require("../config/connect");
const { getByLimitAndOffset } = require("../utils/util");

module.exports = {
  getAllCookingRecipe: async (limit, offset, search) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const cookingRecipeData = await postgresql.query(
        `SELECT * FROM cooking_recipe WHERE ${
          search && search !== "undefined"
            ? `lower(unaccent(cooking_recipe_text)) LIKE '%${search
                ?.toLowerCase()
                ?.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")}%'`
            : `cooking_recipe_text != ''`
        } ORDER BY cooking_recipe_id DESC ${limitOffset}`
      );

      if (cookingRecipeData?.rows) {
        return cookingRecipeData?.rows;
      }
      return [];
    } catch (error) {
      console.log("getAllCookingRecipe error >>>> ", error);
      return [];
    }
  },

  getTotalCookingRecipe: async (search) => {
    try {
      const total = await postgresql.query(
        `SELECT COUNT(cooking_recipe_id) as total_cooking_recipe FROM cooking_recipe WHERE ${
          search && search !== "undefined"
            ? `lower(unaccent(cooking_recipe_text)) LIKE '%${search
                ?.toLowerCase()
                ?.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")}%'`
            : `cooking_recipe_text != ''`
        }`
      );
      return total?.rows?.[0]?.total_cooking_recipe || 0;
    } catch (error) {
      console.log("getTotalCookingRecipe error >>>> ", error);
      return 0;
    }
  },

  createCookingRecipeData: async (
    cookingRecipeText,
    cookingRecipeDescription,
    cookingRecipeAvatar
  ) => {
    try {
      const createRes = await postgresql.query(
        `INSERT INTO cooking_recipe(cooking_recipe_text, cooking_recipe_avatar, cooking_recipe_description, create_at, cooking_recipe_view) VALUES('${cookingRecipeText}', '${cookingRecipeAvatar}','${cookingRecipeDescription}', Now(), 0)`
      );
      if (createRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("createCookingRecipeData error >>>> ", error);
      return false;
    }
  },

  updateCookingRecipeData: async (
    cookingRecipeText,
    cookingRecipeDescription,
    cookingRecipeAvatar,
    cookingRecipeId
  ) => {
    try {
      const updateRes = await postgresql.query(
        `UPDATE cooking_recipe SET cooking_recipe_text='${cookingRecipeText}', cooking_recipe_avatar='${cookingRecipeAvatar}', cooking_recipe_description='${cookingRecipeDescription}' WHERE cooking_recipe_id=${Number(
          cookingRecipeId
        )}`
      );
      if (updateRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("updateCookingRecipeData error >>>> ", error);
      return false;
    }
  },

  deleteCookingRecipeData: async (cookingRecipeId) => {
    try {
      const deleteRes = await postgresql.query(
        `DELETE FROM cooking_recipe WHERE cooking_recipe_id=${Number(
          cookingRecipeId
        )}`
      );
      if (deleteRes?.rows) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("deleteCookingRecipeData error >>>> ", error);
      return false;
    }
  },

  getCookingRecipeInfo: async (cookingRecipeId) => {
    try {
      if (cookingRecipeId) {
        const getQuery = await postgresql.query(
          `SELECT cr.*,
          (SELECT COUNT(br.review_id) FROM cooking_recipe_review br WHERE br.cooking_recipe_id = cr.cooking_recipe_id ) AS count_review,
          (SELECT COUNT(bf.user_id) FROM cooking_recipe_favourite bf WHERE bf.cooking_recipe_id = cr.cooking_recipe_id ) AS count_favourite
          FROM cooking_recipe cr WHERE cr.cooking_recipe_id=${Number(
            cookingRecipeId
          )}`
        );

        if (getQuery?.rows?.length) return getQuery?.rows?.[0];
      }
      return {};
    } catch (error) {
      console.log("getCookingRecipeInfo error >>>> ", error);
      return {};
    }
  },

  getReviewByCookingRecipe: async (cookingId, limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const queryRes = await postgresql.query(
        `SELECT r.*, u.last_name, u.first_name FROM cooking_recipe_review r JOIN users u ON r.user_id = u.user_id WHERE r.cooking_recipe_id=${Number(
          cookingId
        )} ${limitOffset}`
      );

      const totalReview = await postgresql.query(
        `select COUNT(cooking_recipe_review.review_id) as total_item from cooking_recipe_review`
      );

      if (queryRes?.rows)
        return {
          review: queryRes?.rows,
          total: totalReview?.rows[0].total_item,
        };
      return {};
    } catch (error) {
      console.log("getReviewByCookingRecipe error >>>> ", error);
      return {};
    }
  },

  createCookingRecipeReview: async (
    user_id,
    review,
    cooking_recipe_id,
    status
  ) => {
    try {
      const insertRes = await postgresql.query(
        `INSERT INTO cooking_recipe_review(review_date, user_id, review, cooking_recipe_id, status) VALUES(Now(), ${Number(
          user_id
        )}, '${review}', ${Number(cooking_recipe_id)}, ${status})`
      );
      return insertRes?.rows ? true : false;
    } catch (error) {
      console.log("createCookingRecipeReview error >>>> ", error);
      return false;
    }
  },

  getUserCookingRecipeFavourite: async (userId, cookingRecipeId) => {
    try {
      const userFavourite = await postgresql.query(
        `SELECT * FROM cooking_recipe_favourite WHERE cooking_recipe_id=${Number(
          cookingRecipeId
        )} AND user_id=${Number(userId)}`
      );
      return userFavourite?.rows?.length ? true : false;
    } catch (error) {
      console.log("getUserCookingRecipeFavourite error >>>> ", error);
      return false;
    }
  },

  changeUserFavouriteCookingRecipe: async (userId, cookingId, status) => {
    try {
      if (status) {
        const changeRes = await postgresql.query(
          `INSERT INTO cooking_recipe_favourite(user_id, cooking_recipe_id) VALUES(${Number(
            userId
          )}, ${Number(cookingId)})`
        );
        return changeRes?.rows ? true : false;
      }

      const deleteRes = await postgresql.query(
        `DELETE FROM cooking_recipe_favourite WHERE cooking_recipe_id=${Number(
          cookingId
        )} AND user_id=${Number(userId)}`
      );
      return deleteRes?.rows ? true : false;
    } catch (error) {
      console.log("changeUserFavouriteCookingRecipe error >>>> ", error);
      return false;
    }
  },

  getAllRelativeCookingRecipe: async (limit, offset, existCookingRecipe) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const getQuery = await postgresql.query(
        `SELECT cr.*,
        (SELECT COUNT(br.review_id) FROM cooking_recipe_review br WHERE br.cooking_recipe_id = cr.cooking_recipe_id ) AS count_review,
        (SELECT COUNT(bf.user_id) FROM cooking_recipe_favourite bf WHERE bf.cooking_recipe_id = cr.cooking_recipe_id ) AS count_favourite
        FROM cooking_recipe cr WHERE cr.cooking_recipe_id != ${Number(
          existCookingRecipe
        )} ORDER BY cr.create_at DESC ${limitOffset}`
      );
      return getQuery?.rows || [];
    } catch (error) {
      console.log("getAllRelativeCookingRecipe error >>>> ", error);
      return [];
    }
  },

  changeCookingRecipeView: async (cookingRecipeId, view) => {
    try {
      const response = await postgresql.query(
        `UPDATE cooking_recipe SET cooking_recipe_view=${Number(
          view
        )} WHERE cooking_recipe_id=${Number(cookingRecipeId)}`
      );
      return response?.rows ? true : false;
    } catch (error) {
      console.log("changeCookingRecipeView error >>>> ", error);
      return false;
    }
  },
};
