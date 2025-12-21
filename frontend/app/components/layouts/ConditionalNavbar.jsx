'use client'

import { usePathname } from 'next/navigation';
import Navbar from './Navbar/Navbar.jsx';
import { useSelector } from 'react-redux';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const { isLoading } = useSelector(state => state.auth);
  // Hide navbar on login, register and restaurantDashboard pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/restaurantDashboard' || isLoading === true) {
    return null;
  }
  
  return <Navbar />;
}