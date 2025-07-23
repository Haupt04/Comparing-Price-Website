import { useRef, useState } from 'react'
import { MdMarkEmailRead } from "react-icons/md";
import { axiosInstance } from '../utils/axios';


const NewsletterComponents = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('')
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post(`/email`, { email });
            console.log(res.data.message);
            setMessage(res.data.message);
            setEmail('');
        } catch (error) {
            console.log("Error", error)
            alert("Failed to send email")
        }

    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='bg-green-600 rounded-2xl p-8 md:p-12 shadow-xl'>
                <div className='md:flex md:items-center md:justify-between'>
                    <div className='md:w-1/2 mb-6 md:mb-0'>
                        <h2 className='text-2xl md:text-3xl font-bold text-white mb-2'>Stay Updated on the Best Deals</h2>
                        <p className='text-green-100'>Get notified when prices drop on products you're interested in.</p>
                    </div>
                    <div className='md:w-1/2'>
                        {message && (
                            <div className='flex items-center text-amber-500 mb-2 text-3xl sm:text-base'>
                            <MdMarkEmailRead className='mr-2 text-3xl '/> 
                            <p>{message}</p>
                            </div>
                            )}
                        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row'>
                            <input type='email' value={email} placeholder='Enter your email' required className='flex-grow px-4 py-3 rounded-lg sm:rounded-r-none focus:outline-none text-gray-700 bg-white' onChange={(e) => setEmail(e.target.value)}/> 
                            <button className='mt-2 sm:mt-0 bg-yellow-500 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg sm:rounded-l-none font-medium transition duration-300'>
                                Subscribe
                            </button>
                        </form>
                        <p className='text-base text-green-200 mt-2'>We respect your privacy. Unsubscribe at any time</p>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default NewsletterComponents