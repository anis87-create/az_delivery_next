'use client';

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getCartItem, clearItems } from '../store/slices/cartItemSlice';
import { RootState, AppDispatch } from '../store/store';
import { Item } from '../types/item.types';
import { useCartActions } from '../hooks/userCartActions';
import {
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface Props {
  item: Item & { _id: string };
}

const QuantityContainer = ({ item }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItem } = useSelector((state: RootState) => state.cartItem);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [incrementCounter, decrementCounter] = useCartActions();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showRemoved, setShowRemoved] = useState(false);
  const { restaurant: { items } } = useSelector((state: RootState) => state.restaurant);



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
    if (cartItem && cartItem.items.length > 0) {                                                   
      const cartRestaurantIds = cartItem.items.map(e => e.restaurantId);
      if (!items.some(menuItem => cartRestaurantIds.includes(menuItem.restaurantId))) {            
        setShowConfirmModal(true);                                                                 
        return;                                                                                    
      }                                                                                            
    }                                                       
    incrementCounter(item._id);                                                                    
    setShowSuccess(true);
  }; 

  const handleConfirmClear = async () => {
    setShowConfirmModal(false);
    await dispatch(clearItems());
  };

  const handleDecrement = () => {
    const isLast = getItemQuantity() === 1;
    decrementCounter(item._id);
    if (isLast) {
      setShowRemoved(true);
    }
  };

  const snackbars = (
    <>
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" variant="filled">
          {item.name} has been added to your cart
        </Alert>
      </Snackbar>

      <Snackbar
        open={showRemoved}
        autoHideDuration={3000}
        onClose={() => setShowRemoved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowRemoved(false)} severity="error" variant="filled">
          {item.name} has been removed from your cart
        </Alert>
      </Snackbar>

      <Dialog open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <DialogTitle>Clear your cart?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your cart contains items from another restaurant. Clear your cart to order from this restaurant?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmModal(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmClear} variant="contained" color="error">
            Clear cart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  if (isAuthenticated) {
    if (isItemFound) {
      return (
        <>
          {snackbars}
          <div className="flex items-center gap-3">
            <button
              className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              onClick={handleDecrement}
            >
              <span className="text-gray-600 text-sm cursor-pointer">−</span>
            </button>

            <span className="text-lg font-semibold text-gray-800 min-w-8 text-center">
              {getItemQuantity()}
            </span>

            <button
              className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              onClick={() => incrementCounter(item._id)}
            >
              <span className="text-white text-sm cursor-pointer">+</span>
            </button>
          </div>
        </>
      );
    } else {
      return (
        <>
          {snackbars}
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={handleClick}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 active:scale-95 transform cursor-pointer"
            >
              Add
            </button>
          </div>
        </>
      );
    }
  }

  return null;
}

export default QuantityContainer
