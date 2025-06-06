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
        const user = await user.findById(req.user.id).select('friends').populate('friends',
            'username, profilePic nativeLanguage leraningLanguage bio isOnboarded');
    } catch (error) {
        console.error("Error fetching friends:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}