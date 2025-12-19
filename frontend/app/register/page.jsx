'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import RegisterForm from '../components/RegisterForm.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from 'app/hooks.js';
import { register, authMe, logout } from '@/app/store/slices/authSlice.js';
import { v4 as uuidv4 } from 'uuid';

const Register = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isSuccess } = useSelector(state => state.auth);

  // State to track the current user role for the background image
  const [currentRole, setCurrentRole] = useState('');

  useEffect(() => {
    // Rediriger uniquement si l'inscription est réussie
    if (isSuccess && user) {
      if (user?.user?.role === 'customer') {
        router.push('/');
      } else if (user?.user?.role === 'restaurant_owner' || user?.user?.role === 'restaurant') {
        router.push('/restaurantDashboard');
      }
    }

    // Nettoyer le state quand le composant se démonte
    return () => {
      //dispatch(reset())
    }
  }, [user, isSuccess, router, dispatch]);

  const handleRoleChange = (role) => {
    setCurrentRole(role);
  };


  return (
    <div className="min-h-screen bg-white">
      <div className="w-full flex min-h-screen">
        {/* Form Section */}
        <RegisterForm onRoleChange={handleRoleChange} />

        {/* Image Section - Changes based on selected role */}
        <div className="w-1/2 relative overflow-hidden">
          <Image
            src={
              currentRole === 'restaurant_owner'
                ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&auto=format&fit=crop&q=80'
            }
            alt={currentRole === 'restaurant_owner' ? 'Restaurant management' : 'Food delivery'}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 object-cover `}
            fill
          />
        </div>
      </div>
    </div>
  )
}

export default Register