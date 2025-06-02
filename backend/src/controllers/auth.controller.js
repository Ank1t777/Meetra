import User from "../models/User.js";

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

        const existingUser = await User.findone({ email });

        if(existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });    
        }

        const index = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;

        const newUser = new User({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        })

        const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production  
        })

        res.status(201).json({success: true, message: "User created"});

    } catch (error) {
        return res.status(500).json({ message: "Server error" });   
    }
}

export async function login(req, res) {
    res.send("login page");
}

export function logout(req, res) {
    res.send("logout page");
}

