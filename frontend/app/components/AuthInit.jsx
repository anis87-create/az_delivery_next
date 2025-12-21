'use client'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { authMe } from '../store/slices/authSlice';

const AuthInit = ({ children }) => {
  const dispatch = useDispatch();

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      dispatch(authMe()).unwrap()
        .catch((error) => {
          // Token invalid or expired, remove it
          localStorage.removeItem('token');
        });
    }
  }, [dispatch])

  return <>{children}</>
}

export default AuthInit
