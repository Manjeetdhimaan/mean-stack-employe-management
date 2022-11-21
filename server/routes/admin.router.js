const express = require('express');
const router = express.Router();

const ctrlAdmin = require('../controllers/admin.controller');

const jwtHelper = require('../config/jwtHelper');

// admin controllers
router.post('/register', ctrlAdmin.register);

router.post('/authenticate', ctrlAdmin.authenticate);
router.get('Profile', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.adminProfile);
router.get('/getUsers', ctrlAdmin.getUsers);
router.get('/getUser/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.getUser);

router.post('/checkIn/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, jwtHelper.isAdmin,  ctrlAdmin.checkIn);
router.post('/checkOut/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.checkOut);
router.patch('/respondToLeaves/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.respondToLeaves);
router.post('/createPayroll/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.createPayroll);
router.put('/change-password',jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.changePassword);


module.exports = router;