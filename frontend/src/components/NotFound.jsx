import { MdErrorOutline } from 'react-icons/md';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <MdErrorOutline className="text-red-500 text-6xl mb-4" />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
