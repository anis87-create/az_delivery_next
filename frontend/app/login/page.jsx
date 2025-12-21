'use client'
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '../components/LoginForm.jsx';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const { user, isSuccess, isLoading } = useSelector(state => state.auth);

  useEffect(() => {
    // Rediriger uniquement si l'utilisateur est connecté avec succès
    if (isSuccess && user) {
      if(user.role === 'customer'){
        router.push('/')
      } else if(user.role === 'restaurant_owner'){
        router.push('/restaurantDashboard')
      }
    }

    // Nettoyer le state quand le composant se démonte
    /*return () => {
      dispatch(reset())
    }*/
  }, [user, isSuccess, router])

  // Afficher le loading pendant le chargement ET pendant la redirection
  if (isLoading || (isSuccess && user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

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