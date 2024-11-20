const express = require('express');
const { loginUser, forgotPassword, resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/login', loginUser);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);



module.exports = router;
