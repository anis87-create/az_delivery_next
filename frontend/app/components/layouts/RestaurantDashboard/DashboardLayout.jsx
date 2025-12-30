'use client'
import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import Dashboard from '../../RestaurantDashboard/Dashboard';
import MenuManagement from '../../RestaurantDashboard/MenuManagement';
import SettingsManagement from '../../RestaurantDashboard/SettingsManagement';
import { useSelector } from 'react-redux';

const DashboardLayout = ({ 
  restaurantName = "Mon Restaurant", 
  restaurantEmail = "restaurant@example.com",
  restaurantLogo = null 
}) => {
  const [currentSection, setCurrentSection] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading } = useSelector(state => state.auth);
  const restaurant = user?.restaurant;

  const renderCurrentSection = () => {
    switch(currentSection) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Menu Management':
        return <MenuManagement />;
      case 'Settings':
        return <SettingsManagement />;
      default:
        return <Dashboard />;
    }
  };
   if(isLoading){
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
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        restaurantName={restaurant?.name || restaurantName}
        restaurantLogo={restaurantLogo}
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 lg:ml-64">
        {/* Navbar */}
        <DashboardNavbar
          restaurantName={restaurant?.name || restaurantName}
          restaurantEmail={user?.email || restaurantEmail}
          restaurantLogo={restaurantLogo}
          currentSection={currentSection}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderCurrentSection()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;