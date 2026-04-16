'use client'
import React from 'react'
import Image from 'next/image'
import { FaStar } from 'react-icons/fa';
import { HiOutlineHeart } from 'react-icons/hi';

const PopularDish = React.memo(({ dish }) => {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden rounded-xl mb-3">
        <Image
          src={dish.img}
          alt={dish.name}
          width={400}
          height={192}
          unoptimized
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Favorite */}
        <button
          className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform"
          aria-label="Add to favorites"
          onClick={e => e.stopPropagation()}
        >
          <HiOutlineHeart className="text-gray-600 w-4 h-4" />
        </button>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-orange-500 transition-colors truncate">
          {dish.name}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{dish.restaurant}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-orange-500">{dish.price} TND</span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <FaStar className="text-yellow-400 w-3 h-3" />
            {dish.rating}
          </span>
        </div>
      </div>
    </div>
  );
});

PopularDish.displayName = 'PopularDish';
export default PopularDish;
