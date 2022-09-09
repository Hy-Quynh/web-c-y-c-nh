const express =  require('express');
const userController = require('../controllers/user');
const router = express.Router();

router.get('/', userController.getUserList);
router.get('/:userId', userController.getUserById);
router.delete('/:userId', userController.deleteUserInfo);
router.put('/status/:userId', userController.updateUserStatus);
router.put('/:userId/name', userController.updateUserName);
router.put('/:userId/avatar', userController.updateUserAvatar);
router.put('/:userId', userController.updateUserInfo);
router.put('/admin/:adminId/role', userController.updateAdminRole);

module.exports = router;
