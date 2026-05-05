'use client'
import React, { useEffect, Suspense } from 'react'
import { useAppDispatch } from '../hooks/hooks';
import { authMe } from '../store/slices/authSlice';
import { useSearchParams, useRouter } from 'next/navigation';

const Spinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-600 text-sm font-medium">Connexion en cours...</p>
    </div>
  </div>
);

const OAuthCallbackContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      dispatch(authMe()).then(() => router.push('/'));
    } else {
      router.push('/login');
    }
  }, [searchParams, dispatch, router]);

  return <Spinner />;
}

const OAuthCallbackPage: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    <OAuthCallbackContent />
  </Suspense>
);

export default OAuthCallbackPage;
