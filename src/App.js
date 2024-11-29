import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import DroneInterface from "./components/DroneInterface";
import AutoPilot from "./components/AutoPilot";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <nav className="navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            end
          >
            Manual Control
          </NavLink>
          <NavLink
            to="/autopilot"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            AutoPilot
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<DroneInterface />} />
          <Route path="/autopilot" element={<AutoPilot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
