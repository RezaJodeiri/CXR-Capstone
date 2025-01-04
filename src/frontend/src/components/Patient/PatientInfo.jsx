import React from 'react';

function PatientInfo({ patient, activeTab, setActiveTab }) {
  const tabs = ['Overview', 'Medical Record', 'Report'];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Patient Info Section */}
      <div className="p-6">
        <div className="flex items-center gap-4">
          <img 
            src="/patient-avatar.jpg" 
            alt="Patient" 
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Marvin McKinney</h1>
              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-sm">ICU</span>
            </div>
            <div className="text-gray-600 text-sm">
              <span>Male · Age 32</span>
              <br />
              <span>Brain, Spinal Cord, and Nerve Disorders</span>
            </div>
          </div>
          {/* Vertical divider */}
          <div className="w-px h-12 bg-gray-200"></div>
          <div className="text-right text-sm text-gray-600">
            <p>marckinder@gmail.com</p>
            <p>+880 172524123123</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`py-4 relative ${
              activeTab === tab
                ? 'text-[#3C7187] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#3C7187]'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Horizontal divider below tabs */}
      <div className="border-b border-gray-200"></div>
    </div>
  );
}

export default PatientInfo; 