'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import RegisterForm from '../components/RegisterForm';

import { useRouter } from 'next/navigation';
import { useAppSelector, RootState, useAppDispatch } from '../hooks/hooks';

const Register:React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  // State to track the current user role for the background image
  const [currentRole, setCurrentRole] = useState('');

  useEffect(() => {
    // Rediriger uniquement si l'inscription est réussie
    if (user) {
      router.push('/login')
    }

    // Nettoyer le state quand le composant se démonte
    return () => {
      //dispatch(reset())
    }
  }, [user, router, dispatch, isAuthenticated]);

  const handleRoleChange = (role:string) => {
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