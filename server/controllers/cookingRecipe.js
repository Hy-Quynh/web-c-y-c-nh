const asyncHandler = require("express-async-handler");
const {
  getAllCookingRecipe,
  createCookingRecipeData,
  updateCookingRecipeData,
  deleteCookingRecipeData,
  getTotalCookingRecipe,
  getCookingRecipeInfo,
  getReviewByCookingRecipe,
  createCookingRecipeReview,
  getUserCookingRecipeFavourite,
  changeUserFavouriteCookingRecipe,
  getAllRelativeCookingRecipe,
  changeCookingRecipeView,
} = require("../models/cookingRecipe");

module.exports = {
  getAllCookingRecipe: asyncHandler(async (req, res) => {
    const {limit, offset, search} = req?.query
    const cookingRecipeList = await getAllCookingRecipe(limit, offset, search);
    const totalCookingRecipe = await getTotalCookingRecipe(search);

    res.send({
      success: true,
      payload: { cookingRecipe: cookingRecipeList, total: totalCookingRecipe },
    });
  }),

  createNewCookingRecipe: asyncHandler(async (req, res) => {
    const { cookingRecipeData } = req.body;
    const {
      cooking_recipe_text,
      cooking_recipe_description,
      cooking_recipe_avatar,
    } = cookingRecipeData;
    const createRes = await createCookingRecipeData(
      cooking_recipe_text,
      cooking_recipe_description,
      cooking_recipe_avatar
    );
    res.send({ success: createRes });
  }),

  updateCookingRecipeData: asyncHandler(async (req, res) => {
    const { cookingRecipeData } = req.body;
    const {
      cooking_recipe_text,
      cooking_recipe_description,
      cooking_recipe_avatar,
      cooking_recipe_id,
    } = cookingRecipeData;
    const updateRes = await updateCookingRecipeData(
      cooking_recipe_text,
      cooking_recipe_description,
      cooking_recipe_avatar,
      cooking_recipe_id
    );
    res.send({ success: updateRes });
  }),

  deleteCookingRecipeData: asyncHandler(async (req, res) => {
    const { cookingRecipeId } = req.params;
    const deleteRes = await deleteCookingRecipeData(cookingRecipeId);
    res.send({ success: deleteRes });
  }),

  getCookingRecipeById: asyncHandler(async (req, res) => {
    const { cookingRecipeId } = req.params;
    const cookingRecipeInfo = await getCookingRecipeInfo(cookingRecipeId);
    res.send({ success: true, payload: cookingRecipeInfo });
  }),

  getReviewByCookingRecipe: asyncHandler(async (req, res) => {
    const { cookingRecipeId } = req.params;
    const { limit, offset } = req.query;
    const cookingRecipeList = await getReviewByCookingRecipe(cookingRecipeId, limit, offset);
    res.send({ success: true, payload: cookingRecipeList });
  }),

  getAllReview: asyncHandler(async (req, res) => {}),

  createNewCookingRecipeReview: asyncHandler(async (req, res) => {
    const { user_id, review, cooking_recipe_id } = req.body;
    const createRes = await createCookingRecipeReview(user_id, review, cooking_recipe_id, 1);
    res.send({ success: createRes });
  }),

  getUserCookingRecipeFavourite: asyncHandler(async (req, res) => {
    const { userId, cookingRecipeId } = req.query;
    const favouriteRes = await getUserCookingRecipeFavourite(userId, cookingRecipeId);
    res.send({ success: true, payload: favouriteRes });
  }),

  changeUserFavouriteCookingRecipe: asyncHandler(async (req, res) => {
    const { userId, cookingRecipeId } = req.query;
    const { status } = req.body;
    const changeRes = await changeUserFavouriteCookingRecipe(userId, cookingRecipeId, status);
    res.send({ success: changeRes });
  }),

  getAllRelativeCookingRecipe: asyncHandler(async (req, res) => {
    const {limit, offset, existCookingRecipe} = req?.query;
    const response = await getAllRelativeCookingRecipe(limit, offset, existCookingRecipe)
    res.send({ success: true, payload: response});
  }),

  changeCookingRecipeView: asyncHandler(async (req, res) => {
    const {view} = req?.body
    const {cookingRecipeId} = req?.params
    const response = await changeCookingRecipeView(cookingRecipeId, view)
    res.send({success: response})
  })
};

