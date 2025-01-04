import React from 'react';
import { useAuth } from '../context/Authentication';
import { FiChevronDown } from 'react-icons/fi';
import { useLocation, useParams, Link } from 'react-router-dom';
import { IoChevronForward } from "react-icons/io5";

function TopBar() {
  const { user } = useAuth();
  const location = useLocation();
  const params = useParams();
  
  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const items = [];

    const segments = path.split('/').filter(Boolean);

    if (segments.length === 0) {
      items.push({ label: 'Dashboard', path: '/dashboard' });
      return items;
    }

    switch(segments[0]) {
      case 'dashboard':
        items.push({ label: 'Dashboard', path: '/dashboard' });
        break;
      case 'prediction':
        items.push({ label: 'Prediction', path: '/prediction' });
        break;
      case 'patients':
        items.push({ label: 'Patients', path: '/patients' });
        if (segments[1]) {
          items.push({ 
            label: 'Patient Detail', 
            path: `/patients/${segments[1]}` 
          });
          if (segments[2] === 'create-record') {
            items.push({ 
              label: `Record: #${params.recordId || 'New'}`, 
              path: null 
            });
          }
        }
        break;
      default:
        items.push({ label: 'Dashboard', path: '/dashboard' });
    }

    return items;
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };
  const getTitle = () => {
    const items = getBreadcrumbItems();
    if (items.length === 0) {
      return "Dashboard"; // Default title
    }
    
    if (location.pathname.includes('/patients/')) {
      return "Patient: Marvin McKinney";
    }
    
    return items[0].label;
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="px-6">
        <div className="pt-4 flex justify-between items-center">
          <h1 className="text-xl font-medium">
            {getTitle()}
          </h1>
          
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src={user?.avatar || 'https://via.placeholder.com/40'} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-medium">{user?.name || 'Dr Amirul Haque'}</span>
              <span className="text-sm text-gray-500">{user?.role || 'Urologist'}</span>
            </div>
            <FiChevronDown className="ml-1 text-gray-400" />
          </div>
        </div>

        {/* Breadcrumb - only show if we have more than one item */}
        {getBreadcrumbItems().length > 1 && (
          <div className="pb-4">
            <div className="flex items-center gap-2 text-sm">
              {getBreadcrumbItems().map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <IoChevronForward className="text-gray-400" />}
                  {item.path ? (
                    <Link 
                      to={item.path}
                      className={isActivePath(item.path) ? "text-[#3C7187]" : "text-gray-500"}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-[#3C7187]">{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;