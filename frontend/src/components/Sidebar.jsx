import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AiOutlineHome, AiFillHome, AiFillFire, AiOutlineCompass, AiOutlineFileText } from 'react-icons/ai';

const Sidebar = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Don't show sidebar on login and signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const navItems = [
    {
      to: '/',
      icon: location.pathname === '/' ? AiFillHome : AiOutlineHome,
      label: 'Home'
    },
    {
      to: '/popular',
      icon: AiFillFire,
      label: 'Popular'
    },
    {
      to: '/explore',
      icon: AiOutlineCompass,
      label: 'Explore'
    }
  ];

  return (
    <div className={`w-64 fixed top-16 bottom-0 left-0 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    } border-r ${
      isDarkMode ? 'border-gray-800' : 'border-gray-200'
    } z-10`}>
      <div className="flex flex-col h-full pt-4">
        <nav className="space-y-1 px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                location.pathname === to
                  ? isDarkMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-900'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </Link>
          ))}
        </nav>

        {isAuthenticated && (
          <>
            <div className="mt-8 px-2">
              <h3 className={`px-3 text-xs font-semibold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              } uppercase tracking-wider`}>
                YOUR CONTENT
              </h3>
              <div className="mt-1">
                <Link
                  to="/your-posts"
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/your-posts'
                      ? isDarkMode
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-900'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <AiOutlineFileText className="h-5 w-5 mr-3" />
                  Your Posts
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
