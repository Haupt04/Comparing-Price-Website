import { IoIosPricetag } from "react-icons/io";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                <div>
                    <div className='flex items-center mb-4'>
                        <IoIosPricetag /> 
                        <span className='ml-2 text-xl font-bold'>PriceCompare</span>
                    </div>
                    <p className='text-gray-400 text-sm'>Find the best deals by comparing prices between Amazon and Takealot</p>
                </div>
                <div>
                    <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
                    <ul className='space-y-2'>
                        {/* Change to the links */}
                        <li><a href='a' className='text-gray-400 hover:text-white transition duration-300'>Home</a></li>
                        <li><a href='a' className='text-gray-400 hover:text-white transition duration-300'>Deals</a></li>
                        <li><a href='a' className='text-gray-400 hover:text-white transition duration-300'>About Us</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className='text-lg font-semibold mb-4'>Help & Support</h3>
                    <ul className='space-y-2'>
                        {/* Change to the LInKS */}
                        <li><a href='a' className='text-gray-400 hover:text-white transition duration-300'>FAQ</a></li>
                        <li><a href='a' className='text-gray-400 hover:text-white transition duration-300'>Contact Us</a></li>
                        <li><a href='a' className='text-gray-400 hover:text-white transition duration-300'>Privacy Policy</a></li>
                        <li><a href='a' className='text-gray-400 hover:text-white transition duration-300'>Terms of Services</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className='text-lg font-semibold mb-4'>Connect With Us</h3>
                    <div className='flex space-x-4'>
                        {/* Change to Link */}
                        <a href='#' className='text-gray-400 hover:text-white transition duration-300'>
                            <FaFacebook />
                        </a>
                        <a href='#' className='text-gray-400 hover:text-white transition duration-300'>
                            <FaInstagram /> 
                        </a>
                        <a href='#' className='text-gray-400 hover:text-white transition duration-300'>
                            <FaLinkedin /> 
                        </a>
                    </div>

                    <div className='mt-4'>
                        <p className='text-gray-400 text-sm'>Please note that this website is made for educational purposes.</p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer