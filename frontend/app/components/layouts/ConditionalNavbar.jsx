'use client'

import { usePathname } from 'next/navigation';
import Navbar from './Navbar.jsx';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on login and register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }
  
  return <Navbar />;
}