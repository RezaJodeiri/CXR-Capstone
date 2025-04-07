// Author: Nathan Luong, Reza Jodeiri

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiMoreVertical,
  FiPlus,
  FiCheck,
  FiX,
} from "react-icons/fi";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/Authentication";
import { getPatients, createPatient } from "../services/api";

function PatientsPage() {
  const navigate = useNavigate();
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const { user: doctor, token } = useAuth();
  const [patients, setPatients] = useState([]);
  const fetchPatients = async () => {
    setPatients(await getPatients(doctor.id, token));
  };

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone_number: "",
  });

  const validNewPatient =
    newPatient.name && newPatient.age && newPatient.gender && newPatient.email;

  useEffect(() => {
    fetchPatients();
  }, []);

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
      name: "",
      age: "",
      gender: "",
      email: "",
      phone_number: "",
    });
  };

  const handleSavePatient = async () => {
    if (!validNewPatient) return;
    await createPatient(doctor.id, newPatient, token);
    handleCancelAdd();
    await fetchPatients();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      <TopBar />
      <div className="p-8">
        <div className="bg-white rounded-lg p-6 h-[85vh] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-medium">Patients</h1>

            <div className="flex items-center gap-4">
              <button
                onClick={handleAddPatient}
                disabled={isAddingPatient}
                className={
                  !isAddingPatient
                    ? "flex items-center gap-2 bg-[#3C7187] text-white px-4 py-2 rounded-md"
                    : "flex items-center gap-2 bg-[#747474] text-white px-4 py-2 rounded-md"
                }
              >
                <FiPlus />
                <span>Add Patient</span>
              </button>
            </div>
          </div>
          <div className="overflow-y-auto h-[80%]">
            <table className="w-full h-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm w-full">
                  <th className="pb-4">PATIENT ID</th>
                  <th className="pb-4">NAME</th>
                  <th className="pb-4">CONTACT</th>
                  <th className="pb-4">AGE</th>
                  <th className="pb-4">GENDER</th>
                  <th className="pb-4">DIAGNOSIS</th>
                  <th className="pb-4">STATUS</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody>
                {isAddingPatient && (
                  <tr className="border-t w-full h-[56px]">
                    <td className="py-4"></td>
                    <td className="py-4">
                      <input
                        type="text"
                        placeholder="Name"
                        autoComplete="off"
                        name="name"
                        value={newPatient.name}
                        onChange={handleInputChange}
                        className="w-[80%] border rounded px-2 py-1"
                      />
                    </td>
                    <td id="contact-inputs" className="py-4">
                      <input
                        type="text"
                        name="email"
                        autoComplete="off"
                        value={newPatient.email}
                        onChange={handleInputChange}
                        placeholder="example@gmail.com"
                        className="w-[90%] border rounded py-1 indent-2"
                      />
                    </td>
                    <td className="py-4">
                      <input
                        type="text"
                        name="age"
                        placeholder="Age"
                        autoComplete="off"
                        value={newPatient.age}
                        onChange={handleInputChange}
                        className="w-[5rem] border rounded px-2 py-1"
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
                    <td className="py-4"></td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={handleSavePatient}
                          disabled={!validNewPatient}
                          className={
                            validNewPatient
                              ? "text-green-500 hover:text-green-700 cursor-pointer"
                              : "text-gray-500 cursor-not-allowed"
                          }
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
                  <tr
                    key={patient.id}
                    className="border-t hover:bg-blue-50 w-full h-[56px]"
                  >
                    <td className="py-4">
                      <button
                        className="text-[#3C7187] hover:underline text-left"
                        onClick={() => handlePatientClick(patient.id)}
                      >
                        {patient.friendlyId}
                      </button>
                    </td>
                    <td className="py-4">{patient.name}</td>
                    <td className="py-4 flex items-center gap-4">
                      <FiPhone />
                      <FiMail />
                    </td>
                    <td className="py-4">{patient.age}</td>
                    <td className="py-4">{patient.gender}</td>
                    <td className="py-4">{patient.diagnosis}</td>
                    <td className="py-4 flex items-center gap-2">
                      <div
                        className="h-2 aspect-square rounded-full"
                        style={{
                          backgroundColor:
                            patient.status === "Emergency"
                              ? "red"
                              : patient.status === "Low"
                              ? "green"
                              : patient.status === "Medium"
                              ? "orange"
                              : "gray",
                        }}
                      ></div>
                      <p>{patient.status}</p>
                    </td>
                    <td className="py-4">
                      <button>
                        <FiMoreVertical className="text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Fill the rest with empty tr */}
                {Array(itemsPerPage - currentPatients.length)
                  .fill()
                  .map((_, index) => (
                    <tr key={index} className="border-t w-full h-[56px]"></tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 border rounded ${
                  currentPage === 1 ? "text-gray-400" : ""
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`px-3 py-1 border rounded ${
                    currentPage === index + 1 ? "bg-[#3C7187] text-white" : ""
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className={`px-3 py-1 border rounded ${
                  currentPage === totalPages ? "text-gray-400" : ""
                }`}
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
  );
}

export default PatientsPage;
