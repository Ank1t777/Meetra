import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(email && !emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" }); 
        }

        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });    
        }

        const index = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;

        const newUser = await User.create({
            email,
            username,
            password,
            profilePic: randomAvatar,
        });

        // Upsert user in Stream
        try {
            await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.username,
            image: newUser.profilePic || "",
        });
        } catch (error) {
            console.log("Error creating Stream user:", error);
        }

        const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie and protects against XSS attacks
            sameSite: "strict", // Helps protect against CSRF attacks
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production  
        })

        res.status(201).json({
            success: true,
            message: "User created",
            user: newUser,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });   
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if( !email || !password) {
            return res.status(400).json( { message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await user.comparePassword(password);

        if(!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        } 

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });  

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie and protects against XSS attacks
            sameSite: "strict", // Helps protect against CSRF attacks
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        });

        res.status(200).json({ success: true, user });

    } catch(error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

export function logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

