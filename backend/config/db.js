const mongoose = require('mongoose');

module.exports.connectDB =  () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');
    } catch (error) {
        console.log(error);
    }
}