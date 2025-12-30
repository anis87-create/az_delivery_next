import { useDispatch, useSelector } from "react-redux";
import { updateItem } from "../../store/features/itemsSlice";
import { useState } from "react";

const MenuItem = ({
  item,
  categoryId,
  activeDropdown,
  toggleItemAvailability,
  handleDropdownAction,
  setActiveDropdown,
  handleRemoveItem
}) => {
  // Créer un identifiant unique pour le dropdown combinant categoryId et item.id
  const dropdownId = `${categoryId}-${item.id}`;
  const isDropdownOpen = activeDropdown === dropdownId;
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.items);
  
  // État pour le modal d'édition
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: item.name,
    ingredients: item.ingredients || [],
    price: item.price,
    imageUrl: item.imageUrl,
    available: item.available,
    popular: item.popular || false
  });
  const [currentIngredient, setCurrentIngredient] = useState('');

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedItem = {
      ...item,
      ...editForm
    };
    dispatch(updateItem(updatedItem));
    setIsEditModalOpen(false);
    setActiveDropdown(null);
  };

  const handleEditClick = () => {
    setEditForm({
      name: item.name,
      ingredients: item.ingredients || [],
      price: item.price,
      imageUrl: item.imageUrl,
      available: item.available,
      popular: item.popular || false
    });
    setCurrentIngredient('');
    setIsEditModalOpen(true);
    setActiveDropdown(null);
  };

  return (
    <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      {/* Item Image */}
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg mr-4 shadow-sm"
      />

      {/* Item Info */}
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h5 className="font-medium text-gray-900">{item.name}</h5>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
            <div className="flex items-center mt-2">
              <span className="text-lg font-semibold text-gray-900">TND {item.price}</span>
              <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                item.available
                  ? 'bg-white text-green-600 border border-green-600'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {item.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Item Actions */}
      <div className="flex items-center space-x-3">
        {/* Availability Toggle */}
        <button
          onClick={() => {
            item?.available = !item.available;
            console.log(item.available);
            dispatch(updateItem(item));
            
            
          }
          
        
        }
          className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
        >
          {item.available ? 'Mark Unavailable' : 'Mark Available'}
        </button>

        {/* Three Dots Menu */}
        <div className="relative">
          <button
            onClick={() => setActiveDropdown(isDropdownOpen ? null : dropdownId)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={handleEditClick}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDropdownAction('delete', categoryId, item.id);
                    handleRemoveItem(item);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'édition */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Modifier l'article</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingrédients
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (currentIngredient.trim() && !editForm.ingredients.includes(currentIngredient.trim())) {
                          setEditForm({...editForm, ingredients: [...editForm.ingredients, currentIngredient.trim()]});
                          setCurrentIngredient('');
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Ajouter un ingrédient"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (currentIngredient.trim() && !editForm.ingredients.includes(currentIngredient.trim())) {
                        setEditForm({...editForm, ingredients: [...editForm.ingredients, currentIngredient.trim()]});
                        setCurrentIngredient('');
                      }
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>


                {/* Ingrédients sélectionnés */}
                {editForm.ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editForm.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                      >
                        {ingredient}
                        <button
                          type="button"
                          onClick={() => {
                            setEditForm({
                              ...editForm, 
                              ingredients: editForm.ingredients.filter(ing => ing !== ingredient)
                            });
                          }}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (TND)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de l'image
                </label>
                <input
                  type="url"
                  value={editForm.imageUrl}
                  onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-4">
                {/* Switch Available */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Disponible
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditForm({...editForm, available: !editForm.available})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                      editForm.available ? 'bg-orange-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editForm.available ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch Popular */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Populaire
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditForm({...editForm, popular: !editForm.popular})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                      editForm.popular ? 'bg-orange-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        editForm.popular ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors"
                  onClick={() => dispatch(updateItem(item))}
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItem;