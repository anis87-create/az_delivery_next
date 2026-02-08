'use client'
import React from 'react'

const SpecialOffer = React.memo(({ offer }) => {
  return (
    <div className='group overflow-hidden shadow-card rounded-2xl my-4 cursor-pointer transition-all duration-300 ease-in-out shadow-[0px_1px_4px_rgba(0,0,0,0.16)] hover:shadow-xl hover:scale-105 hover:-translate-y-2'>
      <div className="relative overflow-hidden">
        <div className="absolute w-full h-full top-0 left-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300 z-10"></div>
        <img src={offer.img} alt={offer.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />

        {/* Discount badge */}
        <div className="absolute top-4 right-4 z-20">
          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
            -{offer.discount}%
          </span>
        </div>
      </div>

      <div className="p-4 group-hover:bg-gray-50 transition-colors duration-300">
        <h3 className='font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300'>{offer.name}</h3>
        <p className='text-sm text-gray-500 mt-1'>{offer.restaurant}</p>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-lg font-bold text-orange-600">{offer.newPrice} €</span>
          <span className="text-sm text-gray-400 line-through">{offer.oldPrice} €</span>
        </div>
      </div>
    </div>
  )
})

SpecialOffer.displayName = 'SpecialOffer';

export default SpecialOffer;
