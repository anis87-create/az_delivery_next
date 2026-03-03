
interface Item {
  itemId: string,
  categoryId: string
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

}

export interface OrderProps {
    userId: string,
    restaurantId: string,
    items: Item[],
    subTotal: number,
    deliveryFee: number,
    total: number,
    status: StatusEnum,
    address: Address
}