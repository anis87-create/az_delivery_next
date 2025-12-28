import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem } from '../../store/features/itemsSlice';
import MenuItem from './MenuItem';
import { getRestaurantsByOwner } from '../../store/features/restaurantSlice';

const MenuManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All items');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const {items} = useSelector(state => state.items);
  const { categories } = useSelector(state => state.categories);
  const {currentUser} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const restaurant = useSelector(state => getRestaurantsByOwner(state, currentUser.id));
  // Grouper les items par categoryId
  const grouped = items.filter(item => item.restaurantId === restaurant.id).reduce((acc, item) => {
    const key = item.categoryId;
    if (!acc[key]) {
      acc[key] = [];
    }

    const { category, ...rest } = item;
    acc[key].push(rest);

    return acc;
  }, {});

  // Mock data
  const [menuData, setMenuData] = useState(grouped);

  const toggleItemAvailability = (categoryName, itemId) => {
    setMenuData(prevData => ({
      ...prevData,
      [categoryName]: prevData[categoryName].map(item =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    }));
  };

  const handleDropdownAction = () => {
    setActiveDropdown(null);
  };
  const handleRemoveItem = (item) => {
    dispatch(removeItem(item));
  }

  const getFilteredItems = (items) => {
    let filtered = items;
    if (filterStatus === 'Available') {
      filtered = filtered.filter(item => item.available);
    } else if (filterStatus === 'Unavailable') {
      filtered = filtered.filter(item => !item.available);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <p className="text-gray-600">Manage your restaurant menu items and categories</p>
      </div>

      {/* Menu Items Section */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* Title and Controls */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Menu Items</h3>
          
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search menu items..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Filter Select */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option key="all" value="All items">All items</option>
                <option key="available" value="Available">Available</option>
                <option key="unavailable" value="Unavailable">Unavailable</option>
              </select>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Categories and Items */}
        <div className="space-y-6">
          {Object.entries(grouped)
            .filter(([, items]) => {
              const filteredItems = getFilteredItems(items);
              return filteredItems.length > 0;
            })
            .map(([categoryId, items]) => {
              const filteredItems = getFilteredItems(items);
              const categoryName = categories.find(category => category.id === Number(categoryId))?.name;
            return (
              <div key={`category-${categoryId}`}>
                {/* Category Header */}
                <div className="bg-gray-50 px-4 py-3 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium text-gray-900">{categoryName}</h4>
                    <span className="text-xs bg-black text-white px-4 py-1 rounded-full">{filteredItems.length} items</span>
                  </div>
                </div>
                
                {/* Category Items */}
                <div className="space-y-3">
                  {filteredItems.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      categoryId={categoryId}
                      activeDropdown={activeDropdown}
                      toggleItemAvailability={toggleItemAvailability}
                      handleDropdownAction={handleDropdownAction}
                      setActiveDropdown={setActiveDropdown}
                      handleRemoveItem={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;