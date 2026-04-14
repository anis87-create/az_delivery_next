'use client'
import { useEffect, useState, useMemo, Suspense } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks/hooks';
import { getAllRestaurants } from '@/app/store/slices/restaurantSlice';
import { HiSearch, HiX } from 'react-icons/hi';
import { FaStar } from 'react-icons/fa';
import { Restaurant } from '@/app/types/restaurant.types';
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineHeart } from 'react-icons/hi';
import { MdAccessTime } from 'react-icons/md';

// ── Types ────────────────────────────────────────────────────────────────────

interface RestaurantCardProps {
  id?: string;
  img?: string;
  name: string;
  rate?: number | string;
  time?: string;
  tags?: string[];
  baseFee?: number | string;
}

interface FiltersPanelProps {
  hasActiveFilters: boolean;
  clearFilters: () => void;
  selectedRating: number | null;
  setSelectedRating: (v: number | null) => void;
  isLoading: boolean;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
}

// ── Static data ───────────────────────────────────────────────────────────────

const STATIC_CATEGORIES = [
  { name: 'Pizza',    emoji: '🍕' },
  { name: 'Burger',   emoji: '🍔' },
  { name: 'Sushi',    emoji: '🍣' },
  { name: 'Salads',   emoji: '🥗' },
  { name: 'Desserts', emoji: '🍰' },
  { name: 'Mexican',  emoji: '🌮' },
  { name: 'Indian',   emoji: '🍛' },
  { name: 'Chinese',  emoji: '🥡' },
  { name: 'Healthy',  emoji: '🥦' },
];

const RATING_OPTIONS = [
  { label: '4+ étoiles', value: 4 },
  { label: '3+ étoiles', value: 3 },
  { label: '2+ étoiles', value: 2 },
];

// ── RestaurantCard (inline, typed) ────────────────────────────────────────────

