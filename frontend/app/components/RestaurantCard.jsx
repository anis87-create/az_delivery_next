'use client'
import React from 'react'
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { HiChevronRight, HiOutlineHeart } from 'react-icons/hi';
import { useAppSelector } from '../hooks.ts';
import Image from 'next/image';

const RestaurantCard = React.memo(({ id, img, name, rate, time, tags, isActive = false }) => {
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <Link href={`/restaurant/${id}`} className='block'>
      <div className='group overflow-hidden shadow-card rounded-2xl my-4 cursor-pointer transition-all duration-300 ease-in-out shadow-[0px_1px_4px_rgba(0,0,0,0.16)] hover:shadow-xl hover:scale-105 hover:-translate-y-2'>
        <div className="relative overflow-hidden">
          <div className="absolute w-full h-full top-0 left-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 z-10"></div>
          {img && (
            <img src={img} alt={name} width={400} height={192} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
          )}

          {/* Heart Icon - Top Left */}
          {isAuthenticated && <button
            className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
            aria-label="Add to favorites"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle favorites logic here
            }}
          >
            <HiOutlineHeart className={`${isActive ? "fill-current hover:text-orange-600" : "text-orange-600 text-xl hover:fill-current"} text-orange-600 text-xl hover:fill-current`} />
          </button>
          }

          {/* Rating Badge - Top Right */}
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
            <div className='bg-white/90 backdrop-blur-sm py-2 px-3 rounded-full flex items-center gap-1 shadow-lg'>
              <FaStar className="text-yellow-500 text-sm" />
              <span className="text-sm font-semibold">{rate}</span>
            </div>
          </div>
        </div>
        <div className="p-4 group-hover:bg-gray-50 transition-colors duration-300">
          <div className='flex justify-between mb-2'>
            <h3 className='font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300'>{name}</h3>
            <div className='bg-gray-200 py-[3px] px-2 rounded-[15px] flex items-center gap-1 group-hover:bg-orange-100 transition-colors duration-300'>
              <MdAccessTime className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors duration-300" />
              <span className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors duration-300">{time} min</span>
            </div>
          </div>
          <p className='mb-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300'>{tags.join(', ')}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              <span className="text-sm">Voir le menu</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
                <HiChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
})

RestaurantCard.displayName = 'RestaurantCard';

export default RestaurantCard;