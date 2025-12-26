import 'dotenv/config';
import * as express from 'express';
import * as cors from 'cors';
import authRouter from './src/routes/auth';
import connectDB from './src/config/db';

const app = express();
const PORT = process.env.DEFAULT_PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});