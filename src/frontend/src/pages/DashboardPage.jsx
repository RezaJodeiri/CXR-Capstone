import React from "react";
import TopBar from "../components/TopBar";

function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      <TopBar />
      <div className="flex-1 p-8">{/* Rest of dashboard content */}</div>
    </div>
  );
}

export default DashboardPage;
