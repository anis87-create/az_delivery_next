'use client'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useEffect } from 'react';
import { AppDispatch, useAppDispatch } from '../hooks/hooks';
import { getAllOrders } from '../store/slices/orderSlice';
import { getAllRestaurants } from '../store/slices/restaurantSlice';

const STATUS_STYLES: Record<string, string> = {
  preparing:  'bg-yellow-400 text-white',
  pending:    'bg-gray-400 text-white',
  confirmed:  'bg-blue-500 text-white',
  on_the_way: 'bg-orange-500 text-white',
  delivered:  'bg-green-500 text-white',
  cancelled:  'bg-red-500 text-white',
}

const STATIC_ORDERS = [
  {
    id: '1',
    restaurant: 'Burger Palace',
    image: null,
    items: 'Classic Cheeseburger, French Fries',
    date: 'Today, 12:30 PM',
    total: 12.98,
    status: 'preparing',
  },
  {
    id: '2',
    restaurant: 'Pizza Roma',
    image: null,
    items: 'Margherita, Tiramisu',
    date: 'Today, 11:00 AM',
    total: 24.50,
    status: 'delivered',
  },
  {
    id: '3',
    restaurant: 'Sushi House',
    image: null,
    items: 'California Roll x2, Miso Soup',
    date: 'Yesterday, 7:45 PM',
    total: 31.00,
    status: 'cancelled',
  },
]




export default function OrdersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch<AppDispatch>();
  const { orders } = useSelector((state:RootState) => state);
  const { restaurant:{restaurants} } = useSelector((state:RootState) => state);
  useEffect(() => {
    dispatch(getAllOrders());
    dispatch(getAllRestaurants());
  }, [dispatch]);
  const getRestaurantNameById = (id:string) => {
   const restaurant = restaurants.find(restaurant => restaurant._id === id);
   return restaurant.name;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-35 px-14 pb-12">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        <div className="space-y-3">
          {STATIC_ORDERS.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {/* Image placeholder */}
                  <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{order.restaurant}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{order.items}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{order.date}</p>
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
                <button
                  onClick={() => router.push(`/orders/confirmation/${order.id}`)}
                  className="text-green-500 text-sm font-semibold flex items-center gap-1 cursor-pointer hover:text-green-600 transition-colors"
                >
                  Track Order
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
