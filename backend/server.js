require('dotenv').config();
const express = require('express')
const { connectDB } = require('./config/db');
connectDB();
const app = express();
const authRouter = require('./routes/auth');



const PORT = process.env.DEFAULT_PORT || 5000;
app.use(express.json());
app.use('/auth', authRouter);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}...`);
} )