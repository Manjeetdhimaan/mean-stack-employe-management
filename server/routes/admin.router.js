const express = require('express');
const router = express.Router();

const ctrlAdmin = require('../controllers/admin.controller');

const jwtHelper = require('../config/jwtHelper');

// admin controllers
router.post('/authenticate', ctrlAdmin.authenticate);
router.get('Profile', jwtHelper.verifyJwtToken, ctrlAdmin.adminProfile);
router.get('/getUsers', ctrlAdmin.getUsers);
router.get('/getUser/:id', jwtHelper.verifyJwtToken, ctrlAdmin.getUser);

router.post('/checkIn/:id', jwtHelper.verifyJwtToken, ctrlAdmin.checkIn);
router.post('/checkOut/:id', jwtHelper.verifyJwtToken, ctrlAdmin.checkOut);
router.put('/respondToLeaves/:id', jwtHelper.verifyJwtToken, ctrlAdmin.respondToLeaves);
router.put('/change-password',jwtHelper.verifyJwtToken, ctrlAdmin.changePassword);

router.post('/register', ctrlAdmin.register);

module.exports = router;