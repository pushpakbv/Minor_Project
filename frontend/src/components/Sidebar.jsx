import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AiOutlineHome, AiFillFire, AiOutlineCompass, AiOutlinePlus } from 'react-icons/ai';

const Sidebar = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { icon: AiOutlineHome, label: 'Home', path: '/' },
    { icon: AiFillFire, label: 'Popular', path: '/popular' },
    { icon: AiOutlineCompass, label: 'Explore', path: '/explore' },
  ];

  // Don't show sidebar on login and signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const CustomFeedSection = () => (
    <div className="mt-6">
      <div className={`px-6 py-3 text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        CUSTOM FEEDS
      </div>
      <button
        className={`w-full px-6 py-2 flex items-center space-x-2 text-sm hover:bg-opacity-10 transition-colors duration-200 ${
          isDarkMode ? 'hover:bg-gray-300 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <AiOutlinePlus className="w-5 h-5" />
        <span>Create a custom feed</span>
      </button>
    </div>
  );

  return (
    <div className={`w-64 h-screen fixed left-0 top-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-r ${
      isDarkMode ? 'border-gray-800' : 'border-gray-200'
    } overflow-y-auto`}>
      <nav className="py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-6 py-2 flex items-center space-x-2 ${
                active
                  ? isDarkMode
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-900'
                  : isDarkMode
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        <div className="border-b border-gray-200 my-4" />

        <CustomFeedSection />
      </nav>
    </div>
  );
};

export default Sidebar;
