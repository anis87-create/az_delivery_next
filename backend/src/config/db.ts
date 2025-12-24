const mongoose = require('mongoose');

const connectDB =  () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;