import express from 'express';
import { authRoute } from '../middleware/auth.middleware.js';
import { getStreamToken } from '../controllers/chat.controller.js';
const router = express.Router();


router.get('/token',authRoute,getStreamToken)

export default router;