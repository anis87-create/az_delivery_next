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

export interface Item {
  _id: string,  
  categoryId: string,
  restaurantId: string,
  name: string,
  ingredients: string [],
  price: number,
  imageUrl: string,
  isAvailable: boolean,
  isPopular: boolean
}

export interface itemState {
    isLoading: boolean,
    isSuccess: boolean,
    isError : boolean,
    items: Item[]
}

export interface ItemFormUpdate {
    itemForm: ItemProps,
    id: string
}