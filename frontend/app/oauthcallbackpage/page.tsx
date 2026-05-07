'use client'
import React, { useEffect, Suspense } from 'react'
import { useGetAuthenticatedUserQuery } from '../store/services/auth';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppSelector, RootState } from '../hooks/hooks';

const Spinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-600 text-sm font-medium">Connexion en cours...</p>
    </div>
  </div>
);

const OAuthCallbackContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  // On stocke d'abord le token si présent
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      router.push('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Le hook skip tant qu'il n'y a pas de token stocké
  // Une fois le token sauvegardé dans le useEffect ci-dessus,
  // on recharge avec la présence du token en localStorage
  const hasToken = !!token;
  const { isSuccess, isError } = useGetAuthenticatedUserQuery(undefined, {
    skip: !hasToken,
  });

  useEffect(() => {
    if (isSuccess) {
      router.push('/');
    }
    if (isError) {
      router.push('/login');
    }
  }, [isSuccess, isError, router]);

  return <Spinner />;
}

const OAuthCallbackPage: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    <OAuthCallbackContent />
  </Suspense>
);

export default OAuthCallbackPage;
