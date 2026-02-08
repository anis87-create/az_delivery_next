import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { FiUpload } from 'react-icons/fi';
import { updateRestaurantInfo } from '../../store/slices/restaurantSlice';
import { authMe } from '../../store/slices/authSlice';
import { RootState, AppDispatch } from '@/app/store/store';
import { BaseRestaurantInfo, ImageProps, Restaurant } from '@/app/types/restaurant.types';

interface PreviewImageProps {
  src: string,
  alt: string,
  className: string
}
// Composant pour afficher l'image (Next.js Image ou img standard)
// Déclaré en dehors du composant pour éviter les re-créations
const PreviewImage = ({ src, alt, className }: PreviewImageProps) => {
  // Next.js <Image> ne supporte pas les Data URLs (base64 avec blob:)
  // On utilise <img> standard pour les URLs blob
  if (src && (src.startsWith('data:') || src.startsWith('blob:'))) {
    return (
      <img
        src={src}
        alt={alt}
        width={100}
        height={100}
        className={className}
      />
    );
  }

  // Pour les URLs http/https, utiliser Next.js Image pour l'optimisation
  return (
    <img
      src={src}
      alt={alt}
      width={400}
      height={192}
      className={className}
    />
  );
};

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('General');
  const {user} = useSelector((state:RootState) => state.auth);
  const {isLoading, message, isError} = useSelector((state:RootState) => state.restaurant);
  
  const [selectedFiles, setSelectedFiles] = useState<{ img: File | null; coverImg: File | null }>({
    img: null,
    coverImg: null
  });

  // State pour les URLs de prévisualisation (blob URLs pour les nouveaux fichiers)
  const [previewUrls, setPreviewUrls] = useState<ImageProps>({
    img: null,
    coverImg: null
  });
   const [restaurantData, setRestaurantData] = useState<BaseRestaurantInfo|null>({
    name: user?.restaurant?.name || 'Mon Restaurant',
    email: user?.restaurant?.email || 'restaurant@example.com',
    coverImg: user?.restaurant?.coverImg  || null,
    img: user?.restaurant?.img  || null,
    phone: user?.restaurant?.phone || '',
    street: user?.restaurant?.street || '',
    city: user?.restaurant?.city || '',
    zipCode: user?.restaurant?.zipCode || '',
    description: user?.restaurant?.description || '',
    category: user?.restaurant?.category || '',
    type: user?.restaurant?.type || '',
    deliveryZone: user?.restaurant?.deliveryZone || '',
    openingHours: user?.restaurant?.openingHours || {
      monday: { open: '11:00', close: '22:00', closed: false },
      tuesday: { open: '11:00', close: '22:00', closed: false },
      wednesday: { open: '11:00', close: '22:00', closed: false },
      thursday: { open: '11:00', close: '22:00,', closed: false },
      friday: { open: '11:00', close: '23:00', closed: false },
      saturday: { open: '11:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '21:00', closed: false }
    },
    baseFee: user?.restaurant?.baseFee,
    estimatedDeliveryTime: user?.restaurant?.estimatedDeliveryTime || ''
   /* deliverySettings: {
      baseFee: Number(user?.restaurant?.deliverySettings?.baseFee) || 3,
      estimatedDeliveryTime: user?.restaurant?.deliverySettings?.estimatedDeliveryTime || ''
    },*/
  });

  // Refs pour les inputs file
  const imgInputRef = useRef(null);
  const coverImgInputRef = useRef(null);

  // Fonction helper pour obtenir l'URL de prévisualisation
  const getPreviewUrl = (type:string) => {
    // 1. Priorité : nouvelle image sélectionnée (blob URL)
    if (previewUrls[type]) {
      return previewUrls[type];
    }

    // 2. Sinon : image depuis la base de données
    const dbImage = user?.restaurant?.[type];
    if (dbImage && typeof dbImage === 'string') {
      // Vérifier si l'URL commence déjà par http (URL complète)
      if (dbImage.startsWith('http://') || dbImage.startsWith('https://')) {
        return dbImage;
      }
      // Sinon, construire l'URL complète
      return `http://localhost:5000/images/${dbImage}`;
    }
  };

  const dispatch = useDispatch<AppDispatch>();

  // Nettoyer les URLs blob quand le composant est démonté ou que les URLs changent
  useEffect(() => {
    return () => {
      // Libérer la mémoire des blob URLs
      if (previewUrls.img && previewUrls.img.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls.img);
      }
      if (previewUrls.coverImg && previewUrls.coverImg.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls.coverImg);
      }
    };
  }, [previewUrls]);

  // Charger les données du restaurant depuis Redux quand l'utilisateur est disponible
  useEffect(() => {
    if (user?.restaurant) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRestaurantData({
        name: user.restaurant.name || 'Mon Restaurant',
        email: user.restaurant.email || 'restaurant@example.com',
        coverImg: user.restaurant.coverImg || null,
        phone: user.restaurant.phone || '',
        street: user.restaurant.street || '',
        city: user.restaurant.city || '',
        zipCode: user.restaurant.zipCode || '',
        description: user.restaurant.description || '',
        category: user.restaurant.category || '',
        type: user.restaurant.type || '',
        deliveryZone: user.restaurant.deliveryZone || '',
        openingHours: user.restaurant.openingHours || {
          monday: { open: '11:00', close: '22:00', closed: false },
          tuesday: { open: '11:00', close: '22:00', closed: false },
          wednesday: { open: '11:00', close: '22:00', closed: false },
          thursday: { open: '11:00', close: '22:00,', closed: false },
          friday: { open: '11:00', close: '23:00', closed: false },
          saturday: { open: '11:00', close: '23:00', closed: false },
          sunday: { open: '12:00', close: '21:00', closed: false }
        },
        baseFee: user?.restaurant?.baseFee,
        estimatedDeliveryTime: user?.restaurant?.estimatedDeliveryTime || '',
        img: user?.restaurant?.img
      });
    }
  }, [user]); 
  
  
 

  

  const handleInputChange = (field, value) => {
    setRestaurantData(prev => ({
      ...prev,
      [field]: value
    }));    
  };

  const handleOpeningHoursChange = (day:string, field:string, value: string|boolean) => {
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



  const handleSaveChanges = async () => {
    const form = new FormData();
    // Débogage : voir ce qu'on va envoyer

    // Ajouter les données de base
  form.append('name', restaurantData.name);
  form.append('email', restaurantData.email);
  form.append('phone', restaurantData.phone);
  form.append('description', restaurantData.description);
  form.append('street', restaurantData.street);
  form.append('city', restaurantData.city);
  form.append('zipCode', restaurantData.zipCode);
  form.append('openingHours', JSON.stringify(restaurantData.openingHours));
  form.append('baseFee',restaurantData.baseFee);
  form.append('estimatedDeliveryTime', restaurantData.estimatedDeliveryTime);

    // N'ajouter les images que si elles ont été modifiées
    if (selectedFiles.img) {
    form.append('img', selectedFiles.img);
    }

    if (selectedFiles.coverImg) {
    form.append('coverImg', selectedFiles.coverImg);
    }



    try {
      // Sauvegarder les modifications
      await dispatch(updateRestaurantInfo({id:user?.restaurant?._id, form})).unwrap();
      // Réinitialiser les fichiers sélectionnés
     

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
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
              onClick={() => {setActiveTab(tab)}
            }
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
           {isError && <div className="bg-red-100 p-2 font-weight mb-4">{message}</div>}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input
                type="text"
                value={restaurantData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                placeholder="123 Main Street"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={restaurantData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Tunis"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  value={restaurantData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image File */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>

                  {/* Prévisualisation de l'image */}
                  {(previewUrls.img || user?.restaurant?.img) && (
                    <div className="mb-3">
                      <PreviewImage
                        src={getPreviewUrl('img')}
                        alt="Restaurant preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}

                  {/* Input file caché */}
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Créer une URL blob pour la prévisualisation
                        const blobUrl = URL.createObjectURL(file);

                        setPreviewUrls(prev => ({
                          ...prev,
                          img: blobUrl
                        }));

                        setSelectedFiles(prev => ({
                          ...prev,
                          img: file
                        }));

                        handleInputChange('img', file);
                      }
                    }}
                    className="hidden"
                  />

                  {/* Bouton Upload personnalisé */}
                  <button
                    type="button"
                    onClick={() => imgInputRef.current?.click()}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-orange-600"
                  >
                    <FiUpload className="text-xl" />
                    <span className="font-medium">Upload</span>
                  </button>
                </div>

                {/* Cover Image File */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>

                  {/* Prévisualisation de l'image de couverture */}
                  {(previewUrls.coverImg || user?.restaurant?.coverImg) && (
                    <div className="mb-3">
                      <PreviewImage
                        src={getPreviewUrl('coverImg')}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}

                  {/* Input file caché */}
                  <input
                    ref={coverImgInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Créer une URL blob pour la prévisualisation
                        const blobUrl = URL.createObjectURL(file);

                        setPreviewUrls(prev => ({
                          ...prev,
                          coverImg: blobUrl
                        }));

                        setSelectedFiles(prev => ({
                          ...prev,
                          coverImg: file
                        }));

                        handleInputChange('coverImg', file);
                      }
                    }}
                    className="hidden"
                  />

                  {/* Bouton Upload personnalisé */}
                  <button
                    type="button"
                    onClick={() => coverImgInputRef.current?.click()}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-orange-600"
                  >
                    <FiUpload className="text-xl" />
                    <span className="font-medium">Upload</span>
                  </button>
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
                    checked={!restaurantData?.openingHours[day.key]?.closed}
                    onChange={(e) => handleOpeningHoursChange(day.key, 'closed', !e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-600">Open</span>
                </div>
                
                {!restaurantData?.openingHours[day.key]?.closed && (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">From:</span>
                      <input
                        type="time"
                        value={restaurantData?.openingHours[day.key]?.open}
                        onChange={(e) => handleOpeningHoursChange(day.key, 'open', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">To:</span>
                      <input
                        type="time"
                        value={restaurantData?.openingHours[day.key]?.close}
                        onChange={(e) => handleOpeningHoursChange(day.key, 'close', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </>
                )}
                
                {restaurantData?.openingHours[day.key]?.closed && (
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
                value={restaurantData.baseFee}
                onChange={(e) => handleInputChange('baseFee', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temps de livraison estimé</label>
              <input
                type="text"
                placeholder="ex: 30-45 minutes"
                value={restaurantData?.estimatedDeliveryTime}
                onChange={(e) => handleInputChange('estimatedDeliveryTime', e.target.value)}
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