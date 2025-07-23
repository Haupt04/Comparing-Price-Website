import React from 'react'
import { FaSearch, FaClipboardCheck, FaMoneyBillWave } from "react-icons/fa";


const HowItWorkSection = () => {
  return (
    <div id="how-it-works" className='py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-12 text-center'>How It Works</h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                <div className='flex flex-col items-center text-center'>
                    <div className='bg-green-600 rounded-full p-4 mb-4'>
                        <FaSearch className="h-8 w-8 text-white"/>
                    </div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>Search Product</h3>
                    <p className='text-gray-600'>Enter your product you're looking for in our search bar</p>
                </div>

                <div className='flex flex-col items-center text-center'>
                    <div className='bg-green-600 rounded-full p-4 mb-4'>
                        <FaClipboardCheck className='h-8 w-8 text-white' />
                    </div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>Compare Prices</h3>
                    <p className='text-gray-600'>We'll show you prices from both Amazon and Takealot side by side.</p>
                </div>
                
                <div className='flex flex-col items-center text-center'>
                    <div className='bg-green-600 rounded-full p-4 mb-4'>
                        <FaMoneyBillWave className='h-8 w-8 text-white'/> 
                    </div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>Save Money</h3>
                    <p className='text-gray-600'>Chose the best deal and save money on your purchase</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default HowItWorkSection