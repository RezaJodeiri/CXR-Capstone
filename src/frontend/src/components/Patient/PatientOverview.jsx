import React, { useState, useEffect } from "react";
import {
  getMedicalRecordsForPatient,
  getMedicalRecord,
} from "../../services/api";
import { useAuth } from "../../context/Authentication";

function PatientOverview({ patient }) {
  const { token } = useAuth();
  const [latestRecord, setLatestRecord] = useState(null);

  useEffect(() => {
    getMedicalRecordsForPatient(patient.id, token).then((data) => {
      data.sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated));
      const firstRecordId = data[0]?.id;
      if (!firstRecordId) return;
      getMedicalRecord(patient.id, firstRecordId, token).then((fullRecord) => {
        if (!data) return;
        setLatestRecord(fullRecord);
      });
    });
  }, [patient]);

  const prescriptions = latestRecord?.prescriptions?.data || [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-2 px-6 pt-6 mb-4">
            <div className="flex items-center gap-2 bg-[#F8F8F8] px-3 py-1.5 rounded-full">
              <img src="/health.svg" className="w-5 h-5" />
              <span className="font-medium text-[#7F7F7F]">Clinical Notes</span>
            </div>
          </div>
          <div className="px-6 pb-6">
            <h1>{latestRecord?.note}</h1>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-2 px-6 pt-6 mb-4">
            <div className="flex items-center gap-2 bg-[#F8F8F8] px-3 py-1.5 rounded-full">
              <img src="/info.svg" alt="Treatment Plan" className="w-5 h-5" />
              <span className="font-medium text-[#7F7F7F]">Treatment plan</span>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-6">
              {prescriptions.map((treatment, index) => (
                <div key={index} className={index !== 0 ? "pt-6 border-t" : ""}>
                  <div className="flex">
                    <h3 className="font-semibold">{`${treatment.dosage}`} </h3>
                    <p>
                      -
                      {` ${treatment.dosageFrequency}@${
                        treatment.time || "8PM"
                      }`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Section
      <div>
        <div className="border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-2 px-6 pt-6 mb-4">
            <div className="flex items-center gap-2 bg-[#F8F8F8] px-3 py-1.5 rounded-full">
              <img src="/report.svg" alt="AI Analysis" className="w-5 h-5" />
              <span className="font-medium text-[#7F7F7F]">AI Analysis</span>
            </div>
          </div>
          <div className="px-6 pb-6">
            This is another section that needed to be filled out
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default PatientOverview;
