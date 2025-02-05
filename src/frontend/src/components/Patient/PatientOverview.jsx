import React, { useEffect, useState } from "react";
import { getMedicalRecordsForPatient } from "../../services/api";
import { useAuth } from "../../context/Authentication";

function PatientOverview({ patient }) {
  const { token } = useAuth();
  const [firstRecord, setFirstRecord] = useState(null);

  useEffect(() => {
    getMedicalRecordsForPatient(patient.id, token, 1).then((records) => {
      setFirstRecord(records[0]);
    });
  }, []);

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
            <p>
              {firstRecord?.note ||
                "This user doesn't have any outstanding note"}
            </p>
          </div>
        </div>
      </div>

      {/* Treatment Plan Section */}
      {/* <div className="mb-6">
        <div className="border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-2 px-6 pt-6 mb-4">
            <div className="flex items-center gap-2 bg-[#F8F8F8] px-3 py-1.5 rounded-full">
              <img src="/info.svg" alt="Treatment Plan" className="w-5 h-5" />
              <span className="font-medium text-[#7F7F7F]">Treatment plan</span>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-6">
              {treatmentData.map((treatment, index) => (
                <div key={index} className={index !== 0 ? "pt-6 border-t" : ""}>
                  <div className="flex">
                    <div className="w-[130px]">
                      <h3 className="font-semibold">{treatment.medicine}</h3>
                      <p className="text-gray-500">
                        {treatment.dosage} · {treatment.time}
                      </p>
                    </div>
                    <div className="w-px bg-gray-200 mx-6"></div>
                    <div>
                      <h3 className="font-semibold">{treatment.type}</h3>
                      <p className="text-gray-500">{treatment.notes}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}

      {/* AI Analysis Section */}
      <div>
        <div className="border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-2 px-6 pt-6 mb-4">
            <div className="flex items-center gap-2 bg-[#F8F8F8] px-3 py-1.5 rounded-full">
              <img src="/report.svg" alt="AI Analysis" className="w-5 h-5" />
              <span className="font-medium text-[#7F7F7F]">AI Analysis</span>
            </div>
          </div>
          <div className="px-6 pb-6 flex flex-col gap-4">
            <p>
              <p className="font-bold">Findings:</p>
              {firstRecord?.findings ||
                "This user doesn't have any outstanding findings"}
            </p>
            <p>
              <p className="font-bold">Impression:</p>
              {firstRecord?.impression ||
                "This user doesn't have any outstanding impressions"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientOverview;
