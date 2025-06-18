// const express = require('express');\
import express from 'express'
import {authRoute} from '../middleware/auth.middleware.js'; // Import the auth middleware
const router = express.Router();
// const authController = require('../controllers/auth.controller');
import {signupController,loginController,logoutController,onboardController} from '../controllers/auth.controller.js'
router.post('/signup', signupController);
router.post('/login', loginController); 
router.post('/logout', logoutController);
//onboarding route
router.post('/onboard', authRoute, onboardController); 

router.get("/me", authRoute, (req, res) => {
    // res.send("Hello from auth route");
    res.status(200).json({ user: req.user });
});
export default router;