'use client'
import React from 'react'
import { FaStar } from 'react-icons/fa';
import { HiOutlineHeart } from 'react-icons/hi';

const PopularDish = React.memo(({ dish }) => {
  return (
    <div className='group overflow-hidden shadow-card rounded-2xl my-4 cursor-pointer transition-all duration-300 ease-in-out shadow-[0px_1px_4px_rgba(0,0,0,0.16)] hover:shadow-xl hover:scale-105 hover:-translate-y-2'>
      <div className="relative overflow-hidden">
        <div className="absolute w-full h-full top-0 left-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 z-10"></div>
        <img src={dish.img} alt={dish.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />

        {/* Favorite button */}
        <button
          className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
          aria-label="Add to favorites"
          onClick={(e) => e.stopPropagation()}
        >
          <HiOutlineHeart className="text-orange-600 text-xl hover:fill-current" />
        </button>

        {/* Rating badge */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <div className='bg-white/90 backdrop-blur-sm py-2 px-3 rounded-full flex items-center gap-1 shadow-lg'>
            <FaStar className="text-yellow-500 text-sm" />
            <span className="text-sm font-semibold">{dish.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-4 group-hover:bg-gray-50 transition-colors duration-300">
        <h3 className='font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300'>{dish.name}</h3>
        <p className='text-sm text-gray-500 mt-1'>{dish.restaurant}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-orange-600">{dish.price} €</span>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <FaStar className="text-yellow-500" />
            <span>{dish.rating}</span>
          </div>
        </div>
      </div>
    </div>
  )
})

PopularDish.displayName = 'PopularDish';

export default PopularDish;
