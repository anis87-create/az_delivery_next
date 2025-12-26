// Image interface
export interface Image {
  name: string;
}

// Base restaurant information - propriétés communes avec les mêmes types
interface BaseRestaurantInfo {
  name: string;
  category: string;
  type: string;
  street: string;
  zipCode: string;
  deliveryZone: string;
  img?: Image;
  coverImg?: Image;
  tags?: string[];
}

// Restaurant form state - extends la base et ajoute les champs spécifiques au formulaire
export interface RestaurantFormState extends BaseRestaurantInfo {
  description: string;  // Requis dans le formulaire
  phone?: string;       // Optionnel dans le formulaire
  city?: string;        // Optionnel dans le formulaire
}

// Restaurant data structure - extends la base et ajoute les champs spécifiques à l'API
export interface Restaurant extends BaseRestaurantInfo {
  _id?: string;         // ID généré par MongoDB
  owner: string;        // User ID du propriétaire
  city: string;         // Requis dans l'API
  phone: string;        // Requis dans l'API
  description?: string; // Optionnel dans l'API
}

// Props for RegisterForm component
export interface RegisterFormProps {
  onRoleChange(role: string): void;
}
