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

  const tabs = [
    { id: 'Overview', icon: '/health.svg', label: 'Clinical History' },
    { id: 'Medical Record', icon: '/info.svg', label: 'Treatment Plan' },
    { id: 'Medication', icon: '/report.svg', label: 'Report' }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'Overview':
        return <PatientOverview />;
      case 'Medical Record':
        return <PatientMedicalRecords />;
      case 'Medication':
        return <div className="p-6">Medication Content</div>;
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
              setActiveTab={setActiveTab}
              tabs={tabs}
            />
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetailsPage;