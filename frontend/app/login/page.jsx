'use client'
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '../components/LoginForm.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { reset, authMe } from '../store/slices/authSlice.js';

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isSuccess } = useSelector(state => state.auth);

  useEffect(() => {
    // Rediriger uniquement si l'utilisateur est connecté avec succès
    if (isSuccess && user) {
      if(user?.user?.role === 'customer'){
        router.push('/')
      } else if(user?.user?.role === 'restaurant_owner'){
        router.push('/restaurantDashboard')
      }
    }

    // Nettoyer le state quand le composant se démonte
    /*return () => {
      dispatch(reset())
    }*/
  }, [user, isSuccess, router, dispatch])
  return (
    <div className="h-screen bg-white overflow-hidden">
      <div className="h-full w-full flex">
        {/* Form Section */}
        <LoginForm />
        {/* Image Section */}
        <div className="w-1/2 bg-linear-to-br from-orange-400 to-orange-600 relative">
          <Image
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            alt="Food delivery"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default Login