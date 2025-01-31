import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronLeft } from 'react-icons/fi';

function Sidebar({ isCollapsed, toggleCollapse }) {
  const location = useLocation();

  const menuItems = [
    { 
      icon: '/union.svg', 
      label: 'Patients', 
      path: '/patients',
      customIcon: true 
    },
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white transition-all duration-300 relative h-screen border-r border-gray-200`}>
      <button 
        onClick={toggleCollapse}
        className="absolute -right-4 top-8 z-50 -translate-x-1"
      >
        <img 
          src="/chevron-down.svg" 
          alt="toggle" 
          className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
        />
      </button>
      
      <div className="p-6">
        <h1 className={`text-2xl font-semibold text-primary ${isCollapsed ? 'hidden' : ''}`}>
          Neuralanalyzer
        </h1>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center px-6 py-3 text-base font-semibold relative ${
              location.pathname === item.path
                ? 'text-[#3C7187] bg-[#3C7187]/10'
                : 'text-gray-600 hover:bg-gray-100 hover:text-[#3C7187]'
            }`}
          >
            <div className="relative">
              {item.customIcon ? (
                <img 
                  src={item.icon} 
                  alt={item.label} 
                  className={`w-5 h-5 ${location.pathname === item.path ? 'filter-[#3C7187]' : ''}`} 
                />
              ) : (
                <span>{item.icon}</span>
              )}
              {item.badge && (
                <span className="absolute -top-2 -right-2 bg-red-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            {!isCollapsed && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="absolute bottom-0 w-full p-6">
          <Link 
            to="/settings" 
            className="flex items-center text-base font-semibold px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-[#3C7187]"
          >
            <div className="flex items-center gap-2">
              <img src="/settings.svg" alt="Settings" className="w-5 h-5" />
              <span>Settings</span>
            </div>
          </Link>
          <Link 
            to="/help" 
            className="flex items-center text-base font-semibold px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-[#3C7187]"
          >
            <div className="flex items-center gap-2">
              <img src="/help.svg" alt="Help" className="w-5 h-5" />
              <span>Help</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Sidebar;