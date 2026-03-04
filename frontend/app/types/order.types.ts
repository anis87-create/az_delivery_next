
interface OrderItem {
    itemId: string,
    restaurantId: string,
    name: string,
    price: number,
    quantity: number,
    imageUrl: string
}
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

export const ADDRESS_TYPE = {
    home : 'home',
    work : 'work',
    other : 'other'
} as const;
export type AddressType = typeof ADDRESS_TYPE[keyof typeof ADDRESS_TYPE];
interface Address {
    street : string,
    city: string,
    zipCode: string
}

export interface OrderProps {
    userId: string,
    items: OrderItem[],
    subTotal: number,
    deliveryFee: number,
    total: number,
    status: OrderStatus,
    deliveryAddress: Address,
    paymentMethod :  PaymentMethod,
    paymentStatus :  PaymentStatus,
    addressType: AddressType,
}
export interface Order extends OrderProps {
    _ID: string,
    createdAt: string,
    updatedAt: string
}


