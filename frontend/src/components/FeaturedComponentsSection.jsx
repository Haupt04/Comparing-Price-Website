import { FaStar } from "react-icons/fa";
import { ClockLoader } from 'react-spinners';


const FeaturedComponentsSection = ({matches=[], loading, setFeatureProduct, featureProduct}) => {


    if (loading) {
    return (
       <div className="flex flex-col justify-center items-center min-h-screen px-4 sm:px-4 lg:px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Popular Comparisons
            </h2>
            <p className="text-xl text-gray-800 mb-4 max-w-2xl">
                Please note that results may take a few minutes to load and may not be 100% accurate.
                Please do your own research before making any purchase.
            </p>
            <p className="text-gray-600 mb-6">Loading comparisons...</p>
            <ClockLoader color="#25db1b" size={60} />
        </div>
    )
    }

  if (!matches.length) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center'>
        <p className='text-gray-600 text-xl md:text-3xl '>No popular comparisons available please use the search bar to search.</p>
      </div>
    )
    }
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-8'>
        <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center'>Popular Comparisons</h2>
        <p className="text-xl md:text-xl text-gray-800 text-center  mb-8 mx-auto">Please note that results may take a few minutes to load and may not completely be accurate. Please do your own research.</p>
        {/* Comparison Card */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>

            {matches.map((match, index) => (
                <div className='bg-white rounded-xl shadow-md overflow-hidden transition duration-300 card-hover flex flex-col h-full' key={index}>
                <div className='p-6 flex flex-col flex-grow'>
                    <div className='w-[280px] h-[280px] mx-auto mb-4 flex items-center justify-center overflow-hidden'>
                        <img src={match.takealot.image} alt={match.takealot.title} className='w-full h-full object-contain' />
                    </div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-2 truncate max-w-full'alt={match.takealot.title} title={match.takealot.title} >{match.takealot.title}</h3>
                    <div className='flex justify-between items-center border-t border-gray-100 pt-4'>
                        <div>
                            <div className='flex items-center'>
                                <div className='h-3 w-3 amazon-bg rounded-full mr-2'></div>
                                <span className='text-sm font-medium amazon-color'>{match.amazon.price}</span>
                            </div>
                            <div className='flex items-center'>
                                <div className='h-3 w-3 takealot-bg rounded-full mr-2'></div>
                                <span className='text-sm font-medium takealot-color'>R {Number(match.takealot.price.replace(/[^0-9.-]+/g, '')).toFixed(2)}</span>
                            </div>
                        </div>
                       <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            {(() => {
                                const takealotPrice = Number(match.takealot.price.replace(/[^0-9.-]+/g, ''));
                                const amazonPrice = Number(match.amazon.price.replace(/[^0-9.-]+/g, ''));
                                const saving = Math.abs(takealotPrice - amazonPrice).toFixed(2);

                                return saving === "0.00"
                                ? "No price difference"
                                : `Save R ${saving}`;
                            })()}
                        </div>
                    </div>
                        <button value={featureProduct} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-300" onClick={() => setFeatureProduct(match)}>
                            View Comparison
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default FeaturedComponentsSection