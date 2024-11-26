// src/components/navigation/NavigationTab.jsx
import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  LucidePlane,
  Package, 
  MapPin, 
  FileDown 
} from 'lucide-react';

// Add isCollapsed and setIsCollapsed to props
const NavigationTab = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {
  const navigationItems = [
    { id: 'drone', label: 'Drone Interface', icon: <LucidePlane size={20} /> },
    { id: 'items', label: 'Item Management', icon: <Package size={20} /> },
    { id: 'locations', label: 'Locations', icon: <MapPin size={20} /> },
    { id: 'exports', label: 'Export Data', icon: <FileDown size={20} /> },
  ];

  return (
    <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <span className="nav-icon">🚁</span>
          <span className="logo-text">CPS-X 4.0</span>
        </div>
        <button 
          className="toggle-button"
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
            className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
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