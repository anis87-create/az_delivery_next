'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { logout } from '../store/slices/authSlice'

const RestaurantDashboard = () => {
  const router = useRouter();
  const { user } = useSelector(state => state.auth);
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    //dispatch(logout());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check if user exists in localStorage
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      // No user/token found, redirect to login
      router.push('/login');
      return;
    }

    // Only restaurant owners can access this page
    if (user && user.role !== 'restaurant_owner') {
      // Customers and other users cannot access restaurant dashboard, redirect to home
      router.push('/');
    }

  }, [router, isMounted, user]);

  // Don't render content until mounted and user is verified
  if (!isMounted || !user || user.role !== 'restaurant_owner') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Restaurant Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="mb-2"><strong>Owner:</strong> {user.fullName}</p>
        <p className="mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="mb-2"><strong>Restaurant:</strong> {user.restaurant?.name}</p>
      </div>
    </div>
  )
}

export default RestaurantDashboard
