'use client'

import Image from "next/image";
interface SidebarProps {
  restaurantName: string,
  restaurantLogo: string,
  currentSection: string,
  onSectionChange: (section: string) => void,
  onClose?: () => void,
  isOpen: boolean,
  isClose: boolean 
}
const Sidebar = ({ restaurantName, restaurantLogo, currentSection, onSectionChange, isOpen, onClose }: SidebarProps) => {
  
  const menuItems = [
    {
      name: 'Dashboard',
      icon: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      href: '#'
    },
    {
      name: 'Menu Management',
      icon: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: '#'
    },
    {
      name: 'Settings',
      icon: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: '#'
    }
  ];

  
  const handleMenuClick = (itemName: string) => {
    onSectionChange(itemName);
    if (onClose) onClose();
  };

  return (
    <div className={`bg-white shadow-lg h-full w-64 fixed left-0 top-0 border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              {restaurantLogo ? (
                <Image
                  src={restaurantLogo} 
                  alt={restaurantName}
                  className="w-8 h-8 rounded object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {restaurantName?.charAt(0) || 'R'}
                </span>
              )}
            </div>
            <div className="hidden sm:block">
              <h2 className="text-lg font-bold text-gray-900">{restaurantName || 'Restaurant'}</h2>
              <p className="text-sm text-gray-500">Restaurant Dashboard</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Menu Items */}
      <nav className="mt-6">
        <div className="px-3">
          {menuItems?.map((item) => {
            const isActive = currentSection === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.name)}
                className={`flex items-center px-3 py-3 w-full rounded-lg transition-colors duration-200 group ${
                  isActive 
                    ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
                }`}
              >
                <div className={`mr-3 ${isActive ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`}>
                  <item.icon />
                </div>
                <span className="font-medium text-left">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;