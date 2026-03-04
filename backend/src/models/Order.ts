import { Types, Model, Document } from "mongoose";
import mongoose  from "mongoose";
const {Schema} = mongoose;
interface IItem {
    itemId: Types.ObjectId,
    restaurantId: Types.ObjectId,
    name: string,
    price: number,
    quantity: number,
    imageUrl: string
}
enum StatusEnum {
    pending = 'pending',
    confirmed = 'confirmed',
    preparing = 'preparing',
    on_the_way = 'on_the_way',
    delivered = 'delivered',
    cancelled= 'cancelled'
}

interface Address {
    street: string,
    city: string,
    zipCode: string
}

enum PaymentEnum {
    card = 'card',
    cash = 'cash'
}

enum PaymentStatusEnum {
    pending= 'pending',
    paid = 'paid',
    failed = 'failed'
}

enum AddressTypeEnum {
    home = 'home',
    work = 'work',
    other = 'other'
}

interface IOrder {
    userId: Types.ObjectId,
    items: IItem[],
    subTotal: number,
    deliveryFee: number,
    total: number,
    status: StatusEnum,
    deliveryAddress: Address,
    paymentMethod: PaymentEnum,
    paymentStatus: PaymentStatusEnum,
    addressType: AddressTypeEnum,
}

interface IOrderDocument extends IOrder,Document {
    createdAt: Date,
    updatedAt: Date
}

const OrderSchema = new Schema<IOrderDocument>({
   userId: {type: Schema.Types.ObjectId, ref:'User', required: true},
   items: {type: [{
      itemId: {type: Schema.Types.ObjectId, ref:'Item', required: true},
      restaurantId: {type: Schema.Types.ObjectId, ref:'Restaurant', required: true},
      name: {type: String, required: true},
      price: {type: Number, required: true, min: 0},
      quantity: {type: Number, required: true, min: 1},
      imageUrl: {type: String, required: true}
   }], required: true},
   subTotal: {type: Number, required:true},
   deliveryFee: {type: Number, required: true},
   total: {type:Number, required: true},
   status: {
    type: String,
    enum: Object.values(StatusEnum),
    default: StatusEnum.pending
   },
   deliveryAddress: {
      street: {type: String, required: true},
      city: {type: String, required: true},
      zipCode: {type: String, required: true}
   },
   paymentMethod: {
    type: String,
    enum: Object.values(PaymentEnum),
    default: PaymentEnum.card,
    required: true
   },
   paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatusEnum),
    default: PaymentStatusEnum.pending,
    required: true
   },
   addressType: {
    type: String,
    enum: Object.values(AddressTypeEnum),
    default: AddressTypeEnum.home,
    required: true
   }
}, {timestamps: true});

const Order: Model<IOrderDocument> = mongoose.model<IOrderDocument>('order', OrderSchema);

export {IOrder, IOrderDocument};
export default Order;


