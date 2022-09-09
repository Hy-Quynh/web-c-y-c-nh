const express =  require('express');
const electricityWaterController = require('../controllers/electricity-water');
const router = express.Router();

router.post('/electricity/payment', electricityWaterController.electricityPayment);
router.get('/electricity/payment', electricityWaterController.getListElectricityPayment);
router.post('/water/payment', electricityWaterController.waterPayment);
router.get('/water/payment', electricityWaterController.getListWaterPayment);
module.exports = router;