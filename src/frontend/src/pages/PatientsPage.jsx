import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiPhone, FiMoreVertical, FiPlus, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function PatientsPage() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    patientId: '',
    name: '',
    age: '',
    diagnosis: '',
    gender: '',
    contact: 'email'
  });
  
  const [patients, setPatients] = useState([
    {
      id: 1,
      patientId: 'PT-001',
      name: 'Dianne Russell',
      age: '45',
      diagnosis: 'Hypertension',
      gender: 'Female',
      contact: 'email'
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = patients.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePatientClick = (patientId) => {
    navigate(`/patients/${patientId}`);
  };

  const handleAddPatient = () => {
    setIsAddingPatient(true);
  };

  const handleCancelAdd = () => {
    setIsAddingPatient(false);
    setNewPatient({
      patientId: '',
      name: '',
      age: '',
      diagnosis: '',
      gender: '',
      contact: 'email'
    });
  };

  const handleSavePatient = () => {
    if (newPatient.name && newPatient.patientId) {
      setPatients(prev => [...prev, { 
        id: Date.now(),
        ...newPatient 
      }]);
      handleCancelAdd();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggleCollapse={() => setIsCollapsed(!isCollapsed)} 
      />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="p-8">
          <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-medium">Patients</h1>

              <div className="flex items-center gap-4">
                <button 
                  onClick={handleAddPatient}
                  className="flex items-center gap-2 bg-[#3C7187] text-white px-4 py-2 rounded-md"
                >
                  <FiPlus />
                  <span>Add Patient</span>
                </button>
                <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md">
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm">
                  <th className="pb-4">PATIENT ID</th>
                  <th className="pb-4">PATIENT NAME</th>
                  <th className="pb-4">AGE</th>
                  <th className="pb-4">DIAGNOSIS</th>
                  <th className="pb-4">GENDER</th>
                  <th className="pb-4">CONTACT</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody>
                {isAddingPatient && (
                  <tr className="border-t">
                    <td className="py-4">
                      <input
                        type="text"
                        name="patientId"
                        value={newPatient.patientId}
                        onChange={handleInputChange}
                        placeholder="PT-XXX"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-4">
                      <input
                        type="text"
                        name="name"
                        value={newPatient.name}
                        onChange={handleInputChange}
                        placeholder="Patient Name"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-4">
                      <input
                        type="text"
                        name="age"
                        value={newPatient.age}
                        onChange={handleInputChange}
                        placeholder="Age"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-4">
                      <input
                        type="text"
                        name="diagnosis"
                        value={newPatient.diagnosis}
                        onChange={handleInputChange}
                        placeholder="Diagnosis"
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-4">
                      <select
                        name="gender"
                        value={newPatient.gender}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </td>
                    <td className="py-4">
                      <select
                        name="contact"
                        value={newPatient.contact}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 py-1"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                      </select>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={handleSavePatient}
                          className="text-green-500 hover:text-green-700"
                        >
                          <FiCheck />
                        </button>
                        <button 
                          onClick={handleCancelAdd}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {currentPatients.map((patient) => (
                  <tr key={patient.id} className="border-t">
                    <td className="py-4">{patient.patientId}</td>
                    <td className="py-4">
                      <button
                        className="text-[#3C7187] hover:underline text-left"
                        onClick={() => handlePatientClick(patient.id)}
                      >
                        {patient.name}
                      </button>
                    </td>
                    <td className="py-4">{patient.age}</td>
                    <td className="py-4">{patient.diagnosis}</td>
                    <td className="py-4">{patient.gender}</td>
                    <td className="py-4">
                      {patient.contact === 'email' ? (
                        <FiMail className="text-gray-500" />
                      ) : (
                        <FiPhone className="text-gray-500" />
                      )}
                    </td>
                    <td className="py-4">
                      <button>
                        <FiMoreVertical className="text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-6">
              <div className="flex gap-2">
                <button 
                  className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400' : ''}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`px-3 py-1 border rounded ${
                      currentPage === index + 1 ? 'bg-[#3C7187] text-white' : ''
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button 
                  className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'text-gray-400' : ''}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientsPage;