const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    phone: {type: String},
    address:{type: String},
    role: {
        type: String,
        enum: ['customer', 'restaurant_owner'],
        default: 'customer',
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);

