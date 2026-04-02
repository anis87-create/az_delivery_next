import {z} from 'zod';
import { RestaurantSchema } from './restaurant.types';

export const OrderItemSchema = z.object({
    itemId: z.string(),
    restaurantId: z.string(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().positive(),
    imageUrl: z.string()
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const ORDER_STATUS = {
    pending: 'pending',
    confirmed: 'confirmed',
    preparing: 'preparing',
    on_the_way: 'on_the_way',
    delivered: 'delivered',
    cancelled: 'cancelled'
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const PAYMENT_METHOD = {
    card : 'card',
    cash : 'cash'
} as const;
export type PaymentMethod = typeof  PAYMENT_METHOD[keyof typeof PAYMENT_METHOD];

export const PAYMENT_STATUS = {
    pending : 'pending',
    paid : 'paid',
    failed : 'failed'
} as const;
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];


export const AddressSchema = z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string()
});

export type Address = z.infer<typeof AddressSchema>;



export const OrderSchema = z.object({
    _id: z.string(),
    userId: z.string(),
    restaurantId: z.union([RestaurantSchema, z.string()]),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    items: z.array(OrderItemSchema),
    subTotal: z.number(),
    total: z.number(),
    status: z.enum(Object.values(ORDER_STATUS) as [string, ...string[]]),
    deliveryAddress: AddressSchema,
    paymentMethod: z.enum(Object.values(PAYMENT_METHOD) as [string, ...string[]]),
    paymentStatus: z.enum(Object.values(PAYMENT_STATUS) as [string, ...string[]]),
    createdAt: z.string(),
    updatedAt: z.string(),
});
export const OrderPropsSchema = OrderSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true
})
export type OrderProps = z.infer<typeof OrderPropsSchema>;

export type Order = z.infer<typeof OrderSchema>;

export interface OrderState {
   orders: Order[],
   order: Order | null,
   isLoading: boolean,
   isError: boolean,
   message: string
}

export const OrderFormSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    street: z.string(),
    city: z.string(),
    zipCode:z.string(),
    paymentMethod: z.enum(Object.values(PAYMENT_METHOD) as [string, ...string[]]),
    paymentStatus: z.enum(Object.values(PAYMENT_STATUS) as [string, ...string[]])
});

export type OrderForm = z.infer<typeof OrderFormSchema>



