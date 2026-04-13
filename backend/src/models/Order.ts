import mongoose, { Types } from "mongoose";
import { z } from 'zod';
import { objectIdSchema } from "../utils/zod.utils";
const { Schema } = mongoose;


// --- Zod Schemas (validation HTTP) ---

export const ItemSchema = z.object({
    itemId: objectIdSchema,
    restaurantId: objectIdSchema,
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().positive(),
    imageUrl: z.string()
});

export type Item = z.infer<typeof ItemSchema>;

export const ORDER_STATUS = {
    pending: 'pending',
    confirmed: 'confirmed',
    preparing: 'preparing',
    on_the_way: 'on_the_way',
    delivered: 'delivered',
    cancelled: 'cancelled'
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const AddressSchema = z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string()
});

export type Address = z.infer<typeof AddressSchema>;

export const PAYMENT_ENUM = {
    card: 'card',
    cash: 'cash'
} as const;
export type PaymentMethod = typeof PAYMENT_ENUM[keyof typeof PAYMENT_ENUM];

export const PAYMENT_STATUS_ENUM = {
    pending: 'pending',
    paid: 'paid',
    failed: 'failed'
} as const;
export type PaymentStatus = typeof PAYMENT_STATUS_ENUM[keyof typeof PAYMENT_STATUS_ENUM];

export const OrderZodSchema = z.object({
    userId: objectIdSchema,
    restaurantId: objectIdSchema || z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phoneNumber: z.string().optional(),
    items: z.array(ItemSchema),
    subTotal: z.number(),
    total: z.number(),
    status: z.enum(ORDER_STATUS),
    deliveryAddress: AddressSchema,
    paymentMethod: z.enum(PAYMENT_ENUM),
    paymentStatus: z.enum(PAYMENT_STATUS_ENUM),
});

export type IOrderInput = z.infer<typeof OrderZodSchema>;

export const StatusZodSchema = OrderZodSchema.pick({
    status: true
});
export type IStatusInput = z.infer<typeof StatusZodSchema>;

// --- Mongoose Schemas ---

const ItemMongooseSchema = new Schema({
    itemId: { type: Schema.Types.ObjectId, required: true, ref: 'Item' },
    restaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, required: true }
}, { _id: false });

const AddressMongooseSchema = new Schema<Address>({
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true }
}, { _id: false });

const OrderMongooseSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    restaurantId: { type: Schema.Types.ObjectId, required: true, ref: 'Restaurant' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String },
    items: { type: [ItemMongooseSchema], required: true },
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(ORDER_STATUS),
        default: ORDER_STATUS.pending,
        required: true
    },
    deliveryAddress: { type: AddressMongooseSchema, required: true },
    paymentMethod: {
        type: String,
        enum: Object.values(PAYMENT_ENUM),
        required: true
    },
    paymentStatus: {
        type: String,
        enum: Object.values(PAYMENT_STATUS_ENUM),
        default: PAYMENT_STATUS_ENUM.pending,
        required: true
    }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderMongooseSchema);

export default Order;
