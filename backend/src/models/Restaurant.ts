import mongoose, { Schema, Document, Model, Types } from 'mongoose';

interface IRestaurant {
    name: string,
    category: string,
    img?: string,
    coverImg?: string,
    type: string,
    street: string,
    city: string,
    zipCode: string,
    phone: string,
    description?: string,
    deliveryZone: string,
    owner: Types.ObjectId,
    tags?: string[]
}

interface IRestaurantDocument extends IRestaurant, Document {
  createdAt: Date,
  updatedAt: Date
}
const restaurantSchema = new Schema<IRestaurantDocument>({
    name: {type: String, required: true},
    category: {type: String, required: true},
    img: {type: String},
    coverImg: {type: String},
    type: {type: String, required: true},
    street :{type: String, required: true},
    city: {type: String, required: true},
    zipCode: {type: String, required: true},
    phone: {type: String, required: true},
    description: {type: String},
    deliveryZone: {type: String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    tags: {type: [String]}
}, {
    timestamps: true
});
const Restaurant: Model<IRestaurantDocument> = mongoose.model<IRestaurantDocument>('Restaurant', restaurantSchema);
export default Restaurant;
export { IRestaurant, IRestaurantDocument };
