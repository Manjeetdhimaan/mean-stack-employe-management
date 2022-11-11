const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.put('/updateUserProfile', jwtHelper.verifyJwtToken, ctrlUser.updateUserProfile);
router.post('/applyLeave', jwtHelper.verifyJwtToken, ctrlUser.applyLeave);
router.put('/change-password', jwtHelper.verifyJwtToken, ctrlUser.changePassword);

module.exports = router;