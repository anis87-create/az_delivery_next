'use client'
import dynamic from 'next/dynamic';
import { FiPhone, FiMessageSquare, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

const STATUS_STEPS = ['Order Placed', 'Preparing', 'On the Way', 'Delivered'];
const CURRENT_STATUS = 'On the Way';
const currentIndex = STATUS_STEPS.indexOf(CURRENT_STATUS);

const order = {
  id: 'ORD-1234',
  status: CURRENT_STATUS,
  estimatedDelivery: '15-25 min',
  restaurant: { name: 'Burger Palace', time: 'Today, 12:30 PM' },
  items: [
    { name: 'Classic Cheeseburger', qty: 1, price: 8.99 },
    { name: 'French Fries', qty: 1, price: 3.99 },
  ],
  subtotal: 12.98,
  deliveryFee: 1.99,
  serviceFee: 0.99,
  total: 15.96,
  driver: { name: 'Michael S.', rating: 4.8, phone: '+1 (555) 123-4567' },
  address: '123 Main St, Apt 4B, Anytown, USA',
  payment: 'Credit Card (****1234)',
};

export default function OrderDetailPage() {
  const progressPercent = (currentIndex / (STATUS_STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pt-35 px-14 pb-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order #{order.id}</h1>

      <div className="flex gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Order Status */}
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-base">Order Status</h2>
              <span className="bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                {order.status}
              </span>
            </div>

            {/* Progress bar */}
            <div className="relative mb-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Step labels */}
            <div className="flex justify-between">
              {STATUS_STEPS.map((step, i) => (
                <span
                  key={step}
                  className={`text-xs font-medium ${i <= currentIndex ? 'text-green-500' : 'text-gray-400'}`}
                >
                  {step}
                </span>
              ))}
            </div>

            {/* Estimated delivery */}
            <div className="text-center mt-5">
              <p className="text-gray-400 text-sm">Estimated Delivery</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{order.estimatedDelivery}</p>
            </div>
          </div>

          {/* Delivery Tracking */}
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
            <h2 className="font-bold text-gray-900 text-base mb-4">Delivery Tracking</h2>
            <MapView />
          </div>

          {/* Delivery Driver */}
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
            <h2 className="font-bold text-gray-900 text-base mb-4">Delivery Driver</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900">{order.driver.name}</p>
                    <FaStar className="text-yellow-400 w-4 h-4" />
                    <span className="text-gray-700 text-sm font-medium">{order.driver.rating}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-0.5">{order.driver.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <FiPhone className="w-5 h-5 text-gray-700" />
                </button>
                <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <FiMessageSquare className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
            <h2 className="font-bold text-gray-900 text-base mb-4">Delivery Information</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Delivery Address</p>
                  <p className="text-gray-400 text-sm mt-0.5">{order.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiCreditCard className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Payment Method</p>
                  <p className="text-gray-400 text-sm mt-0.5">{order.payment}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button className="flex-1 py-4 rounded-2xl border border-gray-200 bg-white font-semibold text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer">
              Need Help?
            </button>
            <button className="flex-1 py-4 rounded-2xl border border-gray-200 bg-white font-semibold text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer">
              Cancel Order
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN — Order summary */}
        <div className="w-80 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
            {/* Restaurant */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
              <div>
                <p className="font-bold text-gray-900 text-sm">{order.restaurant.name}</p>
                <p className="text-gray-400 text-sm mt-0.5">{order.restaurant.time}</p>
              </div>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-3 mb-4 pb-4 border-b border-gray-100">
              {order.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">{item.qty}x</span>
                    <span className="text-gray-900 text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-gray-900 text-sm font-medium">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Fees */}
            <div className="flex flex-col gap-2 mb-4 pb-4 border-b border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Subtotal</span>
                <span className="text-gray-900 text-sm">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Delivery Fee</span>
                <span className="text-gray-900 text-sm">${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Service Fee</span>
                <span className="text-gray-900 text-sm">${order.serviceFee.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
