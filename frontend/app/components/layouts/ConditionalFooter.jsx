'use client'

import { usePathname } from 'next/navigation';
import Footer from './Footer/Footer.jsx';
import { useSelector } from 'react-redux';

export default function ConditionalFooter() {
  const pathname = usePathname();
  const { isLoading } = useSelector(state => state.auth);

  // Hide footer on login, register and restaurantDashboard pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/restaurantDashboard'  || isLoading === true) {
    return null;
  }

  return <Footer />;
}
