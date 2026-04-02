'use client'
import dynamic from 'next/dynamic';
import { FiMapPin, FiCreditCard } from 'react-icons/fi';
import {  useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/app/hooks/hooks';
import { useEffect } from 'react';
import { getOneOrder } from '@/app/store/slices/orderSlice';
import { useParams } from 'next/navigation';
import moment from 'moment';
import Image from 'next/image';
import { ORDER_STATUS } from '@/app/types/order.types';

const MapView = dynamic(() => import('./MapView'), { ssr: false });
const STATUS_STEPS = Object.values(ORDER_STATUS);

export default function OrderDetailPage() {
  const { order } = useSelector((state:RootState)=> state.orders);

  const CURRENT_STATUS = (order?.status || 'pending') as typeof STATUS_STEPS[number];
  const currentIndex = STATUS_STEPS.indexOf(CURRENT_STATUS);
  const progressPercent = (currentIndex / (STATUS_STEPS.length - 1)) * 100;


  const dispatch = useAppDispatch();
  const params = useParams();
  const restaurant = typeof order?.restaurantId === 'object' ? order.restaurantId : null;
  const id = Array.isArray(params.id) ? params.id[0] : params.id as string;
  useEffect(() => {
    if (id) dispatch(getOneOrder(id));
  }, [dispatch, id]);


  

  return (
    <div className="min-h-screen bg-gray-50 pt-35 px-14 pb-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order #{order?._id}</h1>

      <div className="flex gap-6 items-start">
        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Order Status */}
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-base">Order Status</h2>
              <span className="bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                {order?.status}
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
              <p className="text-2xl font-bold text-gray-900 mt-1">{restaurant?.estimatedDeliveryTime}</p>
            </div>
          </div>

          {/* Delivery Tracking */}
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
            <h2 className="font-bold text-gray-900 text-base mb-4">Delivery Tracking</h2>
            <MapView />
          </div>


          {/* Delivery Information */}
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
            <h2 className="font-bold text-gray-900 text-base mb-4">Delivery Information</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Delivery Address</p>
                  <p className="text-gray-400 text-sm mt-0.5">{restaurant?.street}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiCreditCard className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Payment Method</p>
                  <p className="text-gray-400 text-sm mt-0.5">{order?.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button className="flex-1 py-4 rounded-2xl border border-red-500 bg-red-500 font-semibold text-white hover:bg-gray-50 hover:text-red-500 transition-colors duration-500 cursor-pointer">
              Cancel Order
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN — Order summary */}
        <div className="w-80 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
            {/* Restaurant */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden bg-gray-200">
                {restaurant?.img && (
                  <Image src={restaurant.img} alt={restaurant.name} width={48} height={48} unoptimized className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{restaurant?.name}</p>
                <p className="text-gray-400 text-sm mt-0.5">{moment(order?.createdAt).calendar()}</p>
              </div>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-3 mb-4 pb-4 border-b border-gray-100">
              {order?.items.map((item) => (
                <div key={item.itemId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">{item.quantity}x</span>
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
                <span className="text-gray-900 text-sm">${order?.subTotal.toFixed(2)}</span>
              </div>
               {restaurant?.baseFee && (
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Delivery Fee</span>
                  <span className="text-gray-900 text-sm">${restaurant.baseFee}</span>
                </div>
               )}
            </div>

            {/* Total */}
            <div className="flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-gray-900">${order?.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
