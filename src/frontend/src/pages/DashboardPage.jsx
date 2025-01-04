import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/Authentication';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function DashboardPage() {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleCollapse={() => setIsCollapsed(!isCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex-1 p-8">
          {/* Rest of dashboard content */}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;