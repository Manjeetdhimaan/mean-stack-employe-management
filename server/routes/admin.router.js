const express = require('express');
const router = express.Router();

const ctrlAdmin = require('../controllers/admin.controller');
const jwtHelper = require('../config/jwtHelper');

// admin controllers
router.post('/register', ctrlAdmin.register);

router.post('/authenticate', ctrlAdmin.authenticate);
router.post('/verifyOtp', ctrlAdmin.verifyOtp);
router.post('/resendOtp', ctrlAdmin.resendOtp);
router.get('Profile', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.adminProfile);
router.get('/getUsers/:page/:perPage', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.getUsers);
router.get('/getUser/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.getUser);

router.post('/checkIn/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.checkIn);
router.post('/checkAllUsers', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.checkAllUsers);
router.post('/checkOut/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.checkOut);
router.patch('/respondToLeaves/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.respondToLeaves);
router.post('/createPayroll/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.createPayroll);
router.put('/change-password',jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.changePassword);
router.post('/registerEmp', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.registerEmp);
router.delete('/deleteUser/:id', jwtHelper.verifyJwtToken, jwtHelper.isAdmin, ctrlAdmin.deleteUser);

module.exports = router;