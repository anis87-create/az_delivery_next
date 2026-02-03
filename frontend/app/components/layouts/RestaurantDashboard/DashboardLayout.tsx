'use client'
import { useEffect, useState, useRef } from 'react';
import Sidebar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import Dashboard from '../../RestaurantDashboard/Dashboard';
import MenuManagement from '../../RestaurantDashboard/MenuManagement';
import SettingsManagement from '../../RestaurantDashboard/SettingsManagement';
import { useDispatch, useSelector } from 'react-redux';
import { authMe } from '../../../store/slices/authSlice';
import { RootState, AppDispatch } from '@/app/store/store';
interface DashboardLayoutProps {
  restaurantName?: string,
  restaurantEmail?: string,
  restaurantLogo?: string | null
}
const DashboardLayout = ({
  restaurantName = "Mon Restaurant",
  restaurantEmail = "restaurant@example.com",
  restaurantLogo = null
}: DashboardLayoutProps) => {
  const [currentSection, setCurrentSection] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChangingTab, setIsChangingTab] = useState(false);
  const isFirstMount = useRef(true);
  const previousSection = useRef('Dashboard'); // Track la section précédente
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state:RootState) => state.auth);
  const restaurant = user?.restaurant;

  // Effet pour appeler authMe lors du changement de tab SEULEMENT
  useEffect(() => {
    // Skip au premier montage (rafraîchissement ou première visite)
    if (isFirstMount.current) {
      isFirstMount.current = false;
      previousSection.current = currentSection; // Sauvegarder la section initiale
      return;
    }

    // Vérifier si la section a VRAIMENT changé
    if (previousSection.current === currentSection) {
      return; // Pas de changement, ne rien faire
    }

    // Sauvegarder la nouvelle section
    previousSection.current = currentSection;

    // Ne charger que si on a déjà un user (évite le chargement au refresh)
    if (!user) {
      return;
    }

    // Ne pas charger si Redux est encore en train de charger les données initiales
    if (isLoading) {
      return;
    }

    // Fonction async pour gérer le chargement
    const loadData = async () => {
      setIsChangingTab(true);
      try {
        await dispatch(authMe()).unwrap();
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsChangingTab(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection]);

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

  // Loading plein écran SEULEMENT si pas encore de données user (chargement initial ou refresh)
  if(!user && isLoading){
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
        isClose={!sidebarOpen}
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
          {isChangingTab ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mb-4"></div>
                <p className="text-lg font-medium text-gray-600">Loading...</p>
              </div>
            </div>
          ) : (
            renderCurrentSection()
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;