const express =  require('express');
const productController = require('../controllers/product');
const router = express.Router();

router.get('/', productController.getAllProduct);
router.get('/:productId', productController.getProductById);
router.post('/', productController.createNewProduct);
router.put('/:productId', productController.updateProductData);
router.delete('/:productId', productController.deleteProductData);

module.exports = router;
