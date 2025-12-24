require('dotenv').config();
import * as express from 'express';
import * as cors from 'cors';
const app = express();
import  authRouter from './src/routes/auth';
import connectDB from './src/config/db';
connectDB();
app.use(express.json());

const PORT = process.env.DEFAULT_PORT || 5000;
app.use(express.json());
app.use(cors());
app.use('/api/auth',authRouter);



app.listen(PORT, () => {
    console.log(`the server now is running on port ${PORT}...`);
} )