// src/App.js
import React, { useState } from "react";
import DroneInterface from "./components/drone/manualpilot/DroneInterface";
import AutoPilot from "./components/drone/autopilot/AutoPilot";
import NavigationTab from "./components/navigation/NavigationTab";
import ItemManagement from "./components/items/ItemManagement";
import LocationManagement from "./components/locations/LocationManagement";
import Export from "./components/exports/Export";
import "./assets/styles/index.css";
import "antd/dist/reset.css";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("drone");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "drone":
        return <DroneInterface />;
      case "autopilot":
        return <AutoPilot />;
      case "items":
        return <ItemManagement />;
      case "locations":
        return <LocationManagement />;
      case "exports":
        return <Export />;
      case "renderPage":
        return <Dashboard/>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <NavigationTab
        activeTab={currentPage}
        setActiveTab={setCurrentPage}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <main
        className={`main-content ${
          isSidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
