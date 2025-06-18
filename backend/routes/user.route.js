import express from 'express';
const router = express.Router();
import {getRecommendations,getMyFriends,sendFriendRequest,acceptFriendRequest,getFriendRequest,getOutgoingFriendRequests} from '../controllers/user.controller.js';
import { authRoute } from '../middleware/auth.middleware.js';
router.get('/recommendation', authRoute, getRecommendations);
router.get('/friends', authRoute, getMyFriends);
router.post('/friend-request/:id',authRoute,sendFriendRequest);

router.put('/friend-request/:id/accept',authRoute,acceptFriendRequest);
router.get('/friend-requests',authRoute,getFriendRequest)
router.get('/outgoing-friend-requests',authRoute,getOutgoingFriendRequests);
export default router;