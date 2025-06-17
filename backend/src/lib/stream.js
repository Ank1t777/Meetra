import pkg from 'stream-chat';
import "dotenv/config";

const { StreamChat: Streamchat } = pkg;
const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if( !apiKey || !apiSecret ) {
    console.error("Stream API key and secret are required");
}

const streamClient = Streamchat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);;
        return userData;
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
}

//todo: do it later

export const generateStreamToken = (userId) => {
    try {
        // ensure userId is a string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch(error) {
        console.error("Error generating Stream token:", error);
        throw new Error("Failed to generate Stream token");
}
}