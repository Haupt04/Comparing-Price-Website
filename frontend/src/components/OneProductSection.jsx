import { FaExternalLinkSquareAlt } from "react-icons/fa";

const DetailedComponentSection = ({featureProduct, loading}) => {
    if (loading) return null;
    if (!featureProduct) return null;



  return (
    <div id="popular-comparisons" className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white rounded-xl shadow-md my-12' >
        <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center'>Featured Comparison</h2>
        {!loading && (
        <>
        <div className='flex flex-col md:flex-row'>
            {/* Product Image */}
            <div className='md:w-1/3 flex justify-center items-start p-4'>
                <img src={featureProduct.takealot.image} className='max-h-64 object-contain fill' />
            </div>

            {/* Comparison Table */}
            <div className='md:w-2/3 p-4'>
                <h3 className='text-xl font-semibold text-gray-800 mb-4'>{featureProduct.takealot.title}</h3>

                <div className='overflow-x-auto'>
                    <table className='table-auto w-full divide-y divide-gray-200'>
                        <thead>
                            <tr>
                                <th className='px-8 py-6 bg-green-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Feature</th>
                                <th className='px-8 py-6 bg-green-50 text-left text-xs font-medium amazon-color uppercase tracking-wider'>Amazon</th>
                                <th className='px-8 py-6 bg-green-50 text-left text-xs font-medium takealot-color uppercase tracking-wider'>Takealot</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            <tr>
                                <td className='px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-900'>Price</td>
                                <td className='px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-700 amazon-color'>{featureProduct.amazon.price}</td>
                                <td className='px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-700 takealot-color'>{featureProduct.takealot.price}</td>
                            </tr>
                            <tr>
                                <td className='px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-900'>Shipping</td>
                                <td className='px-8 py-6 whitespace-nowrap text-sm text-gray-700'>Free Delivery</td>
                                <td className='px-8 py-6 whitespace-nowrap text-sm text-gray-700'>R35 - R60</td>
                            </tr>
                            <tr>
                                <td className='px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-900'>Delivery Time</td>
                                <td className='px-8 py-6 whitespace-nowrap text-sm text-gray-700'>1 - 3 days</td>
                                <td className='px-8 py-6 whitespace-nowrap text-sm text-gray-700'>2 - 3 days or 5 - 7 days</td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
                <div className='mt-6 flex flex-col sm:flex-row justify-between'>
                    <div className='mb-4 sm:mb-0'>
                        <div className='text-sm text-gray-500 mb-1'>Best Deals</div>
                        <div className='flex items-center'>
                            {(() => {
                                const takealotPrice = Number(featureProduct.takealot.price.replace(/[^0-9.-]+/g, ''));
                                const amazonPrice = Number(featureProduct.amazon.price.replace(/[^0-9.-]+/g, ''));
                                const saving = Math.abs(takealotPrice - amazonPrice).toFixed(2);

                                if (saving === "0.00"){
                                    return (
                                        <>
                                        <div className={`h-4 w-4 bg-green-700 rounded-full mr-2`}></div>
                                        <span className='font-bold'>No Price Difference</span>
                                        </>
                                    )
                                } else {
                                    const bigger = Math.max(takealotPrice, amazonPrice)
                                    const brandSeller = bigger == takealotPrice ? "Amazon": "Takealot";
                                    return (
                                        <>
                                            <div className={`h-4 w-4 ${brandSeller === "Amazon"? "amazon": "takealot"}-bg rounded-full mr-2`}></div>
                                            <span className='font-bold'>{brandSeller}</span>
                                            <span className='ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full'>Saving of R{saving}</span>
                                        </>
                                    )
                                }                            
                            })()}
                        </div>
                    </div>
                    <div className='flex space-x-3'>
                        <a href={featureProduct.amazon.link}  target="_blank" rel="noopener noreferrer" className='amazon-bg hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center'>
                            <span>View Amazon</span>
                            <FaExternalLinkSquareAlt className="ml-2 h-4 w-4"/>
                        </a>
                        <a href={featureProduct.takealot.link}  target="_blank" rel="noopener noreferrer" className='takealot-bg hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center'>
                            <span>View Takealot</span>
                            <FaExternalLinkSquareAlt className="ml-2 h-4 w-4"/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        </>)
    }
    </div>
  )
}

export default DetailedComponentSection