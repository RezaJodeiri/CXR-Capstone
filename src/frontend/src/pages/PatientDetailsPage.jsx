import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import PatientInfo from '../components/Patient/PatientInfo';
import PatientOverview from '../components/Patient/PatientOverview';
import PatientMedicalRecords from '../components/Patient/PatientMedicalRecords';
import { IoChevronForward } from "react-icons/io5";

function PatientDetailsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 200);
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Overview':
        return <PatientOverview />;
      case 'Medical Record':
        return <PatientMedicalRecords />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex-1 bg-gray-100 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <PatientInfo 
              patient={{}} 
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
            <div 
              className={`
                transition-all duration-200 ease-in-out
                ${isTransitioning 
                  ? 'opacity-0 translate-y-1' 
                  : 'opacity-100 translate-y-0'
                }
              `}
            >
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetailsPage;