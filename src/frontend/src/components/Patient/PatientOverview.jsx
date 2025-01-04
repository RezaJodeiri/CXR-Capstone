import React from 'react';

function PatientOverview() {
  const clinicalData = [
    { value: '120 mg/dt', label: 'Blood glucose level' },
    { value: '55 Kg', label: 'Weight' },
    { value: '70 bpm', label: 'Heart rate' },
    { value: '71%', label: 'Oxygen saturation' },
    { value: '98.1 F', label: 'Body temperature' },
    { value: '120/80 mm hg', label: 'Blood pressure' }
  ];

  const treatmentData = [
    {
      medicine: 'Ursofalk 300',
      dosage: '2 Pills',
      time: '02:00 PM',
      type: 'Routine Medicine',
      notes: 'No observations or notes'
    },
    {
      medicine: 'Indever 20',
      dosage: '1 Pill',
      time: '02:20 PM',
      type: 'Emergency',
      notes: 'Patient observed to be having seizures. Indever given to reduce blood pressure'
    }
  ];

  return (
    <div className="p-6">
      {/* Date Selection Row */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Overview</h2>
        <div className="flex items-center gap-4">
          <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded">Today</button>
          <div className="flex items-center gap-2">
            <button className="p-1">←</button>
            <span>Fri, 21 Jul 2024</span>
            <button className="p-1">→</button>
          </div>
        </div>
      </div>

      {/* Clinical History Section */}
      <div className="mb-6">
        <div className="border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-2 px-6 pt-6 mb-4">
            <div className="flex items-center gap-2 bg-[#F8F8F8] px-3 py-1.5 rounded-full">
              <img src="/health.svg" alt="Clinical History" className="w-5 h-5" />
              <span className="font-medium text-[#7F7F7F]">Clinical history</span>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="grid grid-cols-6 gap-6">
              {clinicalData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-semibold">{item.value}</div>
                  <div className="text-gray-500 text-sm mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Plan Section */}
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
              {treatmentData.map((treatment, index) => (
                <div key={index} className={index !== 0 ? "pt-6 border-t" : ""}>
                  <div className="flex">
                    <div className="w-[130px]">
                      <h3 className="font-semibold">{treatment.medicine}</h3>
                      <p className="text-gray-500">{treatment.dosage} · {treatment.time}</p>
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
      </div>

      {/* AI Analysis Section */}
      <div>
        <div className="border border-gray-200 rounded-2xl">
          <div className="flex items-center gap-2 px-6 pt-6 mb-4">
            <div className="flex items-center gap-2 bg-[#F8F8F8] px-3 py-1.5 rounded-full">
              <img src="/report.svg" alt="AI Analysis" className="w-5 h-5" />
              <span className="font-medium text-[#7F7F7F]">AI Analysis</span>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="flex">
              <div className="w-[240px]">
                <h3 className="font-semibold">UV Invasive Ultrasound</h3>
                <p className="text-gray-500">02:00 PM</p>
              </div>
              <div className="w-px bg-gray-200 mx-6"></div>
              <div>
                <h3 className="font-semibold">Nerve Disorder</h3>
                <p className="text-gray-500">
                  A small nerve in the left-mid section of the neck has shown swollen properties. A brain scan is suggested
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientOverview; 