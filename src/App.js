import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import DroneInterface from "./components/DroneInterface";
import AutoPilot from "./components/AutoPilot";
import NavigationTab from "./components/NavigationTab";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("drone");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Render the active component based on the selected tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "drone":
        return <DroneInterface />;
      case "autopilot":
        return <AutoPilot />;
      case "items":
        return <div>Item Management Component</div>;
      case "locations":
        return <div>Locations Component</div>;
      case "exports":
        return <div>Export Data Component</div>;
      default:
        return <DroneInterface />;
    }
  };

  return (
    <Router>
      <div className="app-container">
        <NavigationTab
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <div className={`main-content ${isCollapsed ? "expanded" : ""}`}>
          {renderActiveComponent()}
        </div>
      </div>
    </Router>
  );
}

export default App;