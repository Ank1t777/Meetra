import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        console.log("Current user:", currentUserId);
        console.log("Friends:", currentUser.friends);

        const recommendedUsers = await User.find({ 
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude current user
                { _id: { $nin: currentUser.friends || [] } }, // Exclude friends of the current user
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
        const user = await User.findById(req.user.id)
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
        await friendRequest.save();
        res.status(201).json(friendRequest);
    } catch(error) {
        console.error("Error sending friend request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest) {
            return res.status(400).json({ message: "Friend request not found" });
        }

        //verify if the current user is the recipient of the request
        if(friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        //add each other to friends list
        //$addToSet ensures that the user is added only if they are not already in the array
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }     
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        });

        res.status(200).json({ message: "Friend request accepted successfully" });
    } catch (error) {
        console.error("Error accepting friend request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: 'pending',
        }).populate('sender', 'username profilePic nativeLanguage learningLanguage');

        const acceptedRequests = await FriendRequest.find({
            sender: req.user.id,
            status: 'accepted',
        }).populate('recipient', 'username profilePic');

        res.status(200).json({
            incomingRequests,
            acceptedRequests
        });
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: 'pending',
        }).populate('recipient', 'username profilePic nativeLanguage learningLanguage');
        
        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
