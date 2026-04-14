import React from 'react'
import Image from 'next/image';

const Category = ({ name, img }) => {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group">
      {/* Circle image */}
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-orange-400 transition-all duration-200">
        {img ? (
          <Image
            alt={name}
            width={80}
            height={80}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            src={img}
          />
        ) : (
          <div className="w-full h-full bg-orange-50 flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
      </div>
      {/* Name */}
      <span className="text-xs font-medium text-gray-700 group-hover:text-orange-500 transition-colors text-center">
        {name}
      </span>
    </div>
  );
};

export default Category;
