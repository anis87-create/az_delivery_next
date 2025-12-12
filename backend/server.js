require('dotenv').config();
const express = require('express')
const cors = require('cors');
const { connectDB } = require('./config/db');
connectDB();
const app = express();
const authRouter = require('./routes/auth');

// Configure CORS


const PORT = process.env.DEFAULT_PORT || 5000;
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}...`);
} )