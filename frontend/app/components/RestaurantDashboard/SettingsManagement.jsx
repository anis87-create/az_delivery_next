import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRestaurantsByOwner, updateRestaurant } from '../../store/slices/restaurantSlice';
import { authMe } from '../../store/slices/authSlice';



const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('General');
  const {currentUser, user} = useSelector(state => state.auth);
 
const [selectedFiles, setSelectedFiles] = useState({
    logo: user?.restaurant?.logo || null,
    coverImg: user?.restaurant?.coverImg || null
  });
   const [restaurantData, setRestaurantData] = useState({
    name: user?.restaurant?.name || 'Mon Restaurant',
    email: user?.restaurant?.email || 'restaurant@example.com',
    coverImg: user?.restaurant?.coverImg  || null,
    phone: user?.restaurant?.phone || '',
    address: user?.restaurant ? `${user?.restaurant.street || ''} ${user?.restaurant.zipCode || ''},${user?.restaurant.city || ''}` : '',
    description: user?.restaurant?.description || '',
    openingHours: user?.restaurant?.openingHours || {
      monday: { open: '11:00', close: '22:00', closed: false },
      tuesday: { open: '11:00', close: '22:00', closed: false },
      wednesday: { open: '11:00', close: '22:00', closed: false },
      thursday: { open: '11:00', close: '22:00', closed: false },
      friday: { open: '11:00', close: '23:00', closed: false },
      saturday: { open: '11:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '21:00', closed: false }
    },
    deliverySettings: {
      baseFee: user?.restaurant?.deliverySettings?.baseFee || 3,
      estimatedDeliveryTime: user?.restaurant?.deliverySettings?.estimatedDeliveryTime || ''
    },
  });
  const dispatch = useDispatch();
    useEffect(() => {
    if (user?.restaurant) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRestaurantData({
        name: user.restaurant.name || 'Mon Restaurant',
        email: user.restaurant.email || 'restaurant@example.com',
        coverImg: user.restaurant.coverImg || null,
        phone: user.restaurant.phone || '',
        address: `${user.restaurant.street || ''} ${user.restaurant.zipCode || ''}, ${user.restaurant.city || ''}`,
        description: user.restaurant.description || '',
        openingHours: user.restaurant.openingHours || {
          monday: { open: '11:00', close: '22:00', closed: false },
          // ... autres jours
        },
        deliverySettings: {
          baseFee: user.restaurant.deliverySettings?.baseFee || 3,
          estimatedDeliveryTime: user.restaurant.deliverySettings?.estimatedDeliveryTime || ''
        }
      });

      setSelectedFiles({
        logo: user.restaurant.logo || null,
        coverImg: user.restaurant.coverImg || null
      });
    }
  }, [user]); 
  
  
 

  

  const handleInputChange = (field, value) => {
    setRestaurantData(prev => ({
      ...prev,
      [field]: value
    }));    
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setRestaurantData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleDeliverySettingsChange = (field, value) => {
    setRestaurantData(prev => ({
      ...prev,
      deliverySettings: {
        ...prev.deliverySettings,
        [field]: value
      }
    }));
    
  };



  const handleSaveChanges = () => {
    // Ici on ajouterait la logique de sauvegarde 
   const obj = {
    ...restaurant,
    openingHours: restaurantData.openingHours,
    deliverySettings: restaurantData.deliverySettings,
    coverImg: restaurantData.coverImg,
    logo: restaurantData.logo
   }
   dispatch(updateRestaurant(obj));
  };

  const tabs = ['General', 'Hours', 'Delivery'];

  const days = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Restaurant Settings</h2>
        <button 
          onClick={handleSaveChanges}
          className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'General' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">General Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
              <input
                type="text"
                value={restaurantData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={restaurantData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={restaurantData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={restaurantData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={restaurantData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Restaurant Images Section */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-md font-medium text-gray-900 mb-4">Restaurant Images</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <input
                    type="text"
                    value={selectedFiles.logo || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange('logo', value);
                      setSelectedFiles(prev => ({
                        ...prev,
                        logo: value
                      }));
                    }}
                    placeholder="Entrez l'URL de votre logo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Entrez l'URL complète de votre logo</p>
                </div>

                {/* Cover Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                  <input
                    type="text"
                    value={selectedFiles.coverImg || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange('coverImg', value);
                      setSelectedFiles(prev => ({
                        ...prev,
                        coverImg: value
                      }));
                    }}
                    placeholder="Entrez l'URL de votre image de couverture"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Entrez l'URL complète de votre image de couverture</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Hours' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Opening Hours</h3>
          
          <div className="space-y-3">
            {days.map(day => (
              <div key={day.key} className="flex items-center space-x-4">
                <div className="w-20">
                  <span className="text-sm font-medium text-gray-700">{day.label}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!restaurantData.openingHours[day.key].closed}
                    onChange={(e) => handleOpeningHoursChange(day.key, 'closed', !e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-600">Open</span>
                </div>
                
                {!restaurantData.openingHours[day.key].closed && (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">From:</span>
                      <input
                        type="time"
                        value={restaurantData.openingHours[day.key].open}
                        onChange={(e) => handleOpeningHoursChange(day.key, 'open', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">To:</span>
                      <input
                        type="time"
                        value={restaurantData.openingHours[day.key].close}
                        onChange={(e) => handleOpeningHoursChange(day.key, 'close', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </>
                )}
                
                {restaurantData.openingHours[day.key].closed && (
                  <span className="text-sm text-gray-500 italic">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Delivery' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frais de livraison (TND)</label>
              <input
                type="number"
                step="0.5"
                value={restaurantData.deliverySettings.baseFee}
                onChange={(e) => handleDeliverySettingsChange('baseFee', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temps de livraison estimé</label>
              <input
                type="text"
                placeholder="ex: 30-45 minutes"
                value={restaurantData.deliverySettings.estimatedDeliveryTime}
                onChange={(e) => handleDeliverySettingsChange('estimatedDeliveryTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsManagement;