'use client'
import React from 'react'
import Image from 'next/image'

const SpecialOffer = React.memo(({ offer }) => {
  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden rounded-xl mb-3">
        <Image
          src={offer.img}
          alt={offer.name}
          width={400}
          height={192}
          unoptimized
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount badge */}
        <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          -{offer.discount}%
        </span>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-orange-500 transition-colors truncate">
          {offer.name}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{offer.restaurant}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold text-orange-500">{offer.newPrice} €</span>
          <span className="text-xs text-gray-400 line-through">{offer.oldPrice} €</span>
        </div>
      </div>
    </div>
  );
});

SpecialOffer.displayName = 'SpecialOffer';
export default SpecialOffer;
