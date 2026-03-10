import React from 'react';

const StatCard = ({ icon: Icon, title, value, unit }) => (
  <div className="stat-card">
    <div className="stat-icon">
      <Icon size={24} color="#000" />
    </div>
    <div className="stat-content">
      <h3>{title}</h3>
      <div className="stat-value">{value}{unit}</div>
      <p className="stat-description">{title.toLowerCase()}</p>
    </div>
  </div>
);

export default StatCard;