function RestaurantCard({ id, img, name, rate, time, tags, baseFee }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${id}`} className="block group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl mb-3">
        {img ? (
          <Image
            src={img}
            alt={name}
            width={400}
            height={220}
            unoptimized
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-xl">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        <button
          className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform"
          onClick={e => { e.preventDefault(); e.stopPropagation(); }}
          aria-label="Favoris"
        >
          <HiOutlineHeart className="text-gray-600 w-4 h-4" />
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-orange-500 transition-colors truncate">
          {name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 flex-wrap">
          {rate && rate !== 'N/A' && (
            <>
              <span className="flex items-center gap-1">
                <FaStar className="text-yellow-400 w-3 h-3" />
                <span className="font-medium text-gray-700">{rate}</span>
              </span>
              <span className="text-gray-300">•</span>
            </>
          )}
          <span className="flex items-center gap-1">
            <MdAccessTime className="w-3 h-3" />
            {time ?? '30'} min
          </span>
          <span className="text-gray-300">•</span>
          <span className={!baseFee ? 'text-green-600 font-medium' : 'text-gray-500'}>
            {baseFee ? `${baseFee} TND` : 'Livraison gratuite'}
          </span>
        </div>
        {tags && tags.length > 0 && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{tags.join(' · ')}</p>
        )}
      </div>
    </Link>
  );
}

// ── Sidebar filters ───────────────────────────────────────────────────────────

function SidebarFilters({
  hasActiveFilters,
  clearFilters,
  selectedRating,
  setSelectedRating,
  isLoading,
  categories,
  selectedCategory,
  setSelectedCategory,
}: FiltersPanelProps) {
  // Merge static + API categories, deduplicate
  const allCategories = useMemo(() => {
    const merged = [...STATIC_CATEGORIES];
    categories.forEach(cat => {
      if (!STATIC_CATEGORIES.find(s => s.name.toLowerCase() === cat.toLowerCase())) {
        merged.push({ name: cat, emoji: '🍽️' });
      }
    });
    return merged;
  }, [categories]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
        <span className="text-sm font-bold text-gray-900">Filtres</span>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
            <HiX className="w-3 h-3" /> Tout effacer
          </button>
        )}
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto py-2">
        {/* All */}
        <button
          onClick={() => setSelectedCategory('')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
            !selectedCategory
              ? 'text-orange-500 font-semibold bg-orange-50 border-l-2 border-orange-500'
              : 'text-gray-700 hover:bg-gray-50 border-l-2 border-transparent'
          }`}
        >
          <span className="text-base">🏠</span>
          Tous les restaurants
        </button>

        {/* Categories */}
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mx-4 my-1 h-9 bg-gray-100 rounded-lg animate-pulse" />
            ))
          : allCategories.map(({ name, emoji }) => (
              <button
                key={name}
                onClick={() => setSelectedCategory(selectedCategory === name ? '' : name)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors capitalize ${
                  selectedCategory === name
                    ? 'text-orange-500 font-semibold bg-orange-50 border-l-2 border-orange-500'
                    : 'text-gray-700 hover:bg-gray-50 border-l-2 border-transparent'
                }`}
              >
                <span className="text-base">{emoji}</span>
                {name}
              </button>
            ))}

        {/* Divider */}
        <div className="mx-4 my-3 border-t border-gray-100" />

        {/* Rating */}
        <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Note minimale</p>
        {RATING_OPTIONS.map(option => (
          <button
            key={option.value}
            onClick={() => setSelectedRating(selectedRating === option.value ? null : option.value)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
              selectedRating === option.value
                ? 'text-orange-500 font-semibold bg-orange-50 border-l-2 border-orange-500'
                : 'text-gray-700 hover:bg-gray-50 border-l-2 border-transparent'
            }`}
          >
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} className={`w-3 h-3 ${i < option.value ? 'text-yellow-400' : 'text-gray-200'}`} />
              ))}
            </span>
            <span className="text-xs">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function SearchContent() {
  const dispatch = useAppDispatch();
  const { restaurants, isLoading } = useAppSelector(state => state.restaurant);

  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    dispatch(getAllRestaurants());
  }, [dispatch]);

  const apiCategories = useMemo(() => {
    const cats = restaurants.map(r => r.category).filter(Boolean);
    return [...new Set(cats)];
  }, [restaurants]);

  const filtered = useMemo(() => {
    return restaurants.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        r.name.toLowerCase().includes(q) ||
        r.tags?.some(t => t.toLowerCase().includes(q)) ||
        r.category?.toLowerCase().includes(q);

      const matchCategory =
        !selectedCategory ||
        r.category?.toLowerCase() === selectedCategory.toLowerCase();

      const rate = (r as Restaurant & { rate?: number }).rate;
      const matchRating =
        selectedRating === null || (rate !== undefined && rate >= selectedRating);

      return matchSearch && matchCategory && matchRating;
    });
  }, [restaurants, searchQuery, selectedCategory, selectedRating]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedRating(null);
    setSearchQuery('');
  };

  const hasActiveFilters = !!(selectedCategory || selectedRating !== null || searchQuery);

  const filterProps: FiltersPanelProps = {
    hasActiveFilters,
    clearFilters,
    selectedRating,
    setSelectedRating,
    isLoading,
    categories: apiCategories,
    selectedCategory,
    setSelectedCategory,
  };

  return (
    <div className="flex min-h-screen bg-white pt-[130px]">

      {/* ── Left sidebar (desktop) ────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-gray-100 sticky top-[130px] self-start h-[calc(100vh-130px)]">
        <SidebarFilters {...filterProps} />
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">

        {/* Hero */}
        <div className="px-8 py-8 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Tous les restaurants</h1>
          <p className="text-sm text-gray-400 mb-5">
            {isLoading ? 'Chargement...' : `${restaurants.length} restaurants disponibles`}
          </p>
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <HiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search in AZ Delivery..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <HiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="px-8 py-6">
          {/* Count + mobile filter toggle */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {isLoading ? (
                <span className="inline-block w-32 h-4 bg-gray-100 rounded animate-pulse" />
              ) : (
                <>
                  <span className="font-semibold text-gray-900">{filtered.length}</span>
                  {' '}restaurant{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
                  {selectedCategory && (
                    <span className="ml-1 text-orange-500 font-medium capitalize"> · {selectedCategory}</span>
                  )}
                </>
              )}
            </p>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden text-sm text-orange-500 font-medium border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Filtres {hasActiveFilters && '•'}
            </button>
          </div>

          {/* Loading skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-100 rounded-xl mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-5xl mb-4">🍽️</span>
              <h3 className="font-semibold text-gray-800 mb-2">Aucun restaurant trouvé</h3>
              <p className="text-sm text-gray-400 mb-4">Essaie de modifier ta recherche ou tes filtres.</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          )}

          {/* Grid */}
          {!isLoading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filtered.map(restaurant => (
                <RestaurantCard
                  key={restaurant._id}
                  id={restaurant._id}
                  img={restaurant.img}
                  name={restaurant.name}
                  rate={(restaurant as Restaurant & { rate?: number }).rate}
                  time={restaurant.estimatedDeliveryTime ?? '30'}
                  tags={restaurant.tags ?? []}
                  baseFee={restaurant.baseFee}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile filters drawer ─────────────────────────────────────────── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
              <span className="font-bold text-gray-900">Filtres</span>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarFilters {...filterProps} />
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors text-sm"
              >
                Voir {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center pt-[130px]">
        <div className="text-gray-400 text-sm">Chargement...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
