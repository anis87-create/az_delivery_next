'use client';
import Link from 'next/link'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { register } from '../store/slices/authSlice';
import { useSelector } from 'react-redux';
import {RootState, useAppDispatch} from '../hooks/hooks';
import type { UserFormState, RestaurantFormState, RegisterFormProps, RegisterData } from '@/app/types';
import { z } from 'zod';

const CustomerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Minimum 8 characters').regex(
    /^(?=(?:.*\d){6,})(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
    'Password must have 6 digits, one lowercase, one uppercase, and one special character'
  ),
  phoneNumber: z.string().min(1, 'Phone number is required').regex(/^\d{8}$/, 'Phone number must be exactly 8 digits'),
  address: z.string().min(1, 'Address is required'),
  role: z.string().min(1, 'Please select an account type'),
});

const RestaurantOwnerSchema = CustomerSchema.extend({
  name: z.string().min(1, 'Restaurant name is required'),
  type: z.string().min(1, 'Type is required'),
  category: z.string().min(1, 'Category is required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(4, 'Invalid zip code'),
  phone: z.string().min(1, 'Phone number is required').regex(/^\d{8}$/, 'Phone number must be exactly 8 digits'),
  restaurantEmail: z.string().min(1, 'Restaurant email is required').pipe(z.email('Invalid email address')),
  deliveryZone: z.string().min(1, 'Delivery zone is required'),
});

type FieldErrors = Partial<Record<keyof RegisterData, string>>;

const RegisterForm= ({ onRoleChange}: RegisterFormProps) => {
  
  const [form, setForm] = useState<UserFormState>({
    fullName:'',
    email:'',
    password:'',
    phoneNumber:'',
    address:'',
    city:'',
    zipCode:'',
    role:''
  });

  const [restaurantForm, setRestaurantForm] = useState<RestaurantFormState>({
    name: '',
    img: null,
    coverImg: null,
    type: '',
    category: '',
    tags: [],
    street: '',
    city: '',
    zipCode: '',
    phone: '',
    email: '',
    description: '',
    deliveryZone: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const dispatch = useAppDispatch();
  const {  message, isError } = useSelector((state:RootState) => state.auth);


  const handleChange = (e: ChangeEvent<HTMLInputElement| HTMLSelectElement>) => {
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

  const handleRestaurantChange = (e: ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setRestaurantForm({
      ...restaurantForm,
      [name]: value
    })
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

  const handleRemoveTag = (tagToRemove:string) => {
    setRestaurantForm({
      ...restaurantForm,
      tags: restaurantForm.tags.filter(tag => tag !== tagToRemove)
    });
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }

  const onSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isOwner = form.role === 'restaurant_owner';

    const dataToValidate = isOwner
      ? { ...form, name: restaurantForm.name, type: restaurantForm.type, category: restaurantForm.category, street: restaurantForm.street, city: restaurantForm.city, zipCode: restaurantForm.zipCode, phone: restaurantForm.phone, restaurantEmail: restaurantForm.email, deliveryZone: restaurantForm.deliveryZone }
      : form;

    const schema = isOwner ? RestaurantOwnerSchema : CustomerSchema;
    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const errors: FieldErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    if (isOwner) {
      dispatch(register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phoneNumber,
        address: form.address,
        role: 'restaurant_owner',
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
        restaurantEmail: restaurantForm.email,
        description: restaurantForm.description
      }));
    } else {
      dispatch(register({
        id: uuidv4(),
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
        address: form.address,
        city: form.city,
        zipCode: form.zipCode,
        role: form.role
      }));
    }
  }

  return (
    <div className="w-1/2 p-8 lg:p-12 flex items-center justify-center overflow-y-auto">
          <div className="max-w-md w-full my-8">
              {isError && <div className='bg-red-100 border border-red-300 p-3 rounded-lg mb-4 text-red-700 text-sm'>{message}</div>}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.fullName ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter your full name"
                    onChange={handleChange}
                  />
                  {fieldErrors.fullName && <p className="mt-1 text-sm text-red-500">{fieldErrors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.email ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter your email"
                    onChange={handleChange}
                  />
                  {fieldErrors.email && <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.password ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Create a password"
                    onChange={handleChange}
                  />
                  {fieldErrors.password && <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phoneNumber"
                    type="tel"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.phoneNumber ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Enter your phone number"
                    onChange={handleChange}
                  />
                  {fieldErrors.phoneNumber && <p className="mt-1 text-sm text-red-500">{fieldErrors.phoneNumber}</p>}
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.address ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="Enter your address"
                      onChange={handleChange}
                    />
                    {fieldErrors.address && <p className="mt-1 text-sm text-red-500">{fieldErrors.address}</p>}
                  </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.city ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="Ex: Tunis"
                      onChange={handleChange}
                    />
                    {fieldErrors.city && <p className="mt-1 text-sm text-red-500">{fieldErrors.city}</p>}
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.zipCode ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="Ex: 1000"
                      onChange={handleChange}
                    />
                    {fieldErrors.zipCode && <p className="mt-1 text-sm text-red-500">{fieldErrors.zipCode}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                    User Type
                  </label>
                  <select
                    id="userType"
                    name="role"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.role ? 'border-red-400' : 'border-gray-300'}`}
                    onChange={handleChange}
                  >
                    <option value="">Select user type</option>
                    <option value="customer">Customer</option>
                    <option value="restaurant_owner">Restaurant Owner</option>
                  </select>
                  {fieldErrors.role && <p className="mt-1 text-sm text-red-500">{fieldErrors.role}</p>}
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
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.name ? 'border-red-400' : 'border-gray-300'}`}
                            placeholder="Ex: Le Petit Bistrot"
                            onChange={handleRestaurantChange}
                          />
                          {fieldErrors.name && <p className="mt-1 text-sm text-red-500">{fieldErrors.name}</p>}
                        </div>


                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                            Type *
                          </label>
                          <select
                            id="type"
                            name="type"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.type ? 'border-red-400' : 'border-gray-300'}`}
                            onChange={handleRestaurantChange}
                          >
                            <option value="">Select type</option>
                            <option value="restaurant">Restaurant</option>
                            <option value="quick_bite">Quick Bite</option>
                          </select>
                          {fieldErrors.type && <p className="mt-1 text-sm text-red-500">{fieldErrors.type}</p>}
                        </div>

                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            id="category"
                            name="category"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.category ? 'border-red-400' : 'border-gray-300'}`}
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
                          {fieldErrors.category && <p className="mt-1 text-sm text-red-500">{fieldErrors.category}</p>}
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
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.street ? 'border-red-400' : 'border-gray-300'}`}
                            placeholder="Ex: 123 Rue de la Paix"
                            onChange={handleRestaurantChange}
                          />
                          {fieldErrors.street && <p className="mt-1 text-sm text-red-500">{fieldErrors.street}</p>}
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
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.city ? 'border-red-400' : 'border-gray-300'}`}
                              placeholder="Ex: Paris"
                              onChange={handleRestaurantChange}
                            />
                            {fieldErrors.city && <p className="mt-1 text-sm text-red-500">{fieldErrors.city}</p>}
                          </div>
                          <div>
                            <label htmlFor="restaurantZipCode" className="block text-sm font-medium text-gray-700 mb-2">
                              Code Postal *
                            </label>
                            <input
                              id="zipCode"
                              name="zipCode"
                              type="text"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.zipCode ? 'border-red-400' : 'border-gray-300'}`}
                              placeholder="Ex: 75001"
                              onChange={handleRestaurantChange}
                            />
                            {fieldErrors.zipCode && <p className="mt-1 text-sm text-red-500">{fieldErrors.zipCode}</p>}
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
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.phone ? 'border-red-400' : 'border-gray-300'}`}
                            placeholder="Ex: +33 1 23 45 67 89"
                            onChange={handleRestaurantChange}
                          />
                          {fieldErrors.phone && <p className="mt-1 text-sm text-red-500">{fieldErrors.phone}</p>}
                        </div>

                        <div>
                          <label htmlFor="restaurantEmail" className="block text-sm font-medium text-gray-700 mb-2">
                            Email du Restaurant *
                          </label>
                          <input
                            id="restaurantEmail"
                            name="email"
                            type="email"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.email_restaurant ? 'border-red-400' : 'border-gray-300'}`}
                            placeholder="Ex: contact@restaurant.com"
                            onChange={handleRestaurantChange}
                          />
                          {fieldErrors.restaurantEmail && <p className="mt-1 text-sm text-red-500">{fieldErrors.restaurantEmail}</p>}
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
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${fieldErrors.deliveryZone ? 'border-red-400' : 'border-gray-300'}`}
                            placeholder="Ex: 5 km ou quartiers spécifiques"
                            onChange={handleRestaurantChange}
                          />
                          {fieldErrors.deliveryZone && <p className="mt-1 text-sm text-red-500">{fieldErrors.deliveryZone}</p>}
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
