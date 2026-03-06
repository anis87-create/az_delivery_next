export interface ItemProps {
  categoryId: string,
  restaurantId: string,
  name: string,
  ingredients: string [],
  price: number,
  imageUrl: string,
  isAvailable: boolean,
  isPopular: boolean
}

export interface Item extends ItemProps {
  _id: string,
  createdAt: string,
  updatedAt: string
}

export interface itemState {
    isLoading: boolean,
    isError: boolean,
    message: string,
    items: Item[]
}

export interface ItemFormUpdate {
    itemForm: ItemProps,
    id: string
}
