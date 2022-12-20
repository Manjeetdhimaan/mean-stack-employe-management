const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');
const extractFile = require("../middleware/file");
router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.patch('/updateUserProfile', jwtHelper.verifyJwtToken, ctrlUser.updateUserProfile);
router.patch('/updateProfileImage', extractFile, jwtHelper.verifyJwtToken, ctrlUser.updateProfileImage);
router.patch('/removeProfileImage', jwtHelper.verifyJwtToken, ctrlUser.removeProfileImage);
router.post('/applyLeave', jwtHelper.verifyJwtToken, ctrlUser.applyLeave);
router.put('/change-password', jwtHelper.verifyJwtToken, ctrlUser.changePassword);

router.post('/req-reset-password', ctrlUser.ResetPassword);
router.post('/new-password', ctrlUser.NewPassword);
router.post('/valid-password-token', ctrlUser.ValidPasswordToken);

module.exports = router;