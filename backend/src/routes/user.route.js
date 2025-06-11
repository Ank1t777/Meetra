import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { 
    getRecommendedUsers, 
    getMyFriends,
    sendFriendRequest,
    acceptFriendRequest 
} from '../controllers/user.controller';

const router = express.Router();

router.use(protectRoute);

router.get('/', getRecommendedUsers);
router.get('/friends', getMyFriends);

router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);

router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendRequests);
export default router;