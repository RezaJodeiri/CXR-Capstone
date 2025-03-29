import _ from "lodash";
import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import PatientInfo from "../components/Patient/PatientInfo";
import PatientOverview from "../components/Patient/PatientOverview";
import PatientMedicalRecords from "../components/Patient/PatientMedicalRecords";
import { useParams } from "react-router-dom";
import { getPatientById } from "../services/api";

function PatientDetailsPage() {
  const { id: patientId } = useParams();
  const [patient, setPatient] = useState({});
  const [activeTab, setActiveTab] = useState("Overview");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    getPatientById(patientId).then((data) => setPatient(data));
  }, []);

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 200);
  };

  const renderTabContent = (patient) => {
    switch (activeTab) {
      case "Overview":
        return <PatientOverview />;
      case "Medical Record":
        return <PatientMedicalRecords patient={patient} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {!_.isEmpty(patient) && (
            <PatientInfo
              patient={patient}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
          )}
          <div
            className={`
              transition-all duration-200 ease-in-out
              ${
                isTransitioning
                  ? "opacity-0 translate-y-1"
                  : "opacity-100 translate-y-0"
              }
            `}
          >
            {renderTabContent(patient)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetailsPage;
