'use client';

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, deleteItem, updateQuantity } from '../../store/slices/carteSlice.js';
import { useAppSelector } from '../hooks.js';

const QuantityContainer = ({item, addItem}) => {
  const [counter, setCounter] = useState(1);
  const dispatch = useDispatch();
  const {cartItems} = useAppSelector((state) => state.cart);
  const {isAuth, currentUser} = useAppSelector((state) => state.auth);

  // Derive isHidden from cartItems instead of using state
  const itemFound = cartItems.find((i) => i.id === item?.id);
  const isHidden = currentUser?.id && itemFound;



  const handleClick = () => {
    if (!currentUser?.id) return;

    addItem(item.id);
    setCounter(1);
    dispatch(addToCart({id: item.id,userId: currentUser.id,  name: item.name, quantity: counter, restaurantId: item.restaurantId, image: item.imageUrl, category: item.categoryId, price: item.price}));
  };
  const incrementCounter = () => {
    const newCounter = counter + 1;
    setCounter(newCounter);
    dispatch(updateQuantity({...item, quantity: newCounter}));
  }

  const decrementCounter = () => {
    const newCounter = counter - 1;
    setCounter(newCounter);
     if(counter === 1){
        dispatch(deleteItem(item));
     } else {
        dispatch(updateQuantity({...item, quantity: newCounter}));
     }
  }
  if (isHidden) {
    return(
        <div className="flex items-center gap-3">
        <button className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
         onClick={decrementCounter}
        >
          <span className="text-gray-600 text-sm">−</span>
        </button>

        <span className="text-lg font-semibold text-gray-800 min-w-8 text-center">
          {counter}
        </span>

        <button className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors"
        onClick={incrementCounter}
        >
          <span className="text-white text-sm">+</span>
        </button>
      </div>
    )
  }
  if(isAuth=== true){
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

export default QuantityContainer