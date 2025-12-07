const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
    img: {type: String},
    coverImg: {type: String},
    type: {type: String},
    street :{type: String},
    city: {type: String},
    zipCode: {type: String},
    phone: {type: Number},
    description: {type: String},
    deliveryZone: {type: String},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('restaurant', restaurantSchema);