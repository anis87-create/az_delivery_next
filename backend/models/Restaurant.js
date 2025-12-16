const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
    img: {type: String},
    coverImg: {type: String},
    type: {type: String, required: true},
    street :{type: String, required: true},
    city: {type: String, required: true},
    zipCode: {type: String, required: true},
    phone: {type: Number, required: true},
    description: {type: String},
    deliveryZone: {type: String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    tags: {type: [String]}
});

module.exports = mongoose.model('restaurant', restaurantSchema);