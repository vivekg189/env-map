import React, { useState, useEffect } from 'react';
import { getPollutionHotspots } from '../services/api';
import { FaExclamationTriangle } from 'react-icons/fa';

function PollutionHotspotsPage() {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const cachedData = sessionStorage.getItem('pollutionHotspots');
    if (cachedData) {
      setHotspots(JSON.parse(cachedData));
      setLoading(false);
    } else {
      getUserLocation();
    }
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLocation({ lat, lon });
          fetchHotspots(lat, lon);
        },
        () => {
          setUserLocation({ lat: 40.7128, lon: -74.0060 });
          fetchHotspots(40.7128, -74.0060);
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lon: -74.0060 });
      fetchHotspots(40.7128, -74.0060);
    }
  };

  const fetchHotspots = async (lat, lon) => {
    try {
      const res = await getPollutionHotspots(lat, lon);
      const data = res.data.pollution_hotspots || [];
      setHotspots(data);
      sessionStorage.setItem('pollutionHotspots', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching pollution hotspots:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    if (level === 'Low') return '#10b981';
    if (level === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="pollution-hotspots-page">
      <div className="page-header">
        <FaExclamationTriangle size={32} color="#ef4444" />
        <h1>Pollution Hotspots</h1>
        <p>Areas with high pollution levels to avoid</p>
      </div>

      {loading && <div className="loading">Loading pollution hotspots...</div>}

      {!loading && (
        <div className="hotspots-container">
          {hotspots.length > 0 ? (
            <div className="hotspots-grid">
              {hotspots.map((hotspot, idx) => (
                <div key={idx} className="hotspot-card-large">
                  <div className="hotspot-rank">⚠️ #{idx + 1}</div>
                  <div className="hotspot-header">
                    <h3>{hotspot.city}</h3>
                    <span className="hotspot-badge" style={{ backgroundColor: getRiskColor(hotspot.risk_level) }}>
                      {hotspot.risk_level} Risk
                    </span>
                  </div>
                  <div className="hotspot-details">
                    <div className="detail-item">
                      <span className="label">Risk Score</span>
                      <span className="value danger">{hotspot.risk_score}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">PM2.5</span>
                      <span className="value danger">{hotspot.pm25} μg/m³</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Status</span>
                      <span className="value danger">Avoid</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No pollution hotspots detected in your area</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PollutionHotspotsPage;
