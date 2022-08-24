const express =  require('express');
const roleController = require('../controllers/role');
const router = express.Router();

router.get('/', roleController.getAllRole);
router.post('/', roleController.createNewRole);
router.delete('/:roleId', roleController.deleteRole);
router.put('/:roleId', roleController.updateRole);
router.get('/name/:roleName', roleController.getRoleFunctionByName);
router.get('/admin/:adminId', roleController.getRoleByAdminId);

module.exports = router;