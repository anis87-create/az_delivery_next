const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    fullName: {type: String, required: true},
    email: {type: String, unique:true, required: true,
    validate: {
      validator: function(v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
    },
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

