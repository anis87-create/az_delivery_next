'use client'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/hooks';
import {  getOrderByUserId } from '../store/slices/orderSlice';
import { getAllRestaurants } from '../store/slices/restaurantSlice';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const STATUS_STYLES: Record<string, string> = {
  preparing:  'bg-yellow-400 text-white',
  pending:    'bg-gray-400 text-white',
  confirmed:  'bg-blue-500 text-white',
  on_the_way: 'bg-orange-500 text-white',
  delivered:  'bg-green-500 text-white',
  cancelled:  'bg-red-500 text-white',
}


export default function OrdersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orders, isLoading, isError, order } = useSelector((state: RootState) => state.orders);
  const { restaurants } = useSelector((state: RootState) => state.restaurant);

  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    dispatch(getOrderByUserId());
    dispatch(getAllRestaurants());
  }, [dispatch, router]);

  
  const getRestaurant = (id: string) => restaurants?.find(r => r._id === id);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 pt-35 px-14 flex items-center justify-center text-gray-500">Loading orders...</div>;
  }

  if (isError) {
    return <div className="min-h-screen bg-gray-50 pt-35 px-14 flex items-center justify-center text-red-500">Failed to load orders.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-35 px-14 pb-12">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-400 text-sm">You have no orders yet.</p>
        ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const restaurant = typeof order?.restaurantId === 'string' &&  getRestaurant(order?.restaurantId);
            return (
            <div
            onClick={() => {
              router.push(`/orders/${order._id}`)
            }}
              key={order._id}
              className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm cursor-pointer transition-transform duration-700 hover:scale-[1.02]"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <Image
                   src={restaurant?.img ?? '/placeholder.jpg'}
                   alt={restaurant?.name ?? 'Restaurant'}
                   width={56}
                   height={56}
                   unoptimized
                   className="rounded-lg object-cover shrink-0"
                   />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{restaurant?.name ?? 'Unknown restaurant'}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{order.items.map(item => item.name).join(', ')}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{moment(order.createdAt).calendar()}</p>
                  </div>
                </div>

                {/* Status badge */}
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${STATUS_STYLES[order.status] ?? 'bg-gray-300 text-white'}`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                <Link
                  href={`/orders/confirmation/${order._id}`}
                  className="text-green-500 text-sm font-semibold flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                >
                  Track Order
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )})}
        </div>
        )}
      </div>
    </div>
  )
}
