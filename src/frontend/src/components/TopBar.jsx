import React from "react";
import { useAuth } from "../context/Authentication";
import { useLocation, useParams, Link } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
function TopBar() {
  const { user } = useAuth();
  const location = useLocation();
  const params = useParams();

  const [showDropdown, setShowDropdown] = React.useState(false);

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const items = [];

    const segments = path.split("/").filter(Boolean);

    if (segments.length === 0) {
      items.push({ label: "Patients", path: "/patients" });
      return items;
    }

    switch (segments[0]) {
      case "prediction":
        items.push({ label: "Prediction", path: "/prediction" });
        break;
      case "patients":
        items.push({ label: "Patients", path: "/patients" });
        if (segments[1]) {
          items.push({
            label: "Patient Detail",
            path: `/patients/${segments[1]}`,
          });
          if (segments[2] === "create-record") {
            items.push({
              label: `Record: #${params.recordId || "New"}`,
              path: null,
            });
          }
        }
        break;
      default:
        items.push({ label: "Patients", path: "/patients" });
    }

    return items;
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const getTitle = () => {
    const items = getBreadcrumbItems();
    if (items.length === 0) {
      return "Patients"; // Default title
    }

    if (location.pathname.includes("/patients/")) {
      return "Patient: Marvin McKinney";
    }

    return items[0].label;
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="px-6">
        <div className="py-2 flex justify-between items-center">
          <h1 className="text-xl font-medium">{getTitle()}</h1>

          {/* <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
            <div className="w-10 h-10 rounded-full flex justify-center items-center bg-gray-600">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaRegUser className="w-2/3 aspect-square object-cover text-gray-200" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {`${user.first_name} ${user.last_name}`}
              </span>
              <span className="text-xs text-gray-500">{user.occupation}</span>
            </div>
          </div> */}
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-10 h-10 rounded-full flex justify-center items-center bg-gray-600">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaRegUser className="w-2/3 aspect-square object-cover text-gray-200" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {`${user.first_name} ${user.last_name}`}
                </span>
                <span className="text-xs text-gray-500">{user.occupation}</span>
              </div>
            </div>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={void 0}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumb - only show if we have more than one item */}
        {getBreadcrumbItems().length > 1 && (
          <div className="pb-4">
            <div className="flex items-center gap-2 text-sm">
              {getBreadcrumbItems().map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <IoChevronForward className="text-gray-400" />}
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={
                        isActivePath(item.path)
                          ? "text-[#3C7187]"
                          : "text-gray-500"
                      }
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-[#3C7187]">{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopBar;
