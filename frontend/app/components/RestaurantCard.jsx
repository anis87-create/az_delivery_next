'use client'
import React from 'react'
import Link from 'next/link';
import { HiOutlineHeart } from 'react-icons/hi';
import { useAppSelector } from '../hooks/hooks';
import Image from 'next/image';
import { MdAccessTime } from 'react-icons/md';
import { FaStar } from 'react-icons/fa';

const RestaurantCard = React.memo(({ id, img, name, rate, time, tags, baseFee = '' }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <Link href={`/restaurants/${id}`} className="block group cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden rounded-xl mb-3">
        {img && img.startsWith('https://') ? (
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

        {/* Favorite button */}
        {isAuthenticated && (
          <button
            className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform"
            onClick={e => { e.preventDefault(); e.stopPropagation(); }}
            aria-label="Add to favorites"
          >
            <HiOutlineHeart className="text-gray-600 w-4 h-4" />
          </button>
        )}
      </div>

      {/* Info */}
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
            {time} min
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
});

RestaurantCard.displayName = 'RestaurantCard';
export default RestaurantCard;
