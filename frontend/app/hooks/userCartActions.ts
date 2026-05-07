import { useAddCartItemMutation, useRemoveFromCartItemMutation } from '../store/services/cartItems';

export const useCartActions = (): [(id: string) => void, (id: string) => void] => {
  const [addCartItem] = useAddCartItemMutation();
  const [removeFromCartItem] = useRemoveFromCartItemMutation();

  const incrementCounter = (id: string) => {
    addCartItem(id);
  };

  const decrementCounter = (id: string) => {
    removeFromCartItem(id);
  };

  return [incrementCounter, decrementCounter];
};
