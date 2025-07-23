
export const HeroSection = ({query, setQuery, handleSubmit}) => {
  return (
    <div id="home" className='gradient-bg py-12 md:py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6'>Compare Prices Instantly</h1>
            <p className='text-xl md:text-xl text-green-100 mb-8 max-w-3xl mx-auto'>Find the best deals by comparing prices</p>

            {/* Search Bar */}
            <div className='max-w-3xl mx-auto'>
                <div className='flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden'>
                    <input type='text' placeholder='Search for products...' className='bg-white flex-grow px-6 py-4 focus:outline-none text-gray-700' onChange={e => setQuery(e.target.value)} value={query}/>
                    <button className='bg-green-800 hover:bg-green-900 text-white px-8 py-4 font-medium transition duration-300' onClick={handleSubmit}>
                        Compare Now
                    </button>
                </div>
                <div className='flex justify-center mt-4 space-x-4'>
                    <div className='flex items-center bg-white/20 rounded-full px-4 py-1'>
                        <div className='h-3 w-3 amazon-bg rounded-full mr-2'></div>
                        <span className='text-white text-base'>Amazon</span>
                    </div>
                    <div className='flex items-center bg-white/20 rounded-full px-4 py-1'>
                        <div className='h-3 w-3 takealot-bg rounded-full mr-2'></div>
                        <span className='text-white text-base'>Takealot</span>
                    </div>
                </div>
            </div>
            <p className='text-xl md:text-xl text-white max-w-3xl mx-auto pt-5'>Disclaimer: Product data on this site is collected via web scraping from Takealot and Amazon, intended solely for educational and non-commercial use.</p>
        </div>
    </div>
  )
}
