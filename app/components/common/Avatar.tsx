'use client'

import React from 'react';
import Image from "next/image";
type ReactProps = {
    src?: string,
    name: string,
    size: string,
    className?:string,
    borderClass?: string,
    fontSize: string
}
const Avatar = ({
  src,
  name,
  size = 'w-8 h-8',
  className = '',
  borderClass = 'border-2 border-green-500',
  fontSize
}:ReactProps) => {
  const getInitials = (fullName: string) => {
    if (!fullName) return 'U';
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <>
      {src && src.trim() !== "" ? (
        <Image
          src={src}
          alt="avatar"
          width={50}
          height={50}
          className={`${size} rounded-full ${borderClass} ${className}`}
        />
      ) : (
        <div
          className={`${size} rounded-full ${borderClass} bg-gray-300 flex items-center justify-center text-gray-700 font-medium ${fontSize}  ${className}`}
        >
          {initials}
        </div>
      )}
    </>
  );
};

export default Avatar;