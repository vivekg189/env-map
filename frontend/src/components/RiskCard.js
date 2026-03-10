import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const RiskCard = ({ riskData, getRiskColor, getRiskBgColor }) => (
  <div 
    className="primary-risk-card" 
    style={{ background: getRiskBgColor(riskData.risk_level), borderColor: getRiskColor(riskData.risk_level) }}
  >
    <div className="risk-header">
      <div className="risk-info">
        <h2>Environmental Risk Assessment</h2>
        <p className="location-info">
          <FaMapMarkerAlt size={14} /> {riskData.location || 'Current Location'}
        </p>
      </div>
      <div className="risk-score-display" style={{ color: getRiskColor(riskData.risk_level) }}>
        <div className="score-number">{riskData.risk_score}</div>
        <div className="score-label">{riskData.risk_level} Risk</div>
      </div>
    </div>
  </div>
);

export default RiskCard;
