import React from 'react';

function SafetyScoreCard({ data }) {
  const getScoreColor = (score) => {
    if (score >= 70) return '#4caf50';
    if (score >= 40) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="safety-score-card">
      <h3>Safety Score</h3>
      <div className="score-circle" style={{ borderColor: getScoreColor(data.safety_score) }}>
        <span className="score-value">{data.safety_score}</span>
        <span className="score-label">/100</span>
      </div>
      <div className="score-details">
        <div className="detail-item">
          <span>Location:</span>
          <strong>{data.location}</strong>
        </div>
        <div className="detail-item">
          <span>PM2.5:</span>
          <strong>{data.pm25} µg/m³</strong>
        </div>
        <div className="detail-item">
          <span>Temperature:</span>
          <strong>{data.temperature}°C</strong>
        </div>
        <div className="detail-item">
          <span>Risk Level:</span>
          <strong className={`risk-${data.risk_level.toLowerCase()}`}>{data.risk_level}</strong>
        </div>
      </div>
    </div>
  );
}

export default SafetyScoreCard;
