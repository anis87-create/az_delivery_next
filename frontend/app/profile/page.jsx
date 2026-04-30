'use client'
import { useState } from 'react';
import Image from 'next/image';
import moment from 'moment';
import {
  FiUser, FiMapPin, FiLock, FiShoppingBag,
  FiEdit2, FiCheck, FiX, FiPlus, FiTrash2, FiChevronRight,
  FiEye, FiEyeOff,
} from 'react-icons/fi';
import Avatar from '@/app/components/common/Avatar.jsx';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { useEffect } from 'react';
import { getOrderByUserId } from '../store/slices/orderSlice';
import { authMe, updatePassword, updateProfile } from '../store/slices/authSlice';
import { useRef } from 'react';


const MOCK_USER = {
  fullName:    'Anis Zarrouk',
  email:       'anis.zarrouk@example.com',
  phoneNumber: '+216 55 123 456',
  birthDate:   '1995-06-15',
  role:        'customer',
};

// ── Sidebar nav items ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'info',      label: 'Personal Info',       icon: FiUser },
  { id: 'addresse', label: 'Delivery Addresse',  icon: FiMapPin },
  { id: 'password',  label: 'Change Password',      icon: FiLock },
  { id: 'orders',    label: 'Order History',        icon: FiShoppingBag },
];

const STATUS_STYLES = {
  preparing:  'bg-yellow-400 text-white',
  pending:    'bg-gray-400 text-white',
  confirmed:  'bg-blue-500 text-white',
  on_the_way: 'bg-orange-500 text-white',
  delivered:  'bg-green-500 text-white',
  cancelled:  'bg-red-500 text-white',
};

// ── Static mock data ──────────────────────────────────────────────────────────




