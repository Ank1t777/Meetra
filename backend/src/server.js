import express from 'express';
import "dotenv/config" ;
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser'; // Import cookie-parser to handle cookies

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware to parse cookies

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); 
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})