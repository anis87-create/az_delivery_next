import React from 'react'
import { FaPizzaSlice, FaHamburger, FaFish, FaBirthdayCake, FaLeaf } from 'react-icons/fa';
import { MdHealthAndSafety, MdAccessTime, MdFastfood } from 'react-icons/md';
import { GiTacos, GiNoodles } from 'react-icons/gi';
import Image from 'next/image';

const iconMap = {
  pizza: FaPizzaSlice,
  burger: FaHamburger,
  sushi: FaFish,
  salad: FaLeaf,
  dessert: FaBirthdayCake,
  mexican: GiTacos,
  indian: MdFastfood,
  chinese: GiNoodles,
  healthy: MdHealthAndSafety
};

const Category = ({name, icon, img}) => {
  const IconComponent = iconMap[icon];
  
  return (
    <div className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group w-[117px] h-[117px]">
        <div className="w-full h-full relative">
          {img && (
            <Image alt={name} width={117} height={117} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" src={img}/>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300 flex flex-col items-center justify-center">
            <div className="text-center text-white transform transition-transform duration-300 group-hover:scale-110">
              <div className="text-lg sm:text-xl mb-2 drop-shadow-lg flex justify-center">
                {IconComponent && <IconComponent />}
              </div>
              <p className="text-xs sm:text-sm font-bold drop-shadow-md tracking-wide">{name}</p>
            </div>
          </div>
          <div className="absolute inset-0 ring-2 ring-transparent group-hover:ring-orange-400 transition-all duration-300 rounded-2xl"></div>
        </div>
    </div>
  )
}

export default Category