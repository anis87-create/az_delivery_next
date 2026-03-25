'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AppDispatch, RootState } from '../hooks/hooks'
import { clearItems, getCartItem,  getSubTotalPrice,  getTotalPrice } from '../store/slices/cartItemSlice'
import { addOrder, getAllOrders } from '../store/slices/orderSlice'

const inputClass =
  'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-gray-100 read-only:text-gray-500 read-only:cursor-not-allowed'

const labelClass = 'block text-sm font-medium text-gray-700 mb-1'


export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {cartItem} = useSelector((state:RootState)=> state.cartItem);
  const { user } = useSelector((state:RootState) => state.auth);
  const { orders } = useSelector((state:RootState) => state.orders);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('cash');
  const totalPrice = useSelector(getTotalPrice);
  const subTotal = useSelector(getSubTotalPrice);
  const firstName = user?.fullName.split(' ')[0] || '';
  const lastName  = user?.fullName.split(' ')[1] || '';
  const restaurantId= [...new Set(cartItem.items?.map(item => item.restaurantId))];

  useEffect(() => {
     dispatch(getCartItem());
     dispatch(getAllOrders());
  }, [dispatch]);
  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await dispatch(addOrder({
      userId: user?._id || '',
      restaurantId: restaurantId[0] || '',
      firstName,
      lastName,
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      items: cartItem?.items.map((item) => ({
        itemId: item._id,
        restaurantId: item.restaurantId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      })) || [],
      subTotal,
      total: totalPrice,
      deliveryAddress: {
        street: user?.address || '',
        city: user?.city || '',
        zipCode: user?.zipCode || '',
      },
      paymentMethod,
      paymentStatus: 'pending',
      status: 'pending'
    }));
    if (addOrder.fulfilled.match(result)) {
      dispatch(clearItems());
      router.push(`orders/confirmation/${result.payload._id}`);
    } else {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
{/* Main */}
      <main className="flex-1 container px-6 py-16 mt-20">
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={(e) => submitOrder(e)}>
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Delivery Information */}
            <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={labelClass} htmlFor="firstName">First Name*</label>
                  <input className={inputClass} id="firstName" name="firstName" placeholder="John" required value={firstName} readOnly />
                </div>
                <div>
                  <label className={labelClass} htmlFor="lastName">Last Name*</label>
                  <input className={inputClass} id="lastName" name="lastName" placeholder="Doe" required value={lastName} readOnly />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={labelClass} htmlFor="email">Email Address*</label>
                  <input className={inputClass} id="email" name="email" type="email" placeholder="john.doe@example.com" required value={user?.email || ''} readOnly />
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">Phone Number*</label>
                  <input className={inputClass} id="phone" name="phoneNumber" placeholder="+1 (555) 123-4567" required value={user?.phoneNumber || ''} readOnly />
                </div>
              </div>

              <div className="mb-5">
                <label className={labelClass} htmlFor="address">Street Address*</label>
                <input className={inputClass} id="address" name="address" placeholder="123 Main St" required value={user?.address || ''} readOnly />
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass} htmlFor="city">City*</label>
                  <input className={inputClass} id="city" name="city" placeholder="Anytown" required value={user?.city || ''} readOnly />
                </div>
                <div>
                  <label className={labelClass} htmlFor="zipCode">ZIP Code*</label>
                  <input className={inputClass} id="zipCode" name="zipCode" placeholder="12345" required value={user?.zipCode || ''} readOnly />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

              <div className="grid gap-4 mb-8">
                {/* Card */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center space-x-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                    paymentMethod === 'card' ? 'border-orange-400 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === 'card'}
                    className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center cursor-pointer ${
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
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center space-x-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                    paymentMethod === 'cash' ? 'border-orange-400 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === 'cash'}
                    className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center cursor-pointer ${
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
                    <p className="text-xs text-green-600 font-medium">{item.baseFee ? `${item.baseFee} TND` : 'Free delivery'}</p>
                  </div>
                  <div className="text-sm font-medium">{item.price} TND</div>
                </div>
              </div>
              ))}
              

              <hr className="my-5" />

              {/* Total */}
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)} TND</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center w-full h-12 rounded-md bg-green-500 hover:bg-green-600 text-white font-medium text-base transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Place Order • ${totalPrice.toFixed(2)} TND`
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
