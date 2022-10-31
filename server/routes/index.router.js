const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');
const ctrlAdmin = require('../controllers/admin.controller');

const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.put('/updateUserProfile',jwtHelper.verifyJwtToken, ctrlUser.updateUserProfile);

// admin controllers
router.post('/admin/authenticate', ctrlAdmin.authenticate);
router.get('/admin/adminProfile',jwtHelper.verifyJwtToken, ctrlAdmin.adminProfile);
router.get('/admin/getUsers',jwtHelper.verifyJwtToken, ctrlAdmin.getUsers);
router.post('/admin/register', ctrlAdmin.register);

module.exports = router;



