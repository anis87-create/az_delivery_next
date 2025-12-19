'use client'

import { usePathname } from 'next/navigation';
import Footer from './Footer/Footer.jsx';

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on login, register and restaurantDashboard pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/restaurantDashboard') {
    return null;
  }

  return <Footer />;
}
