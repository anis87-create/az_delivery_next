import mongoose, { Schema, Types, Model } from 'mongoose';
import {z} from 'zod';

export const CartEntrySchema = z.object({
    _id: z.instanceof(Types.ObjectId),
    name: z.string(),
    price: z.number(),
    imageUrl: z.string(),
    ingredients: z.array(z.string()),
    restaurantName: z.string(),
    restaurantId: z.instanceof(Types.ObjectId),
    baseFee: z.number(),
    isAvailable: z.boolean(),
    isPopular: z.boolean(),
    quantity: z.number()
});




export const CartSchema = z.object({
    userId: z.instanceof(Types.ObjectId),
    items: z.array(CartEntrySchema),
    createdAt: z.date(),
    updatedAt: z.date()
});
export type CartEntry = z.infer<typeof CartEntrySchema>;
export type Cart = z.infer<typeof CartSchema>;
const CartEntryMongooseSchema = new Schema<CartEntry>({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    ingredients: { type: [String] },
    restaurantName: { type: String },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
    baseFee: { type: Number },
    isAvailable: { type: Boolean },
    isPopular: { type: Boolean },
    quantity: { type: Number, default: 1 }
}, { _id: false });

const CartMongooseSchema = new Schema<Cart>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [CartEntryMongooseSchema] }
}, {
    timestamps: true
});

const CartItem: Model<Cart> = mongoose.model<Cart>('cartItem', CartMongooseSchema);
export default CartItem;
