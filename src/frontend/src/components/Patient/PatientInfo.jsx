// Author: Nathan Luong, Reza Jodeiri

import React from "react";
import { FiMail, FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";

function PatientInfo({ patient, activeTab, setActiveTab }) {
  const tabs = ["Overview", "Medical Record"];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Patient Info Section */}
      <div className="p-6">
        <div className="flex items-center gap-4">
          {
            // Patient Avatar
            patient?.avatar ? (
              <img
                src={patient.avatar}
                alt="Patient"
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 bg-gray-600 aspect-square flex justify-center items-center rounded-full">
                <FaRegUser className="w-full object-cover text-gray-200" />
              </div>
            )
          }

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{patient.name}</h1>
            </div>
            <div className="text-gray-600 text-sm">
              <span>{`${patient.gender} · Age ${patient.age}`}</span>
              <br />
            </div>
          </div>
          <div className="pl-5 ml-5 bl-2 border-gray-200 border-l-[1px] text-right text-sm text-gray-600">
            <div className="flex gap-2 items-center">
              <FiMail />
              <Link to={`mailto:${patient.email}`}>
                <p className=" cursor-pointer text-[#3C7187] hover:text-[#53859b] transition-colors duration-200 ease-in-out underline">
                  {patient.email}
                </p>
              </Link>
            </div>
            <div className="flex gap-2 items-center">
              <FiPhone />
              <p>+880 172524123123</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`
              py-4 px-2 relative transition-colors duration-200 ease-in-out
              ${
                activeTab === tab
                  ? "text-[#3C7187] font-medium"
                  : "text-gray-600 hover:text-[#3C7187]"
              }
              outline-none focus:outline-none active:outline-none select-none
              -webkit-tap-highlight-color-transparent
            `}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <div
              className={`
                absolute bottom-0 left-0 right-0 h-0.5
                transition-all duration-200 ease-in-out
                ${
                  activeTab === tab
                    ? "bg-[#3C7187] opacity-100"
                    : "bg-[#3C7187] opacity-0"
                }
              `}
            />
          </button>
        ))}
      </div>
      {/* Horizontal divider below tabs */}
      <div className="border-b border-gray-200"></div>
    </div>
  );
}

export default PatientInfo;
