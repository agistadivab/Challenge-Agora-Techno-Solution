import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  ChartBarIcon,
  FolderIcon,
  DocumentIcon,
  MapIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

import logo from '../assets/logopa.png'; 

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const [isMenu2Open, setIsMenu2Open] = useState(false);

  return (
    <div className="w-64 bg-gray-800 text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img 
            src={logo} 
            alt="PostAnalytics Logo" 
            className="w-20 h-20 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold">Post Analytics</h1>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {/* Menu 1 */}
          <li>
            <button
              onClick={() => setActiveMenu('menu1')}
              className={`w-full text-left p-3 rounded flex items-center space-x-3 ${
                activeMenu === 'menu1' ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <ChartBarIcon className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </button>
          </li>
          
          {/* Menu 2 dengan dropdown */}
          <li>
            <button
              onClick={() => setIsMenu2Open(!isMenu2Open)}
              className="w-full text-left p-3 rounded flex items-center justify-between hover:bg-gray-700"
            >
              <div className="flex items-center space-x-3">
                <FolderIcon className="w-5 h-5" />
                <span className="font-medium">Content</span>
              </div>
              {isMenu2Open ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </button>
            
            {/* Submenu Menu 2-1 */}
            {isMenu2Open && (
              <ul className="ml-8 mt-1 space-y-1">
                <li>
                  <button
                    onClick={() => setActiveMenu('menu2-1')}
                    className={`w-full text-left p-2 rounded flex items-center space-x-3 text-sm ${
                      activeMenu === 'menu2-1' ? 'bg-gray-700' : 'hover:bg-gray-700'
                    }`}
                  >
                    <DocumentIcon className="w-4 h-4" />
                    <span className="font-medium">Post Detail</span>
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
      
      {/* Sign Out Button */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full p-3 rounded flex items-center space-x-3 bg-gray-700 hover:bg-gray-600">
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;