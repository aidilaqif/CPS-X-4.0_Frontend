// src/components/dashboard/SummaryCard.jsx
import React from 'react';

const SummaryCard = ({ icon: Icon, title, value, bgColor, iconColor }) => (
  <div className="summary-card">
    <div className="summary-card-content">
      <div className={`summary-card-icon ${bgColor}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <p className="summary-card-title">{title}</p>
        <h3 className="summary-card-value">{value}</h3>
      </div>
    </div>
  </div>
);

export default SummaryCard;