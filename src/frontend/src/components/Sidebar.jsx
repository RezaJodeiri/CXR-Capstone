// Author: Nathan Luong, Reza Jodeiri

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";

function Sidebar({ isCollapsed, toggleCollapse }) {
  const location = useLocation();

  const topMenuItems = [
    {
      icon: "/union.svg",
      label: "Patients",
      path: "/patients",
      customIcon: true,
    },
  ];

  const bottomMenuItems = [
    {
      label: "Settings",
      path: "/settings",
      icon: "/settings.svg",
      customIcon: true,
    },
    // {
    //   label: "Help",
    //   path: "/help",
    //   icon: "/help.svg",
    //   customIcon: true,
    // },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-white transition-all duration-300 relative h-screen border-r border-gray-200 flex flex-col`}
    >
      <button
        onClick={toggleCollapse}
        className="absolute -right-4 top-8 z-50 -translate-x-1"
      >
        <img
          src="/chevron-down.svg"
          alt="toggle"
          className={`transform transition-transform ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        id="logo-container"
        className="h-[4.5rem] flex justify-center items-center flex-grow-0"
      >
        <h1
          className={`text-2xl font-semibold text-primary ${
            isCollapsed ? "hidden" : ""
          }`}
        >
          LungVision AI
        </h1>
      </div>

      <div className="flex flex-col justify-between flex-1">
        <nav>
          {topMenuItems.map((item, index) => (
            <NavLink
              key={`top-${index}`}
              item={item}
              location={location}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
        <nav>
          {bottomMenuItems.map((item, index) => (
            <NavLink
              key={`bottom-${index}`}
              item={item}
              location={location}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

function NavLink({ item, location, isCollapsed }) {
  return (
    <Link
      to={item.path}
      className={`flex items-center px-6 py-3 text-base font-semibold relative ${
        location.pathname === item.path
          ? "text-[#3C7187] bg-[#3C7187]/10"
          : "text-gray-600 hover:bg-gray-100 hover:text-[#3C7187]"
      }`}
    >
      <div className="relative">
        {item.customIcon ? (
          <img
            src={item.icon}
            alt={item.label}
            className={`w-5 h-5 ${
              location.pathname === item.path ? "filter-[#3C7187]" : ""
            }`}
          />
        ) : (
          <span>{item.icon}</span>
        )}
        {item.badge && (
          <span className="absolute -top-2 -right-2 bg-red-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </div>
      {!isCollapsed && <span className="ml-3">{item.label}</span>}
    </Link>
  );
}

export default Sidebar;
