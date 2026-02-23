'use client';

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addCartItem, getCartItem, removeFromCartItem } from '../store/slices/cartItemSlice';
import { useParams } from 'next/navigation';
import { RootState, AppDispatch } from '../store/store';
import { Item } from '../types/item.types';

interface Props {
  item: Item & { _id: string };
}

const QuantityContainer = ({ item }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItem } = useSelector((state: RootState) => state.cartItem);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const params = useParams();

  useEffect(() => {
    dispatch(getCartItem());
  }, [dispatch, item.restaurantId]);

  const cartItemsIds = new Set(
    cartItem?.items?.map(entry => entry._id).filter(Boolean)
  );

  let isItemFound = false;
  if (cartItem !== null && cartItem?.items.length > 0) {
    isItemFound = cartItemsIds.has(item._id);
  }

  const getItemQuantity = () => {
    return cartItem!.items.find(i => i._id === item._id)?.quantity ?? 1;
  }

  const handleClick = () => {
    if (!user?._id) return;
    dispatch(addCartItem({
      id: item._id,
      restaurantId: Array.isArray(params.id) ? params.id[0] : params.id,
    }));
  };

  const incrementCounter = (id: string) => {
    dispatch(addCartItem({
      id,
      restaurantId: Array.isArray(params.id) ? params.id[0] : params.id,
    }));
  }

  const decrementCounter = (id: string) => {
    dispatch(removeFromCartItem(id));
  }

  if (isAuthenticated) {
    if (isItemFound) {
      return (
        <div className="flex items-center gap-3">
          <button
            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
            onClick={() => decrementCounter(item._id)}
          >
            <span className="text-gray-600 text-sm cursor-pointer">−</span>
          </button>

          <span className="text-lg font-semibold text-gray-800 min-w-8 text-center">
            {getItemQuantity()}
          </span>

          <button
            className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors"
            onClick={() => incrementCounter(item._id)}
          >
            <span className="text-white text-sm cursor-pointer">+</span>
          </button>
        </div>
      );
    } else {
      return (
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 active:scale-95 transform"
          >
            Add
          </button>
        </div>
      );
    }
  }
}

export default QuantityContainer
