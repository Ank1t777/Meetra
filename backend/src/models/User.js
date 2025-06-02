import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    bio: {
        type: String,
        default: ''
    },
    profilePic: {
        type: String,
        default: ''
    },
    nativeLanguage: {
        type: String,
        default: ''
    },
    learningLanguage: {
        type: String,
        default: ''
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true}); //createdAt: 2023-10-01T12:00:00Z and updatedAt: 2023-10-01T12:00:00Z are added automatically by mongoose

const User = mongoose.model("User", userSchema);

//pre hook to hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    // If the password is not modified, skip hashing
    try {
        const salt = await bcrypt.gensalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})
export default User;
