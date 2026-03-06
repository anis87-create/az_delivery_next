import { Item } from "./item.types";

// Image interface
export interface Image {
  name: string;
}

// Base restaurant information - propriétés communes avec les mêmes types
export interface BaseRestaurantInfo {
  name: string;
  category: string;
  type: string;
  street: string;
  zipCode: string;
  deliveryZone: string;
  img?: Image;
  coverImg?: Image;
  tags?: string[];
  email: string,
  openingHours: any,
  phone: string,
  description: string,
  city: string,
  baseFee: string,
  estimatedDeliveryTime: string,
}

// Restaurant data structure - extends la base et ajoute les champs spécifiques à l'API
export interface Restaurant extends BaseRestaurantInfo {
  _id?: string;         // ID généré par MongoDB
  owner: string;        // User ID du propriétaire
}

// Props for RegisterForm component
export interface RegisterFormProps {
  onRoleChange(role: string): void;
}

export interface RestaurantState {
  restaurant: Restaurant | null,
  isError: boolean,
  isLoading: boolean,
  message: string,
  restaurants: Restaurant[]
}

export interface ImageProps {
   img: string | null,
   coverImg: string | null
}
