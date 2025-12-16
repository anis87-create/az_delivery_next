'use client';
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../hooks.js';
import { register } from '@/app/store/slices/authSlice.js';
import { useRouter } from 'next/navigation';
import { createRestaurant } from '@/app/store/slices/restaurantSlice.js';
import { useDispatch, useSelector } from 'react-redux';

const RegisterForm = ({ onRoleChange }) => {

  const [form, setForm] = useState({
    fullName:'',

    email:'',
    password:'',
    phone:'',
    address:'',
    role:''
  });

  const [restaurantForm, setRestaurantForm] = useState({
    name: '',
    img: null,
    coverImg: null,
    type: '',
    category: '',
    tags: [],
    restaurantAddress: '',
    street: '',
    city: '',
    zipCode: '',
    phone: '',
    description: '',
    deliveryZone: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const {  message, users, isError } = useSelector(state => state.auth);


  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm({
      ...form,
      [name]: value
    });

    // Notify parent component of role changes
    if (name === 'role' && onRoleChange) {
      onRoleChange(value);
    }
  }

  const handleRestaurantChange = (e) => {
    const {name, value} = e.target;
    setRestaurantForm({
      ...restaurantForm,
      [name]: value
    })
  }

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }

      setRestaurantForm({
        ...restaurantForm,
        coverImg: file
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !restaurantForm.tags.includes(trimmedTag)) {
      setRestaurantForm({
        ...restaurantForm,
        tags: [...restaurantForm.tags, trimmedTag]
      });
      setTagInput('');
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setRestaurantForm({
      ...restaurantForm,
      tags: restaurantForm.tags.filter(tag => tag !== tagToRemove)
    });
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();

    try {
      const userFound = users?.find(user => user.email === form.email);
      if(!userFound){
        if(form.role === 'restaurant_owner'){
          // Envoyer toutes les données (utilisateur + restaurant) en une seule requête
          const registrationData = {
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            phone: form.phone,
            address: form.address,
            role: 'restaurant_owner',
            // Données du restaurant
            name: restaurantForm.name,
            img: restaurantForm.img ? restaurantForm.img.name : null,
            coverImg: restaurantForm.coverImg ? restaurantForm.coverImg.name : null,
            type: restaurantForm.type,
            category: restaurantForm.category,
            tags: restaurantForm.tags,
            deliveryZone: restaurantForm.deliveryZone,
            street: restaurantForm.street,
            city: restaurantForm.city,
            zipCode: restaurantForm.zipCode,
            description: restaurantForm.description
          };
          // Envoyer en une seule fois au backend
          dispatch(register(registrationData));
  
          if(message !== ''){
            router.push('/');
          }
        } else {
          const userData = {
            id: uuidv4(),
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            phone: form.phone,
            address: form.address,
            role: form.role
          };
          dispatch(register(userData));
          if(message === ''){
              router.push('/');
          } 
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  }

  return (
    <div className="w-1/2 p-8 lg:p-12 flex items-center justify-center overflow-y-auto">
          <div className="max-w-md w-full my-8">
              {isError &&  <div className='bg-red-100 p-2 font-weight mb-4'>{message}</div>}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="mt-2 text-gray-600">
                  {form.role === 'restaurant_owner'
                    ? 'Rejoignez-nous et commencez à développer votre restaurant'
                    : 'Join us and start ordering'}
                </p>
              </div>
              <form className="space-y-6"
              onSubmit={onSubmit}
              >
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your email"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Create a password"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    onChange={handleChange}
                  />
                </div>

                {form.role !== 'restaurant_owner' && (
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your address"
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                    User Type
                  </label>
                  <select
                    id="userType"
                    name="role"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    onChange={handleChange}
                  >
                    <option value="">Select user type</option>
                    <option value="customer">Customer</option>
                    <option value="restaurant_owner">Restaurant Owner</option>
                  </select>
                </div>

                {/* Restaurant Information Section - Only visible for restaurant owners */}
                {form.role === 'restaurant_owner' && (
                  <>
                    <div className="border-t border-gray-200 pt-6 mt-2">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span>🏪</span> Informations du Restaurant
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nom du Restaurant *
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            //required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Ex: Le Petit Bistrot"
                            onChange={handleRestaurantChange}
                          />
                        </div>


                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                            Type *
                          </label>
                          <select
                            id="type"
                            name="type"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            onChange={handleRestaurantChange}
                          >
                            <option value="">Select type</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="quick_bite">Quick Bite</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            id="category"
                            name="category"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            onChange={handleRestaurantChange}
                          >
                            <option value="">Select category</option>
                            <option value="Burger">Burger</option>
                            <option value="Pizza">Pizza</option>
                            <option value="Sushi">Sushi</option>
                            <option value="mexican">Mexican</option>
                            <option value="healthy">Healthy</option>
                            <option value="asian">Asian</option>
                            <option value="cafe">Cafe</option>
                            <option value="bar">Bar</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                            Tags
                          </label>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <input
                                id="tags"
                                type="text"
                                list="tag-suggestions"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Tapez un tag (ex: Italian, Vegan...)"
                              />
                              <datalist id="tag-suggestions">
                                <option value="Italian" />
                                <option value="American" />
                                <option value="Japanese" />
                                <option value="Chinese" />
                                <option value="Mexican" />
                                <option value="French" />
                                <option value="Indian" />
                                <option value="Thai" />
                                <option value="Lebanese" />
                                <option value="Fast Food" />
                                <option value="Healthy" />
                                <option value="Vegan" />
                                <option value="Vegetarian" />
                                <option value="Halal" />
                                <option value="Organic" />
                                <option value="Burgers" />
                                <option value="Pizza" />
                                <option value="Sushi" />
                                <option value="Noodles" />
                                <option value="Salads" />
                                <option value="Tacos" />
                                <option value="Coffee" />
                                <option value="Pastries" />
                                <option value="Breakfast" />
                                <option value="Cocktails" />
                                <option value="Late Night" />
                                <option value="Premium" />
                                <option value="Specialty Coffee" />
                                <option value="Rooftop View" />
                              </datalist>
                              <button
                                type="button"
                                onClick={handleAddTag}
                                disabled={!tagInput.trim()}
                                className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                              >
                                Add
                              </button>
                            </div>
                            {restaurantForm.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {restaurantForm.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                                  >
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveTag(tag)}
                                      className="hover:text-orange-900 focus:outline-none"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-gray-500">💡 Tapez votre tag et appuyez sur Entrée ou cliquez sur &quot;Add&quot; pour l&apos;ajouter</p>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="restaurantStreet" className="block text-sm font-medium text-gray-700 mb-2">
                            Adresse (Rue) *
                          </label>
                          <input
                            id="street"
                            name="street"
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Ex: 123 Rue de la Paix"
                            onChange={handleRestaurantChange}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                              Ville *
                            </label>
                            <input
                              id="city"
                              name="city"
                              type="text"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Ex: Paris"
                              onChange={handleRestaurantChange}
                            />
                          </div>
                          <div>
                            <label htmlFor="restaurantZipCode" className="block text-sm font-medium text-gray-700 mb-2">
                              Code Postal *
                            </label>
                            <input
                              id="zipCode"
                              name="zipCode"
                              type="text"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Ex: 75001"
                              onChange={handleRestaurantChange}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Téléphone du Restaurant *
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Ex: +33 1 23 45 67 89"
                            onChange={handleRestaurantChange}
                          />
                        </div>

                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                            placeholder="Décrivez votre restaurant (optionnel)"
                            onChange={handleRestaurantChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Information Section */}
                    <div className="border-t border-gray-200 pt-6 mt-2">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span>💼</span> Informations Commerciales
                      </h3>

                      <div className="space-y-4">

                        <div>
                          <label htmlFor="deliveryZone" className="block text-sm font-medium text-gray-700 mb-2">
                            Zone de Livraison *
                          </label>
                          <input
                            id="deliveryZone"
                            name="deliveryZone"
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Ex: 5 km ou quartiers spécifiques"
                            onChange={handleRestaurantChange}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-orange-500 hover:text-orange-600">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-orange-500 hover:text-orange-600">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"

                >
                  Create Account
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
            </form>
          </div>
    </div>
  )
}

export default RegisterForm
