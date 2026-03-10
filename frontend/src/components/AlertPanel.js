import React, { useEffect, useState } from 'react';
import { getAlerts } from '../services/api';
import { useLocation } from '../context/LocationContext';

function AlertPanel() {
  const { location, loading: locationLoading } = useLocation();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!locationLoading) {
      fetchAlerts();
      const interval = setInterval(fetchAlerts, 60000);
      return () => clearInterval(interval);
    }
  }, [location, locationLoading]);

  const fetchAlerts = async () => {
    try {
      const response = await getAlerts(location.lat, location.lon);
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  return (
    <div className="alert-panel">
      <h3>🚨 Environmental Alerts</h3>
      {alerts.length === 0 ? (
        <p className="no-alerts">✅ No alerts - All locations safe</p>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert, index) => (
            <div key={index} className={`alert-item ${alert.severity}`}>
              <div className="alert-header">
                <strong>{alert.location}</strong>
                <span className="risk-badge">{alert.risk_score}</span>
              </div>
              <p>{alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlertPanel;
