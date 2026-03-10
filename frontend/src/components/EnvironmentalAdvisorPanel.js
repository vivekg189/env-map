import React, { useState, useEffect } from 'react';
import { getEnvironmentAdvisor } from '../services/api';
import '../styles/EnvironmentalAdvisorPanel.css';

const EnvironmentalAdvisorPanel = ({ latitude, longitude }) => {
  const [advisor, setAdvisor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (latitude && longitude) {
      fetchAdvisor();
    }
  }, [latitude, longitude]);

  const fetchAdvisor = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEnvironmentAdvisor(latitude, longitude);
      setAdvisor(response.data);
    } catch (err) {
      setError('Failed to fetch environmental advisor data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low':
        return '#4CAF50';
      case 'Medium':
        return '#FFC107';
      case 'High':
        return '#F44336';
      default:
        return '#999';
    }
  };

  if (loading) {
    return <div className="advisor-panel loading">Loading environmental analysis...</div>;
  }

  if (error) {
    return <div className="advisor-panel error">{error}</div>;
  }

  if (!advisor) {
    return <div className="advisor-panel">No data available</div>;
  }

  return (
    <div className="advisor-panel">
      <div className="advisor-header">
        <h2>🌍 Environmental Advisor</h2>
        <p className="location">{advisor.location}</p>
      </div>

      <div className="risk-section">
        <div className="risk-card" style={{ borderLeftColor: getRiskColor(advisor.risk_level) }}>
          <h3>Risk Level</h3>
          <div className="risk-badge" style={{ backgroundColor: getRiskColor(advisor.risk_level) }}>
            {advisor.risk_level}
          </div>
          <p className="risk-score">Score: {advisor.risk_score}/100</p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">PM2.5</span>
          <span className="metric-value">{advisor.pm25} μg/m³</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Temperature</span>
          <span className="metric-value">{advisor.temperature}°C</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Humidity</span>
          <span className="metric-value">{advisor.humidity}%</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Wind Speed</span>
          <span className="metric-value">{advisor.wind_speed} km/h</span>
        </div>
      </div>

      <div className="analysis-section">
        <div className="analysis-card">
          <h3>🔍 Pollution Source Analysis</h3>
          <p>{advisor.pollution_sources}</p>
        </div>

        <div className="analysis-card">
          <h3>💡 Environmental Recommendations</h3>
          <ul className="recommendations-list">
            {advisor.recommendations && advisor.recommendations.map((rec, idx) => (
              <li key={idx}>
                <span className="bullet">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="analysis-card">
          <h3>⏱️ Safe Outdoor Exposure Time</h3>
          <p className="exposure-time">{advisor.safe_exposure_time}</p>
        </div>

        <div className="analysis-card">
          <h3>📍 Nearby Safer Locations</h3>
          <ul className="locations-list">
            {advisor.safer_locations && advisor.safer_locations.map((loc, idx) => (
              <li key={idx}>
                <span className="location-icon">✓</span>
                {loc}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button className="refresh-btn" onClick={fetchAdvisor}>
        🔄 Refresh Analysis
      </button>
    </div>
  );
};

export default EnvironmentalAdvisorPanel;
