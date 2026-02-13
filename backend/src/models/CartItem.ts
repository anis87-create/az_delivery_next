import mongoose, { Schema, Types, Model } from 'mongoose';
interface CartItem {
    itemId: string,
    quantity: number,
    price: number
}

interface ICart {
    userId: Types.ObjectId,
    restaurantId: Types.ObjectId,
    items: CartItem[]
}


interface ICartDocument  extends ICart {
    createdAt: Date,
    updateAt: Date
}


const CartItemSubSchema = new Schema<CartItem>({
    itemId: {type: String, required: true},
    quantity: {type: Number, default: 1},
    price: {type: Number, required: true}
}, {_id: false});

const CartItemSchema = new Schema<ICartDocument>({
    userId: {type: Schema.Types.ObjectId, ref:'User', required: true},
    restaurantId: {type: Schema.Types.ObjectId, ref:'Restaurant', required: true},
    items: {type: [CartItemSubSchema]},

}, {
    timestamps: true
});

const CartItem: Model<ICartDocument> = mongoose.model<ICartDocument>('cartItem', CartItemSchema);
export default CartItem;