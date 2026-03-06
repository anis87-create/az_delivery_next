'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../hooks/hooks'
import { getCartItem, getSubTotalPrice } from '../store/slices/cartItemSlice'
import { getAllOrders } from '../store/slices/orderSlice'

type AddressType = 'home' | 'work' | 'other'
type PaymentMethod = 'card' | 'cash'

const inputClass =
  'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'

const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

export default function CheckoutPage() {
  const [addressType, setAddressType] = useState<AddressType>('home');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const dispatch = useDispatch<AppDispatch>();
  const {cartItem} = useSelector((state:RootState)=> state.cartItem);
  const { orders } = useSelector((state:RootState) => state.orders);
  const subTotalPrice = useSelector(getSubTotalPrice);
  useEffect(() => {
     dispatch(getCartItem());
     dispatch(getAllOrders());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
{/* Main */}
      <main className="flex-1 container px-6 py-16 mt-20">
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Information */}
            <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={labelClass} htmlFor="name">Full Name*</label>
                  <input className={inputClass} id="name" name="name" placeholder="John Doe" required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">Phone Number*</label>
                  <input className={inputClass} id="phone" name="phone" placeholder="+1 (555) 123-4567" required />
                </div>
              </div>

              <div className="mb-5">
                <label className={labelClass} htmlFor="email">Email Address*</label>
                <input className={inputClass} id="email" name="email" type="email" placeholder="john.doe@example.com" required />
              </div>

              {/* Address Type */}
              <div className="mb-5">
                <span className="block text-sm font-medium text-gray-700 mb-3">Address Type</span>
                <div className="flex space-x-4">
                  {(['home', 'work', 'other'] as AddressType[]).map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={addressType === type}
                        onClick={() => setAddressType(type)}
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          addressType === type
                            ? 'border-orange-500 text-orange-500'
                            : 'border-gray-400'
                        }`}
                      >
                        {addressType === type && (
                          <span className="w-2 h-2 rounded-full bg-orange-500 block" />
                        )}
                      </button>
                      <span className="text-sm font-medium capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className={labelClass} htmlFor="address">Street Address*</label>
                <input className={inputClass} id="address" name="address" placeholder="123 Main St" required />
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="city">City*</label>
                  <input className={inputClass} id="city" name="city" placeholder="Anytown" required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="zipCode">ZIP Code*</label>
                  <input className={inputClass} id="zipCode" name="zipCode" placeholder="12345" required />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

              <div className="grid gap-4 mb-8">
                {/* Card */}
                <label
                  className={`flex items-center space-x-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                    paymentMethod === 'card' ? 'border-orange-400 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === 'card'}
                    onClick={() => setPaymentMethod('card')}
                    className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                      paymentMethod === 'card' ? 'border-orange-500' : 'border-gray-400'
                    }`}
                  >
                    {paymentMethod === 'card' && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 block" />
                    )}
                  </button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                    <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                  <span className="text-sm font-medium">Credit/Debit Card</span>
                </label>

                {/* Cash */}
                <label
                  className={`flex items-center space-x-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                    paymentMethod === 'cash' ? 'border-orange-400 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === 'cash'}
                    onClick={() => setPaymentMethod('cash')}
                    className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                      paymentMethod === 'cash' ? 'border-orange-500' : 'border-gray-400'
                    }`}
                  >
                    {paymentMethod === 'cash' && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 block" />
                    )}
                  </button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                    <rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" />
                  </svg>
                  <span className="text-sm font-medium">Cash on Delivery</span>
                </label>
              </div>

              {/* Card details — shown only when card is selected */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClass} htmlFor="cardNumber">Card Number</label>
                    <input className={inputClass} id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="cardName">Name on Card</label>
                    <input className={inputClass} id="cardName" name="cardName" placeholder="John Doe" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} htmlFor="expiryDate">Expiry Date</label>
                      <input className={inputClass} id="expiryDate" name="expiryDate" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="cvv">CVV</label>
                      <input className={inputClass} id="cvv" name="cvv" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
              {/* Item(s) */}
              {cartItem?.items.map((item) => (
                <div className="space-y-4 mb-6" key={item._id}>
                <div className="flex items-start">
                  <div className="relative w-14 h-14 shrink-0 mr-4">
                    <img
                      alt="image"
                      className="w-full h-full object-cover rounded-md"
                      src={item.imageUrl}
                    />
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.restaurantName}</p>
                  </div>
                  <div className="text-sm font-medium">${subTotalPrice}</div>
                </div>
              </div>
              ))}
              

              <hr className="my-5" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${subTotalPrice}</span>
                </div>
          
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>$29.95</span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="inline-flex items-center justify-center w-full h-12 rounded-md bg-green-500 hover:bg-green-600 text-white font-medium text-base transition-colors"
            >
              Place Order • $29.95
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
