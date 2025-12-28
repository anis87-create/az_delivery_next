import { useState } from 'react';
import { useSelector } from 'react-redux';

const OrdersManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const {users} = useSelector(state => state.auth);
  // Mock orders data
  /*const [orders, setOrders] = useState([
    {
      id: 1,
      orderId: '#ORD-001',
      status: 'New',
      price: '45.50€',
      createdAt: '2024-10-21T10:30:00Z',
      customer: {
        fullName: 'Jean Dupont'
      },
      items: [
        { name: 'Pizza Margherita', quantity: 1 },
        { name: 'Coca Cola', quantity: 2 }
      ]
    },
    {
      id: 2,
      orderId: '#ORD-002',
      status: 'Preparing',
      price: '32.00€',
      createdAt: '2024-10-21T11:15:00Z',
      customer: {
        fullName: 'Marie Martin'
      },
      items: [
        { name: 'Burger Classic', quantity: 1 },
        { name: 'Fries', quantity: 1 }
      ]
    },
    {
      id: 3,
      orderId: '#ORD-003',
      status: 'Ready',
      price: '28.75€',
      createdAt: '2024-10-21T09:45:00Z',
      customer: {
        fullName: 'Pierre Durand'
      },
      items: [
        { name: 'Salade César', quantity: 1 },
        { name: 'Eau minérale', quantity: 1 }
      ]
    },
    {
      id: 4,
      orderId: '#ORD-004',
      status: 'Completed',
      price: '67.25€',
      createdAt: '2024-10-21T08:20:00Z',
      customer: {
        fullName: 'Sophie Bernard'
      },
      items: [
        { name: 'Pizza 4 Fromages', quantity: 2 },
        { name: 'Tiramisu', quantity: 2 }
      ]
    }
  ]);*/
  const { orders } = useSelector(state => state.order);

  const filterOptions = ['All', 'pending', 'confirmed', 'delivering', 'delivered', 'cancelled'];
  const statusOptions = ['pending', 'confirmed', 'delivering', 'delivered', 'cancelled'];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivering':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };
  const findCustomerNameById = (userId) => {
     return users.find(user => user.id === userId)?.fullName;
  }

  const handleStatusChange = (orderId, newStatus) => {
    /*setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));*/
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = findCustomerNameById(order.userId).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <button className="text-sm text-orange-600 hover:text-orange-800 font-medium">
          View All
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search orders"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Filter Dropdown */}
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
        >
          {filterOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-6">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-gray-900">{order.orderId}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <span className="text-lg font-bold text-gray-900">{order.price}</span>
            </div>

            {/* Time */}
            <div className="flex items-center mb-3 text-sm text-gray-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <time>{getTimeAgo(order.createdAt)}</time>
            </div>

            {/* Customer */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Customer</p>
              <p className="font-medium text-gray-900">{findCustomerNameById(order.userId)}</p>
            </div>

            {/* Items */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Items</p>
              <div className="space-y-1">
                {order.items.map((item, index) => (
                  <p key={index} className="text-sm text-gray-900">
                    {item.quantity}x {item.name}
                  </p>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button className="flex items-center text-sm text-orange-600 hover:text-orange-800 font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </button>
              
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="px-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No orders found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;