import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  LucidePlane,
  Package, 
  MapPin, 
  FileDown, 
  PlaneTakeoff
} from 'lucide-react';
import '../../assets/styles/components/NavigationTab.css';
import AutoPilot from '../AutoPilot';

const NavigationTab = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const navigationItems = [
    { id: 'drone', label: 'Drone Interface', icon: <LucidePlane size={20} /> },
    { id: 'autopilot', label: 'Auto Pilot', icon: <PlaneTakeoff size={20} /> },
    { id: 'items', label: 'Item Management', icon: <Package size={20} /> },
    { id: 'locations', label: 'Locations', icon: <MapPin size={20} /> },
    { id: 'exports', label: 'Export Data', icon: <FileDown size={20} /> },
  ];

  return (
    <nav className={`nav-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="nav-header">
        <div className="nav-logo-container">
          <span className="nav-icon">🚁</span>
          <span className="nav-logo-text">CPS-X 4.0</span>
        </div>
        <button 
          className="nav-toggle-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="nav-items">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationTab;