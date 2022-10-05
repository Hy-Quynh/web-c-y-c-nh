const express =  require('express');
const helperController = require('../controllers/helper');
const router = express.Router();

router.get('/', helperController.getAllHelper);
router.post('/', helperController.createNewHelper);
router.put('/:helperId', helperController.updateHelperData);
router.delete('/:helperId', helperController.deleteHelperData);
router.get('/warranty/info', helperController.getAllWarranty);
router.post('/warranty/info', helperController.createWaranty);
router.put('/warranty/:warrantyId/info', helperController.updateWarranty);

module.exports = router;
