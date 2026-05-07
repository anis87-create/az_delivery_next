'use client'
import React from 'react'
import { useGetAuthenticatedUserQuery } from '../store/services/auth';

interface AuthInitProps {
  children: React.ReactNode;
}

const AuthInit: React.FC<AuthInitProps> = ({ children }) => {
  // On vérifie la présence du token côté client uniquement
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');

  // RTK Query déclenche automatiquement la requête et appelle setUser via onQueryStarted
  // Si pas de token, on skip pour éviter une requête inutile (et une 401)
  useGetAuthenticatedUserQuery(undefined, { skip: !hasToken });

  return <>{children}</>
}

export default AuthInit
