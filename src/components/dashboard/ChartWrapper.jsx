// src/components/dashboard/ChartWrapper.jsx
import React from 'react';

const ChartWrapper = ({ children, title }) => (
  <div className="chart-card">
    <div className="chart-header">
      <h2 className="chart-title">{title}</h2>
    </div>
    <div className="chart-content">
      {children}
    </div>
  </div>
);

export default ChartWrapper;