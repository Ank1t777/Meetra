import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.SchemaTypes({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.SchemaTypes.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending',
    },
},
{
    timestamps: true,
});

const FriendRequest = mongoose.models("FriendRequest", friendRequestSchema);

export default FriendRequest;