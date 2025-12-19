'use client'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { authMe, logout } from '../store/slices/authSlice'

const RestaurantDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector(state => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      // No user/token found, redirect to login
      router.push('/login');
      return;
    }

    // Validate token with backend
    dispatch(authMe()).unwrap()
      .then((userData) => {
        // Only restaurant owners can access this page
        if (userData.role !== 'restaurant_owner') {
          // Customers and other users cannot access restaurant dashboard, redirect to home
          router.push('/');
        }
      })
      .catch((error) => {
        // Token invalid or expired, redirect to login
        localStorage.removeItem('user');
        router.push('/login');
      });
  }, [dispatch, router, isMounted]);

  // Don't render content until mounted and user is verified
  if (!isMounted || !user || user.role !== 'restaurant_owner') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-500">Loading...</div>
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
