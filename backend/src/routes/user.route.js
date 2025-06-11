import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { getRecommendedUsers, getMyFriends } from '../controllers/user.controller';
import sendFriendRequest from '../models/sendFriendRequest';

const router = express.Router();

router.use(protectRoute);

router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);
router.post('/friend-request', sendFriendRequest);



export default router;