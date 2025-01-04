import React, { useState } from 'react';
import { FiPlus, FiArrowUp } from 'react-icons/fi';
import CreateMedicalRecord from './CreateMedicalRecord';

function PatientMedicalRecords() {
  const [isCreating, setIsCreating] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);

  const handleRecordCreated = (newRecord) => {
    setMedicalRecords(prevRecords => [{
      ...newRecord,
      report: 'Pending'
    }, ...prevRecords]);
    setIsCreating(false);
  };

  // If viewing a record
  if (viewingRecord) {
    return (
      <CreateMedicalRecord 
        viewMode={true}
        onBack={() => setViewingRecord(null)}
        recordId={viewingRecord}
        onRecordCreated={() => {}}
      />
    );
  }

  // If creating a new record
  if (isCreating) {
    return (
      <CreateMedicalRecord 
        onBack={() => setIsCreating(false)}
        onRecordCreated={handleRecordCreated}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-4">
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-[#3C7187] text-white px-4 py-2 rounded-md hover:bg-[#2c5465] transition-colors"
          >
            <FiPlus className="text-lg" />
            <span>Create New Record</span>
          </button>
          <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
            <FiArrowUp className="text-lg" />
            <span>Compare Records</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Record ID</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Priority</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Report</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Created</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {medicalRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <button
                    onClick={() => setViewingRecord(record.id)}
                    className="text-sm text-[#3C7187] hover:text-[#2c5465] hover:underline"
                  >
                    {record.recordId}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    record.priority === 'High' ? 'bg-red-100 text-red-800' :
                    record.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {record.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    record.report === 'Completed' ? 'bg-green-100 text-green-800' :
                    record.report === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {record.report}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.timeCreated?.split('T')[0]}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.timeUpdated?.split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t">
          <div className="text-sm text-gray-500">
            Showing 1 to 4 of 4 records
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white" disabled>
              Previous
            </button>
            <button className="px-3 py-1 text-sm border rounded bg-[#3C7187] text-white">
              1
            </button>
            <button className="px-3 py-1 text-sm border rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientMedicalRecords; 