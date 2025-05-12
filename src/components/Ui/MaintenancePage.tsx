import React from 'react';
import { Link } from 'react-router-dom';

const SiteMaintenancePage: React.FC = () => {
  // Log when maintenance page renders for debugging
  console.log("Maintenance page rendered");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-yellow-500">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Unavailable</h2>
          <p className="text-gray-600 mb-6">
            This page is currently under maintenance or has been disabled by the administrator.
            Please try again later or visit another section of our website.
          </p>
          
          <div className="flex flex-col space-y-3">
            <Link 
              to="/"
              className="w-full px-4 py-2 text-white font-medium bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Return to Homepage
            </Link>
            
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMaintenancePage;