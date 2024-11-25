import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          TheCipher  <img
            src="../logo.jpeg"
            className="mr-3 h-12 px-2"
            alt="Logo"
          />
        </Link>

        <div>
          {isAuthenticated ? (
            <>
              <Link to="/create-post" className="mr-4 text-white hover:underline">
                Create Post
              </Link>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
