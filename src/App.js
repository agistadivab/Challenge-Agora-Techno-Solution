import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MapWidget from './components/MapWidget';
import Chart1Widget from './components/Chart1Widget';
import Chart2Widget from './components/Chart2Widget';
import DataTableWidget from './components/DataTableWidget';

function App() {
  const [activeMenu, setActiveMenu] = useState('menu1');

  const renderContent = () => {
    switch (activeMenu) {
      case 'menu1':
        return (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-t-xl shadow-lg border-b border-gray-200 p-6 pb-4">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>

            {/* Maps Section - Top */}
            <div>
              <MapWidget />
            </div>

            {/* Charts Section - Middle */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1 - Left */}
              <div>
                <Chart1Widget />
              </div>

              {/* Chart 2 - Right */}
              <div>
                <Chart2Widget />
              </div>
            </div>

            {/* Data Table Section - Bottom */}
            <div>
              <DataTableWidget />
            </div>
          </div>
        );
      
      case 'menu2-1':
        return (
          <div className="space-y-6">
          <div className="bg-white rounded-t-xl shadow-lg border-b border-gray-200 p-6 pb-4">
            <h1 className="text-2xl font-bold text-gray-800">Post Details</h1>
          </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">Welcome to Challenge App</h1>
            <p className="text-gray-600 mt-2">Select a menu from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;