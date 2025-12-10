'use client';
import Image from 'next/image';
import React, { useState } from 'react'
import RegisterForm from '../components/RegisterForm.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector, useAppDispatch } from 'app/hooks.js';
import { register } from '@/store/slices/authSlice.js';
import { v4 as uuidv4 } from 'uuid';
const Register = () => {
  // State to track the current user role for the background image
  const [currentRole, setCurrentRole] = useState('');

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