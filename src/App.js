// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import DroneInterface from "./components/DroneInterface";
import AutoPilot from "./components/AutoPilot";
import NavigationTab from "./components/navigation/NavigationTab";
import ItemManagement from "./components/items/ItemManagement";
import LocationManagement from "./components/locations/LocationManagement";
import Export from "./components/exports/Export";
import "./assets/styles/index.css";

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
      default:
        return <DroneInterface />;
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
