import {z} from 'zod';

export const OrderItemSchema = z.object({
    itemId: z.string(),
    restaurantId: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    imageUrl: z.string()
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const ORDER_Status = {
    pending: 'pending',
    confirmed: 'confirmed',
    preparing: 'preparing',
    on_the_way: 'on_the_way',
    delivered: 'delivered',
    cancelled: 'cancelled'
} as const;

export type OrderStatus = typeof ORDER_Status[keyof typeof ORDER_Status];

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

export interface OrderProps {
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    items: OrderItem[],
    subTotal: number,
    total: number,
    deliveryAddress: Address,
    paymentMethod :  PaymentMethod,
    paymentStatus :  PaymentStatus,
}

export const OrderSchema = z.object({
    _id: z.string(),
    userId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    items: z.array(OrderItemSchema),
    subTotal: z.number(),
    total: z.number(),
    deliveryAddress: AddressSchema,
    paymentMethod: z.enum(['card', 'cash']),
    paymentStatus: z.enum(['pending', 'paid', 'failed']),
    createdAt: z.string(),
    updatedAt: z.string(),
})
export type Order = z.infer<typeof OrderSchema>;
export interface OrderState {
   orders: Order[],
   order: Order | null,
   isLoading: boolean,
   isError: boolean,
   message: string
}

export interface OrderForm {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    street: string,
    city: string,
    zipCode: string,
    paymentMethod: string,
    paymentStatus: string
}


