import { IoIosPricetag } from "react-icons/io";


const Navbar = () => {
  return (
    <nav className='bg-white shadow-md navbar'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-0'>
            <div className='flex justify-between h-16'>
                <div className='flex items-center'>
                    <div className='flex-shrink-0 flex items-center justify-center'>
                        {/* Money Sign Logo */}
                        <IoIosPricetag className="h-8 w-8 text-green-600" />
                        <span  className='ml-2 text-xl sm:text-lg md:text-base font-bold text-gray-800'>PriceCompare - Amazon vs Takealot</span>
                    </div>
                </div>
                <div className='hidden md:flex items-center'>
                    <a href='#home' className='px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600'>Home</a>
                    <a href='#popular-comparisons' className='px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600'>Featured Comparisons</a>
                    <a href='#how-it-works' className='px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600'>How It Works</a>
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar