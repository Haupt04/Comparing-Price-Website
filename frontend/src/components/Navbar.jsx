import React from 'react'
import { IoIosPricetag } from "react-icons/io";

const Navbar = () => {
  return (
    <nav className='bg-white shadow-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between h-16'>
                <div className='flex items-center'>
                    <div className='flex-shrink-0 flex items-center justify-center'>
                        {/* Money Sign Logo */}
                        <IoIosPricetag className="h-8 w-8 text-green-600" />
                        <span className='ml-2 text-xl font-bold text-gray-800'>PriceCompare - Amazon vs Takealot</span>
                    </div>
                </div>
                <div className='flex items-center'>
                    {/* Need to change a to LINK */}
                    <a href='#' className='px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600'>Home</a>
                    <a href='#' className='px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600'>Categories</a>
                    <a href='#' className='px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600'>Deals</a>
                    <a href='#' className='px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600'>About</a>
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar