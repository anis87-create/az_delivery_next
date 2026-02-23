'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { AppDispatch } from '../hooks';
import { getCartItem } from '../store/slices/cartItemSlice';
import { getAllCategories } from '../store/slices/categorySlice';


const Cart = () => {
  const { cartItem } = useSelector((state:RootState) => state.cartItem);
  const {categories} = useSelector((state:RootState) => state.categories);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getCartItem());
  }, [dispatch]);

  useEffect(() => {
    const restaurantId = cartItem?.items[0]?.restaurantId;
    if (restaurantId) {
      dispatch(getAllCategories(restaurantId));
    }
  }, [dispatch, cartItem?.items]);

  const getCategoryNameById = (categoryId: string) => {
    return categories.find(c => c._id === categoryId)?.name ?? 'Category';
  };

  return (
    <>
      {cartItem?.items.length > 0 ? (
        <div className="min-h-screen bg-gray-50">
          <main className="container px-4 py-40">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Your Cart</h1>
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border h-10 px-4 py-2 text-red-600 border-red-600 hover:bg-red-50 bg-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                  Clear Cart
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Items list */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                      <div className="space-y-4">
                        {/* Item row */}
                        {
                         cartItem.items.map(item => (
                        <div key={item._id} className="flex items-center gap-4 p-4 border rounded-lg">
                          {/* imageUrl sera remplacé par la vraie donnée */}
                            <img
                              alt="image"
                              className="w-16 h-16 object-cover rounded-lg"
                              src={item.imageUrl}
                            />
                          
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-gray-600 text-sm">{getCategoryNameById(item.categoryId)}</p>
                            <p className="text-orange-500 font-semibold">${item.price}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 rounded-md">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                <path d="M5 12h14" />
                              </svg>
                            </button>
                            <span className="font-semibold min-w-8 text-center">1</span>
                            <button className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 rounded-md">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                <path d="M5 12h14" /><path d="M12 5v14" />
                              </svg>
                            </button>
                            <button className="inline-flex items-center justify-center h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>$8.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>$1.99</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>$0.76</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span>$12.73</span>
                        </div>
                      </div>
                    </div>
                    <Link href="/checkout">
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-3">
                        Proceed to Checkout
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <main className="container px-4 py-40">
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="text-gray-400 mb-6">
              <img
                alt="Empty Cart"
                className="w-32 h-32 mx-auto mb-4 opacity-50"
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven&apos;t added any items to your cart yet.</p>
            <Link href="/search">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                Start Shopping
              </button>
            </Link>
          </div>
        </main>
      )}
    </>
  );
};

export default Cart;
