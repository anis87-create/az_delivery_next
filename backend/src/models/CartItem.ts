import mongoose, { Schema, Types, Model } from 'mongoose';

interface CartEntry {
    _id: Types.ObjectId;
    name: string;
    price: number;
    imageUrl?: string;
    ingredients?: string[];
    restaurantName?: string;
    restaurantId?: Types.ObjectId;
    baseFee?: number;
    isAvailable?: boolean;
    isPopular?: boolean;
    quantity: number;
}

interface ICart {
    userId: Types.ObjectId;
    items: CartEntry[];
}

interface ICartDocument extends ICart {
    createdAt: Date;
    updateAt: Date;
}

const CartEntrySchema = new Schema<CartEntry>({
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

const CartItemSchema = new Schema<ICartDocument>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [CartEntrySchema] }
}, {
    timestamps: true
});

const CartItem: Model<ICartDocument> = mongoose.model<ICartDocument>('cartItem', CartItemSchema);
export default CartItem;
