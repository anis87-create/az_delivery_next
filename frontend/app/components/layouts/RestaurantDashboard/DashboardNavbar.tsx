'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { addCategory } from '../../../store/slices/categoriesSlice';
//import { addItem } from '../../../store/slices/itemsSlice';
import { logout } from '../../../store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createCateogry, getAllCategories } from '@/app/store/slices/categorySlice';
import { createItem , updateItem, deleteItem, getAllItems} from '../../../store/slices/itemSlice';
import Swal from 'sweetalert2';
import { AppDispatch, RootState } from '@/app/store/store';
import { ItemProps } from '@/app/types/item.types';

interface DashboardNavbarProps {
  restaurantName?: string,
  restaurantEmail?: string,
  restaurantLogo?: string,
  currentSection?:string,
  onMenuClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
}
const DashboardNavbar = ({ restaurantName, restaurantEmail, restaurantLogo, currentSection = 'Dashboard', onMenuClick}:DashboardNavbarProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const { categories } = useSelector((state:RootState) => state.categories);
  
  // Add Menu Item states
  const [showAddMenuItemModal, setShowAddMenuItemModal] = useState<Boolean>(false);
  const [menuItem, setMenuItem] = useState<ItemProps>({
    categoryId: '',
    name: '',
    ingredients: [],
    price: 0,
    imageUrl: '',
    isAvailable: true,
    isPopular: false
  });
  const [currentIngredient, setCurrentIngredient] = useState('');
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
    setShowDropdown(false);
  };

  const handleAddCategory =  async () => {    
    if (categoryName.trim()) {
      try {
        await  dispatch(createCateogry({ name: categoryName })).unwrap();
        setCategoryName('');
        setShowAddCategoryModal(false);
        // Notification de succès
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Catégorie ajoutée avec succès!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      } catch (error) {
        // Notification d'erreur
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erreur lors de l\'ajout de la catégorie',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      }
    }
  };

  const handleCancel = () => {
    setCategoryName('');
    setShowAddCategoryModal(false);
  };

  const handleAddMenuItem = async () => {
    try {
      setShowAddMenuItemModal(false);
      setMenuItem({
        categoryId: '',
        name: '',
        ingredients: [],
        price: 0,
        imageUrl: '',
        isAvailable: false,
        isPopular: false
      });
      await dispatch(createItem(menuItem)).unwrap();
      Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Item ajouté avec succès!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddIngredient = () => {
    if (currentIngredient.trim() && !menuItem.ingredients.includes(currentIngredient.trim())) {
      setMenuItem(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, currentIngredient.trim()]
      }));
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredientToRemove:string) => {
    setMenuItem(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing !== ingredientToRemove)
    }));
  };

  const handleCancelMenuItem = () => {
    setMenuItem({
      categoryId: '',
      name: '',
      ingredients: [],
      price:  0,
      imageUrl: '',
      isAvailable: false,
      isPopular: false
    });
    setCurrentIngredient('');
    setShowAddMenuItemModal(false);
  };

  const handleMenuItemChange = (field:string, value:string | number | boolean) => {
    setMenuItem(prev => ({
      ...prev,
      [field]: value
    }));

  };
  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllItems());
  }, [dispatch]);

  const getSectionTitle = () => {
    switch(currentSection) {
      case 'Menu Management':
        return 'Menu Management';
      case 'Orders':
        return 'Order Management';
      case 'Settings':
        return 'Settings';
      default:
        return 'Restaurant Dashboard';
    }
  };

  const renderSectionButtons = () => {
    if (currentSection === 'Menu Management') {
      return (
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={() => setShowAddCategoryModal(true)}
            className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <span className="hidden sm:inline">Add Category</span>
            <span className="sm:hidden">Category</span>
          </button>
          <button 
            onClick={() => setShowAddMenuItemModal(true)}
            className="flex items-center px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add New Item</span>
            <span className="sm:hidden">Add Item</span>
          </button>
        </div>
      );
    }
    
    if (currentSection === 'Orders') {
      return (
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button className="flex items-center px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <button className="flex items-center px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 min-w-0">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h3V7z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11h-4m0 4h4m-4 4h4" />
            </svg>
            Calendar
          </button>
        </div>
      );
    }
    
    return null;
  };  
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and Title */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Title */}
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{getSectionTitle()}</h1>
        </div>

        {/* Middle - Section specific buttons */}
        <div className="hidden sm:block">
          {renderSectionButtons()}
        </div>

        {/* Right side - Notifications and Profile (only on Dashboard) */}
        {(currentSection === 'Dashboard' || !currentSection || currentSection === 'Restaurant Dashboard') && (
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM12 3v9M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            {/* Restaurant Profile */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  {restaurantLogo ? (
                    <Image
                      src={restaurantLogo} 
                      alt={restaurantName || 'Restaurant logo'}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded object-cover"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <span className="text-white font-bold text-sm sm:text-lg">
                      {restaurantName?.charAt(0) || 'R'}
                    </span>
                  )}
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {restaurantName || 'Restaurant Name'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {restaurantEmail || 'restaurant@example.com'}
                  </span>
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile section buttons */}
      <div className="sm:hidden mt-4">
        {renderSectionButtons()}
      </div>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Backdrop */}
           

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg p-4 sm:p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Category</h3>
            <p className="text-sm text-gray-600 mb-4">Enter a name for the new menu category.</p>
            
            <div className="mb-6">
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                autoFocus
              />
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!categoryName.trim()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                  categoryName.trim()
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Add Category
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Item Modal */}
      {showAddMenuItemModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Backdrop */}

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Add Menu Item</h3>
            <p className="text-sm text-gray-600 mb-6">Create or edit a menu item.</p>
            
            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={ menuItem.categoryId }
                  onChange={(e) => handleMenuItemChange('categoryId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select a category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat?.name}</option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={menuItem.name}
                  onChange={(e) => handleMenuItemChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Menu item name"
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddIngredient();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Add an ingredient"
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {/* Selected Ingredients */}
                {menuItem.ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {menuItem.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                      >
                        {ingredient}
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(ingredient)}
                          className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  value={menuItem.price}
                  onChange={(e) => handleMenuItemChange('price', e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.00"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={menuItem.imageUrl}
                  onChange={(e) => handleMenuItemChange('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Available Switch */}
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Available</label>
                <button
                  type="button"
                  onClick={() => handleMenuItemChange('isAvailable', !menuItem.isAvailable)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    menuItem.isAvailable ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      menuItem.isAvailable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Popular Switch */}
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Popular</label>
                <button
                  type="button"
                  onClick={() => handleMenuItemChange('isPopular', !menuItem.isPopular)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    menuItem.isPopular ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      menuItem.isPopular ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 mt-8">
              <button
                onClick={handleCancelMenuItem}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMenuItem}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Save
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardNavbar;