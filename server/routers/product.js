const express =  require('express');
const productController = require('../controllers/product');
const router = express.Router();

router.get('/', productController.getAllProduct);
router.get('/:productId', productController.getProductById);
router.post('/', productController.createNewProduct);
router.put('/:productId', productController.updateProductData);
router.delete('/:productId', productController.deleteProductData);
router.get('/review/:productId', productController.getReviewByProductId);
router.post('/review', productController.createNewReview)
router.put('/review/:reviewId/status', productController.changeReviewStatus)
router.get('/review', productController.getAllReview)
router.post('/cart', productController.checkoutCart)
router.get('/checkout/list', productController.getListCheckout)
router.delete('/checkout/:checkoutId', productController.deleteCheckoutById)
router.put('/checkout/status/:checkoutId', productController.changeCheckoutStatus)
router.get('/checkout/:checkoutId', productController.getCheckoutById)
router.get('/checkout/user/:userId', productController.getCheckoutByUserId)
router.post('/promo', productController.createNewPromo)
router.get('/promo/list', productController.getPromoList)
router.delete('/promo/:promoId', productController.deletePromoData)
router.get('/promo/:promoId', productController.getPromoById)
router.put('/promo/:promoId', productController.updatePromoData)
module.exports = router;
