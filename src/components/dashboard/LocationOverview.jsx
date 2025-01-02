import React, { useState } from "react";
import { Clock, Package } from "lucide-react";
import moment from "moment-timezone";

const LocationOverview = ({ locations, items }) => {
  const [selectedType, setSelectedType] = useState("all");

  const getLocationStats = (locationId) => {
    const locationItems = items.filter((item) => item.location_id === locationId);
    const lastScan = locationItems.reduce((latest, item) => {
      const itemScan = moment(item.last_scan_time);
      return !latest || itemScan.isAfter(latest) ? itemScan : latest;
    }, null);

    const itemCounts = {
      total: locationItems.length,
      rolls: locationItems.filter((item) => item.label_type === "Roll").length,
      pallets: locationItems.filter((item) => item.label_type === "FG Pallet").length,
    };

    return { lastScan, itemCounts };
  };

  const filteredLocations = locations.filter((location) => {
    if (selectedType === "all") return true;
    if (selectedType === "Paper Roll Location")
      return location.type_name === "Paper Roll Location";
    if (selectedType === "FG Location")
      return location.type_name === "FG Pallet Location";
    return true;
  });

  return (
    <div className="dashboard-section">
      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">Location Overview</h2>
        <div className="location-status-legend">
          <div className="legend-item">
            <div className="legend-indicator recent"></div>
            <span>Recently Scanned (Within 7 Days)</span>
          </div>
          <div className="legend-item">
            <div className="legend-indicator outdated"></div>
            <span>Needs Attention (No Scan {'>'} 7 Days)</span>
          </div>
        </div>
      </div>

      <div className="location-filter">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedType === "all" ? "active" : ""}`}
            onClick={() => setSelectedType("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${selectedType === "Paper Roll Location" ? "active" : ""}`}
            onClick={() => setSelectedType("Paper Roll Location")}
          >
            Paper Roll Location
          </button>
          <button
            className={`filter-btn ${selectedType === "FG Location" ? "active" : ""}`}
            onClick={() => setSelectedType("FG Location")}
          >
            FG Pallet Location
          </button>
        </div>
      </div>

      <div className="location-overview-grid">
        {filteredLocations.map((location) => {
          const stats = getLocationStats(location.location_id);
          const isOldScan = stats.lastScan && moment().diff(stats.lastScan, "days") > 7;

          return (
            <div
              key={location.location_id}
              className={`location-card ${isOldScan ? "location-card-outdated" : "location-card-recent"}`}
            >
              <div className="location-card-content">
                <div className="location-card-header">
                  <div>
                    <h3 className="location-card-title">{location.location_id}</h3>
                    <p className="location-card-subtitle">{location.type_name}</p>
                  </div>
                  <div className="location-card-icon">
                    <Package />
                  </div>
                </div>

                <div className="location-card-stats">
                  <div className="location-stat">
                    <span className="stat-label">Total Items:</span>
                    <span className="stat-value">{stats.itemCounts.total}</span>
                  </div>
                  <div className="location-stat">
                    <span className="stat-label">Rolls:</span>
                    <span className="stat-value">{stats.itemCounts.rolls}</span>
                  </div>
                  <div className="location-stat">
                    <span className="stat-label">Pallets:</span>
                    <span className="stat-value">{stats.itemCounts.pallets}</span>
                  </div>
                </div>
              </div>

              <div className="location-card-footer">
                <div className="last-scan">
                  <Clock className="last-scan-icon" />
                  <span className="last-scan-text">
                    Last Scan: {stats.lastScan ? stats.lastScan.fromNow() : "Never scanned"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LocationOverview;