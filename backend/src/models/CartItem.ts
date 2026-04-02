import mongoose, { Schema, Model } from 'mongoose';
import {z} from 'zod';
import { inputTextSchema, objectIdSchema } from '../utils/zod.utils';
import { ItemSchema } from './Items';

export const CartEntrySchema = ItemSchema.omit({ categoryId: true }).extend({
    _id: objectIdSchema,
    restaurantName: inputTextSchema,
    baseFee: z.number().positive(),
    quantity: z.number().int().min(1)
});




export const CartSchema = z.object({
    userId: objectIdSchema,
    items: z.array(CartEntrySchema),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
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
    quantity: { type: Number, default: 1, required: true }
}, { _id: false });

const CartMongooseSchema = new Schema<Cart>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [CartEntryMongooseSchema] }
}, {
    timestamps: true
});

const CartItem: Model<Cart> = mongoose.model<Cart>('CartItem', CartMongooseSchema);
export default CartItem;
