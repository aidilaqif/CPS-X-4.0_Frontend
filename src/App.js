import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import DroneInterface from "./components/DroneInterface";
import AutoPilot from "./components/AutoPilot";
import ItemManagement from "./components/items/ItemManagement";
import LocationManagement from "./components/locations/LocationManagement";
import Export from "./components/exports/Export";
import "./App.css";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <div className="sidebar-header">
            <h1 className="sidebar-title">CPS-X DragonFly 4.0</h1>
            <button
              className="collapse-button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? "→" : "←"}
            </button>
          </div>
          <nav className="sidebar-nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
              end
            >
              <span className="sidebar-icon">🎮</span>
              <span className="link-text">Manual Control</span>
            </NavLink>
            <NavLink
              to="/autopilot"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span className="sidebar-icon">🤖</span>
              <span className="link-text">AutoPilot</span>
            </NavLink>
            <NavLink
              to="/items"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span className="sidebar-icon">📦</span>
              <span className="link-text">Items</span>
            </NavLink>
            <NavLink
              to="/locations"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span className="sidebar-icon">📍</span>
              <span className="link-text">Locations</span>
            </NavLink>
            <NavLink
              to="/exports"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span className="sidebar-icon">📊</span>
              <span className="link-text">Exports</span>
            </NavLink>
          </nav>
        </div>

        {/* Main Content */}
        <div className={`main-content ${isSidebarCollapsed ? "expanded" : ""}`}>
          <Routes>
            <Route path="/" element={<DroneInterface />} />
            <Route path="/autopilot" element={<AutoPilot />} />
            <Route path="/items" element={<ItemManagement />} />
            <Route path="/locations" element={<LocationManagement />} />
            <Route path="/exports" element={<Export />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
