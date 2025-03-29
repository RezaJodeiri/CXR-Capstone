import React from "react";
import { useAuth } from "../context/Authentication";
import TopBar from "../components/TopBar";

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopBar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8">{/* Rest of dashboard content */}</div>
      </div>
    </div>
  );
}

export default DashboardPage;
