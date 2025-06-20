import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log("Token:", token);

        if(!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if(!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if(!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler  
    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        return res.status(500).json({ message: "Server error" });
    }
}
