'use client'
import { deleteCategory, getAllCategories, updateCategory } from '@/app/store/slices/categorySlice';
import Image from 'next/image';
import { useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const MenuManagement = () => {
  // Static categories data
  const { categories, isLoading } = useSelector(state => state.categories);
  const [updateShowCategory, setUpdateShowCategory]= useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const dispatch = useDispatch();

  // Static items data
  const [items] = useState([
    {
      id: 1,
      categoryId: 1,
      name: 'Pizza Margherita',
      ingredients: ['Tomate', 'Mozzarella', 'Basilic'],
      price: 12.50,
      imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
      available: true,
      popular: true
    },
    {
      id: 2,
      categoryId: 1,
      name: 'Pizza 4 Fromages',
      ingredients: ['Mozzarella', 'Gorgonzola', 'Parmesan', 'Chèvre'],
      price: 14.00,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
      available: true,
      popular: false
    },
    {
      id: 3,
      categoryId: 2,
      name: 'Burger Classic',
      ingredients: ['Boeuf', 'Salade', 'Tomate', 'Oignon'],
      price: 10.50,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
      available: true,
      popular: true
    },
    {
      id: 4,
      categoryId: 2,
      name: 'Burger Bacon',
      ingredients: ['Boeuf', 'Bacon', 'Fromage', 'Sauce BBQ'],
      price: 12.00,
      imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b',
      available: false,
      popular: false
    },
    {
      id: 5,
      categoryId: 3,
      name: 'Tiramisu',
      ingredients: ['Mascarpone', 'Café', 'Cacao'],
      price: 6.50,
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
      available: true,
      popular: true
    },
    {
      id: 6,
      categoryId: 4,
      name: 'Coca Cola',
      ingredients: [],
      price: 2.50,
      imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7',
      available: true,
      popular: false
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('items'); // 'items' ou 'categories'

  const getCategoryName = (categoryId) => {
    return categories.find(cat => cat._id === categoryId)?.name || 'Unknown';
  };

  // Filter items by category and search query
  const filteredItems = items.filter(item => {
    // Filter by category
    const matchesCategory = selectedCategory === 'all' || item.categoryId === parseInt(selectedCategory);

    // Filter by search query (search in name and ingredients)
    const matchesSearch = searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });
  const handleCancel = () => {
    setCategoryName('');
    setUpdateShowCategory(false);
  };
  const handleUpdateCategory = async (categoryName, id) => {
    try {
       const formData = {name: categoryName};
       await dispatch(updateCategory({id, formData}));
       setUpdateShowCategory(false);
       Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Catégorie modifié avec succès!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });

    } catch (error) {
      console.log(error);  
    }
   
  };
  const handleRemoveCategory = async (id) => {
    const result = await Swal.fire({
    title: "Confirmer la suppression ?",
    text: "Cette action est irréversible.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
    reverseButtons: true,
  });
  if (!result.isConfirmed) return;  
   try {
     
     await dispatch(deleteCategory(id));
   } catch (error) {
     console.log(error);
   }
  }
  const renderUpdatedCategory = (id) => {   
     setUpdateShowCategory(true); 
     const category = categories.find(category => category._id === id);
     setCategoryName(category.name);
     setSelectedCategoryId(category._id); 
  } 

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`bg-white rounded-lg shadow p-4 sm:p-6 cursor-pointer transition-all hover:shadow-lg ${activeView === 'categories' ? 'ring-2 ring-orange-500' : ''}`}
          onClick={() => setActiveView('categories')}
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Categories</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>

        <div
          className={`bg-white rounded-lg shadow p-4 sm:p-6 cursor-pointer transition-all hover:shadow-lg ${activeView === 'items' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setActiveView('items')}
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Available</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {items.filter(item => item.available).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Rendering: Categories View or Items View */}
      {activeView === 'categories' ? (
        <>
          {/* Categories List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
              <p className="text-sm text-gray-500">Manage your menu categories</p>
            </div>

            {categories.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <li key={category._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                          <p className="text-xs text-gray-500">
                            {items.filter(item => item.categoryId === category._id).length} items
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                          title="Edit category"
                          onClick={() => {
                            renderUpdatedCategory(category._id);
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className="p-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                          title="Delete category"
                          onClick={() => handleRemoveCategory(category._id)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                    
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
                <p className="mt-1 text-sm text-gray-500">Create your first category to organize your menu.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Search Bar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Items</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name or ingredient..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {!item.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Unavailable
                      </span>
                    </div>
                  )}
                  {item.popular && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Popular
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{getCategoryName(item.categoryId)}</p>
                    </div>
                    <span className="text-lg font-bold text-orange-600">{item.price.toFixed(2)} TND</span>
                  </div>
                  {item.ingredients.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Ingredients:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.ingredients.map((ingredient, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex space-x-2 mt-auto">
                    <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                     onClick={() => {
                        setUpdateShowMenu(true)
                     }}
                    >
                      Edit
                    </button>
                    <button className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">No items in this category.</p>
            </div>
          )}
        </>
      )}


    {updateShowCategory && (
                        <div className="fixed inset-0 z-50 overflow-y-auto">
                          <div className="flex min-h-full items-center justify-center p-4">
                          {/* Backdrop */}
                          {/* Modal Content */}
                          <div className="relative bg-white rounded-lg p-4 sm:p-6 max-w-md w-full shadow-xl">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Update Category</h3>
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
                              onClick={() => handleUpdateCategory(categoryName, selectedCategoryId) }
                              disabled={!categoryName.trim()}
                              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                                categoryName.trim()
                                  ? 'bg-orange-600 hover:bg-orange-700'
                                  : 'bg-gray-300 cursor-not-allowed'
                              }`}
                            >
                              Update Category
                            </button>
                          </div>
                          </div>
                        </div>
                        </div>
                      )}
    </div>
    
  );
};

export default MenuManagement;
