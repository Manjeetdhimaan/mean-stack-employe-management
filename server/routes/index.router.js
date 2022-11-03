const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');
const ctrlAdmin = require('../controllers/admin.controller');

const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.put('/updateUserProfile',jwtHelper.verifyJwtToken, ctrlUser.updateUserProfile);
router.post('/applyLeave',jwtHelper.verifyJwtToken, ctrlUser.applyLeave);

// admin controllers
router.post('/admin/authenticate', ctrlAdmin.authenticate);
router.get('/admin/adminProfile',jwtHelper.verifyJwtToken, ctrlAdmin.adminProfile);
router.get('/admin/getUsers',jwtHelper.verifyJwtToken, ctrlAdmin.getUsers);
router.get('/admin/getUser/:id',jwtHelper.verifyJwtToken, ctrlAdmin.getUser);

router.post('/admin/checkIn/:id',jwtHelper.verifyJwtToken, ctrlAdmin.checkIn);
router.post('/admin/checkOut/:id',jwtHelper.verifyJwtToken, ctrlAdmin.checkOut);
router.put('/admin/respondToLeaves/:id',jwtHelper.verifyJwtToken, ctrlAdmin.respondToLeaves);

router.post('/admin/register', ctrlAdmin.register);

module.exports = router;



