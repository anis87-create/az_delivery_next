'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/hooks/hooks'
import { getOneOrder } from '@/app/store/slices/orderSlice'

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { order, isLoading } = useSelector((state: RootState) => state.orders)

  useEffect(() => {
    if (id) dispatch(getOneOrder(id))
  }, [id, dispatch])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-green-500 border-t-transparent" />
      </div>
    )
  }

  if (!order) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">

      {/* Checkmark */}
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
      <p className="text-gray-500 text-center max-w-sm mb-10">
        Your order has been placed successfully. We've sent a confirmation to your email.
      </p>

      {/* Card */}
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <span className="font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</span>
          <span className="text-gray-400 text-sm">Just now</span>
        </div>

        <div className="flex items-center justify-between py-4 border-t border-gray-100">
          <span className="text-gray-400 text-sm">Estimated Delivery</span>
          <span className="font-bold text-gray-900">25-35 min</span>
        </div>

        <div className="flex items-start justify-between py-4 border-t border-gray-100">
          <span className="text-gray-400 text-sm">Delivery Address</span>
          <div className="text-right text-gray-900 text-sm font-medium">
            <p>{order.deliveryAddress.street}</p>
            <p>{order.deliveryAddress.city}, {order.deliveryAddress.zipCode}</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-lg grid grid-cols-2 gap-3">
        <button
          onClick={() => router.push('/orders')}
          className="py-4 rounded-2xl border border-gray-300 bg-white text-gray-900 font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Track Order
        </button>
        <button
          onClick={() => router.push('/cart')}
          className="py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Order More
        </button>
      </div>

    </div>
  )
}
