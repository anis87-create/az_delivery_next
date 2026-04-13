'use client'
import { useAppDispatch, useAppSelector } from '@/app/hooks/hooks';
import { deleteOrder, getAllOrders, updateOrder } from '@/app/store/slices/orderSlice';
import {  OrderStatus } from '@/app/types/order.types';
import { useEffect, useState } from 'react';
import { HiSearch, HiEye } from 'react-icons/hi';
import { FiUser, FiClock } from 'react-icons/fi';
import moment from 'moment';
import { Order } from '@/app/types/order.types';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector(state => state.orders);

  const users: {id: string; fullName: string}[] = [];

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusOptions = [
    { value: 'pending', label: 'pending', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { value: 'confirmed', label: 'confirmed', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    { value: 'preparing', label: 'preparing', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
    { value: 'on_the_way', label: 'on the way', bgColor: 'bg-purple-100', textColor: 'text-purple-800' },
    { value: 'delivered', label: 'delivered', bgColor: 'bg-green-100', textColor: 'text-green-800' },
    { value: 'cancelled', label: 'cancelled', bgColor: 'bg-red-100', textColor: 'text-red-800' }
  ];

  const getStatusDisplay = (status: string) => {
    const statusConfig = statusOptions.find(option => option.value === status);
    return statusConfig || { label: status, bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
  };



  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await dispatch(updateOrder({id: orderId, status: newStatus}))
  };



  const findCustomerNameById = (userId: string | { fullName: string; [key: string]: any }) => {
    if(!userId) return null;
    if (typeof userId === 'object') return userId.fullName;
    return users.find(user => user.id === userId)?.fullName || 'Unknown';
  };

  const getTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => {
    if(!order.userId) return null;
    const customerName = typeof order.userId === 'object' && order.userId.fullName || '';
    const orderId = order._id.toString().toLowerCase();
    const status = order?.status?.toLowerCase();
    const query = searchQuery.toLowerCase();

    return customerName.includes(query) ||
           orderId.includes(query) ||
           status.includes(query);
  });

  useEffect(() => {
   dispatch(getAllOrders())
  }, [dispatch]);


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your restaurant and track your performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)} TND
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Pending Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {orders.filter(order => order.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Average Rating</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">4.8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent Orders</h3>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Mobile view - Cards */}
        <div className="md:hidden">
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order, index) => {
              return (
                <div key={order._id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">ORDER#{order._id}</p>
                      <p className="text-xs text-gray-500">{findCustomerNameById(order.userId)}</p>
                    </div>
                    <div className="flex space-x-2 cursor-pointer">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded hover:cursor-pointer"
                        title="View Details"
                      >
                        <HiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="text-sm font-medium text-gray-900">{order.total.toFixed(2)} TND</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="text-sm text-gray-600">{getTime(order.createdAt)}</p>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop view - Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order, index) => {
                const statusDisplay = getStatusDisplay(order.status);
                return (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ORDER-{index+1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {findCustomerNameById(order.userId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          updateStatus(order._id, e.target.value as OrderStatus)
                        }
                        }
                        className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${statusDisplay.bgColor} ${statusDisplay.textColor} focus:ring-2 focus:ring-orange-500 focus:outline-none`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.total.toFixed(2)} TND
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getTime(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded cursor-pointer"
                          title="View Details"
                        >
                          <HiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(true);
                          }
                            
                          }
                          className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

            {/* Header */}
            <div className="flex items-start justify-between mb-1">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Order ORD-{filteredOrders.findIndex(o => o._id === selectedOrder._id) + 1}
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">Order details and customer information</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusDisplay(selectedOrder.status).bgColor} ${getStatusDisplay(selectedOrder.status).textColor}`}>
                  {selectedOrder.status}
                </span>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
              </div>
            </div>

            {/* Customer & Time */}
            <div className="border border-gray-200 rounded-xl p-4 mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <FiUser className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Customer</p>
                  <p className="text-sm font-bold text-gray-900">{findCustomerNameById(selectedOrder.userId)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiClock className="w-5 h-5 text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Order Time</p>
                  <p className="text-sm font-bold text-gray-900">{moment(selectedOrder.createdAt).fromNow()}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border border-gray-200 rounded-xl p-4 mt-3">
              <p className="text-sm font-bold text-gray-900 mb-2">Items ({selectedOrder.items.length})</p>
              <div className="space-y-1">
                {selectedOrder.items.map((item) => (
                  <p key={item.itemId} className="text-sm text-gray-400">{item.quantity}x {item.name}</p>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-green-500 text-lg">${selectedOrder.total.toFixed(2)}</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full">
            <div className="flex items-start sm:items-center mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Confirm Deletion</h3>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>

            <div className="flex flex-col-reverse sm:flex-row space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
