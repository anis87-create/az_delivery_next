'use client'
import React, { useEffect } from 'react'
import { useAppDispatch } from '../hooks'
import { authMe } from '../store/slices/authSlice';

interface AuthInitProps {
  children: React.ReactNode;
}

const AuthInit: React.FC<AuthInitProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      dispatch(authMe()).unwrap()
        .catch(() => {
          // Token invalid or expired, remove it
          localStorage.removeItem('token');
        });
    }
  }, [dispatch])

  return <>{children}</>
}

export default AuthInit
