'use client'
import Image from 'next/image';
import LoginForm from '../components/LoginForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, RootState } from '../hooks/hooks';

const Login: React.FC = () => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Rediriger uniquement si l'utilisateur est connecté avec succès
    if (isAuthenticated && user) {
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
  }, [user, isAuthenticated, router])

  // Afficher le loading pendant le chargement ET pendant la redirection
  if (isLoading || (isAuthenticated && user)) {
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

export default Login;