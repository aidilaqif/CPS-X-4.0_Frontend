// src/App.js
import React, { useState } from 'react';
import DroneInterface from './components/DroneInterface';
import NavigationTab from './components/navigation/NavigationTab';
import ItemManagement from './components/items/ItemManagement';
import LocationManagement from './components/locations/LocationManagement';
import './assets/styles/index.css';

// Placeholder components for other pages
// const ItemManagement = () => (
//   <div className="page-container">
//     <section className="section">
//       <h1>Item Management</h1>
//       <p>Item management interface will be implemented here</p>
//     </section>
//   </div>
// );

// const Locations = () => (
//   <div className="page-container">
//     <section className="section">
//       <h1>Locations</h1>
//       <p>Locations management interface will be implemented here</p>
//     </section>
//   </div>
// );

const ExportData = () => (
  <div className="page-container">
    <section className="section">
      <h1>Export Data</h1>
      <p>Data export interface will be implemented here</p>
    </section>
  </div>
);


function App() {
  const [currentPage, setCurrentPage] = useState('drone');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'drone':
        return <DroneInterface />;
      case 'items':
        return <ItemManagement />;
      case 'locations':
        return <LocationManagement />;
      case 'exports':
        return <ExportData />;
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
      <main className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;