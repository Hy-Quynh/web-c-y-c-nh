const express =  require('express');
const cookingRecipeController = require('../controllers/cookingRecipe');
const router = express.Router();

router.get('/', cookingRecipeController.getAllCookingRecipe);
router.post('/', cookingRecipeController.createNewCookingRecipe);
router.put('/:cookingRecipeId/info', cookingRecipeController.updateCookingRecipeData);
router.delete('/:cookingRecipeId', cookingRecipeController.deleteCookingRecipeData);
router.get('/:cookingRecipeId/info', cookingRecipeController.getCookingRecipeById);
router.get('/review/:cookingRecipeId', cookingRecipeController.getReviewByCookingRecipe);
router.get('/review', cookingRecipeController.getAllReview)
router.post('/review', cookingRecipeController.createNewCookingRecipeReview)
router.get('/favourite', cookingRecipeController.getUserCookingRecipeFavourite)
router.put('/favourite', cookingRecipeController.changeUserFavouriteCookingRecipe)
router.get('/relative', cookingRecipeController.getAllRelativeCookingRecipe)
router.put('/view/:cookingRecipeId', cookingRecipeController.changeCookingRecipeView)

module.exports = router;
