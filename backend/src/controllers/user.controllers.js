import FriendRequest from '../models/FriendRequest.js';
import { User } from '../models/User.js';

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({ 
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude current user
                { id: { $nin: currentUser.friends } }, // Exclude friends of the current user
                { isOnboarded: true } // Only include onboarded users
            ],
        });
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await user.findById(req.user.id)
        .select('friends')
        .populate('friends','username profilePic nativeLanguage learningLanguage bio isOnboarded');

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error fetching friends:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id:recipientId } = req.params;

        if(myId === recipientId) {
            return res.status(400).json( { message: "You cannot send friend request to yourself" })
        }

        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }
        if(recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });

        if(existingRequest) {
            return res.status(400).json({ message: "Friend request already exists" });
        }

        const friendRequest = new FriendRequest({
            sender: myId,
            recipient: recipientId,
        });
        res.status(201).json(friendRequest);
    } catch(error) {
        console.error("Error sending friend request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}