// ── Section: Personal Info ────────────────────────────────────────────────────
function PersonalInfo({ userProfile }) {
  const [editing, setEditing] = useState(false);
  const { isLoading, user } = useAppSelector(state => state.auth);
  const [form, setForm] = useState({
    fullName:    userProfile?.fullName    ?? '',
    email:       userProfile?.email       ?? '',
    phoneNumber: userProfile?.phoneNumber ?? '',
    birthDate:   userProfile?.birthDate   ?? '',
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const dispatch = useAppDispatch();
  const inputRef = useRef(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append('fullName', form.fullName);
    formData.append('email', form.email);
    if (form.phoneNumber) formData.append('phoneNumber', form.phoneNumber);
    if (form.birthDate) formData.append('birthDate', form.birthDate);
    if (avatarFile) formData.append('avatar', avatarFile);
    dispatch(updateProfile(formData)).then(() => {
      setEditing(false);
      setPreviewUrl(null);
      setAvatarFile(null);
    });
  };

  const handleCancel = () => {
    setEditing(false);
    setPreviewUrl(null);
    setAvatarFile(null);
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Personal Info</h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-orange-500 border border-orange-500 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
          >
            <FiEdit2 className="w-4 h-4" /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <FiX className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-60"
            >
              <FiCheck className="w-4 h-4" /> {isLoading ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <Avatar src={previewUrl || user?.avatar} name={user?.fullName} size="w-20 h-20" fontSize="text-2xl" borderClass="border-2 border-orange-400" />
          {editing && (
            <>
              <button
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow cursor-pointer hover:bg-orange-600 transition-colors"
                onClick={() => inputRef.current?.click()}
              >
                <FiEdit2 className="w-3.5 h-3.5 text-white" />
              </button>
              <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/jpg"
                hidden
              />
            </>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">{user?.fullName ?? '—'}</p>
          <p className="text-gray-400 text-sm capitalize">{user?.role?.replace('_', ' ') ?? 'Customer'}</p>
          {previewUrl && <p className="text-orange-500 text-xs mt-1">New photo selected — save to confirm</p>}
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Full Name',    name: 'fullName',    type: 'text',  editable: true },
          { label: 'Email',        name: 'email',       type: 'email', editable: true },
          { label: 'Phone',        name: 'phoneNumber', type: 'tel',   editable: true },
          { label: 'Date of birth',name: 'birthDate',   type: 'date',  editable: true },
        ].map(({ label, name, type, editable }) => (
          <div key={name}>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              {label}
            </label>
            {editing && editable ? (
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
            ) : (
              <p className={`px-4 py-2.5 rounded-xl text-sm ${!editable && editing ? 'bg-gray-50 text-gray-400 border border-dashed border-gray-200' : 'text-gray-900'}`}>
                {form[name] || <span className="text-gray-300">—</span>}
                {!editable && editing && <span className="ml-2 text-xs text-gray-300">(not editable)</span>}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section: Delivery Addresses ───────────────────────────────────────────────
function DeliveryAddresses({ address, city, zipCode }) {  
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: '', street: '', city: '', zipCode: '' });

   



  return (
    <div className="flex flex-col gap-6">

      {/* Address list */}
      <div className="flex flex-col gap-3">
          <div  className={`flex items-start justify-between p-4 rounded-2xl border transition-colors border-gray-200 bg-white`}>
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-orange-500`}>
                <FiMapPin className={`w-4 h-4 text-white`} />
              </div>
              <div>
                <p className="text-gray-500 text-sm mt-0.5">{address}</p>
                <p className="text-gray-400 text-xs mt-0.5">{city}{zipCode ? `, ${zipCode}` : ''}</p>
              </div>
            </div>
          </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="p-4 border border-dashed border-orange-300 rounded-2xl bg-orange-50 flex flex-col gap-3">
          <p className="font-semibold text-gray-900 text-sm">New address</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'label',   placeholder: 'Label (Home, Work…)' },
              { name: 'street',  placeholder: 'Street' },
              { name: 'city',    placeholder: 'City' },
              { name: 'zipCode', placeholder: 'ZIP Code' },
            ].map(({ name, placeholder }) => (
              <input
                key={name}
                name={name}
                value={newAddr[name]}
                onChange={e => setNewAddr({ ...newAddr, [e.target.name]: e.target.value })}
                placeholder={placeholder}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              />
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">Cancel</button>
            <button onClick={addAddress} className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 cursor-pointer">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Section: Change Password ──────────────────────────────────────────────────
function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [saved, setSaved] = useState(false);
  const [visible, setVisible] = useState({ oldPassword: false, newPassword: false, confirmPassword: false });
  const dispatch = useAppDispatch();

  const toggleVisible = (name) => setVisible(prev => ({ ...prev, [name]: !prev[name] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    dispatch(updatePassword(form));
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        {[
          { name: 'oldPassword', label: 'Current password', placeholder:'enter your old password' },
          { name: 'newPassword',    label: 'New password', placeholder:'enter your new password' },
          { name: 'confirmPassword', label: 'Confirm new password', placeholder:'confirm your new Password'},
        ].map(({ name, label, placeholder }) => (
          <div key={name}>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
            <div className="relative">
              <input
                type={visible[name] ? 'text' : 'password'}
                value={form[name]}
                onChange={e => setForm({ ...form, [name]: e.target.value })}
                className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                placeholder={placeholder}
              />
              <button
                type="button"
                onClick={() => toggleVisible(name)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {visible[name] ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}

        {form.next && form.confirm && form.next !== form.confirm && (
          <p className="text-red-500 text-xs">Passwords do not match.</p>
        )}

        <button
          type="submit"
          disabled={!form.oldPassword || !form.newPassword || form.newPassword !== form.confirmPassword}
          className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer mt-2"
        >
          {saved ? <><FiCheck className="w-4 h-4" /> Saved!</> : 'Update password'}
        </button>
      </form>
    </div>
  );
}

// ── Section: Order History ────────────────────────────────────────────────────
function OrderHistory({orders}) {
  console.log(orders);
  const findRestaurantImgById = (restaurantId) => {

  }
  
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-900">Order History</h2>
      {orders.length === 0 ? (
        <p className="text-gray-400 text-sm">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                    <Image src={order?.restaurantId.img} alt={order?.restaurantId?.name} width={48} height={48} unoptimized className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{order?.restaurantId.name}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{order.items.map(i => i.name).join(', ')}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{moment(order.createdAt).calendar()}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${STATUS_STYLES[order.status] ?? 'bg-gray-300 text-white'}`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{order.total.toFixed(2)} TND</span>
                <button className="text-orange-500 text-sm font-semibold flex items-center gap-1 hover:text-orange-600 transition-colors cursor-pointer">
                  View details <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user } = useAppSelector(state => state.auth);
  const { orders } = useAppSelector(state => state.orders);
  const [activeTab, setActiveTab] = useState('info');
  const dispatch = useAppDispatch();
  
 
  const renderContent = () => {
    switch (activeTab) {
      case 'info':      return <PersonalInfo key={user?._id} userProfile={user} />;
      case 'addresse': return <DeliveryAddresses address={user.address} city={user.city} zipCode={user.zipCode} />;
      case 'password':  return <ChangePassword />;
      case 'orders':    return <OrderHistory orders={orders} />;
      default:          return null;
    }
  };

  useEffect(() => {
    dispatch(getOrderByUserId());
  }, [dispatch]);

  
  return (
    <div className="min-h-screen bg-gray-50 pt-35 px-14 pb-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* User preview */}
          <div className="px-5 py-5 border-b border-gray-100 flex items-center gap-3">
            {user?.avatar ? <Avatar src={user?.avatar } size="w-10 h-10" fontSize="text-sm" borderClass="border-2 border-orange-400" />
            :  
            <Avatar name={user?.fullName } size="w-10 h-10" fontSize="text-sm" borderClass="border-2 border-orange-400" />
            }
            
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{user?.fullName ?? 'Guest'}</p>
              <p className="text-gray-400 text-xs truncate">{user?.email ?? ''}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="py-2">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === id
                    ? 'text-orange-500 bg-orange-50 border-l-4 border-orange-500'
                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl px-8 py-6 shadow-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
