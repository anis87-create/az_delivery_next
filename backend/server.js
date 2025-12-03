const express = require('express')
const mongoose = require('mongoose')

const app = express();
const authRouter = require('./routes/auth');
const { connectDB } = require('./config/db');


const PORT = process.env.DEFAULT_PORT || 5000;

app.use('/auth', authRouter);
connectDB();
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}...`);
} )