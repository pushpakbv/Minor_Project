import React from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          TheCipher
        </Link>
        <div>
          <Link to="/create-post" className="mr-4 text-white hover:underline">
            Create Post
          </Link>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={() => {
                axios
                  .post('/auth/logout') // Ensure this matches the backend route
                  .then(() => {
                    localStorage.removeItem('token'); // Remove token from local storage
                    window.location.href = '/login'; // Redirect to login page
                  })
                  .catch((error) => {
                    console.error('Logout failed:', error); // Log error details
                  });
              }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
