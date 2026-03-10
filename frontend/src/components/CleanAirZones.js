import React, { useState, useEffect } from 'react';
import { getCleanAirZones } from '../services/api';
import { FaLeaf } from 'react-icons/fa';

const CleanAirZones = ({ lat, lon }) => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lat && lon) {
      getCleanAirZones(lat, lon)
        .then(res => {
          setZones(res.data.clean_air_zones || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching clean air zones:', err);
          setLoading(false);
        });
    }
  }, [lat, lon]);

  if (loading) return <div className="clean-air-zones-loading">Loading clean air zones...</div>;

  return (
    <div className="clean-air-zones-container">
      <div className="clean-air-header">
        <FaLeaf size={24} color="#10b981" />
        <h3>Clean Air Zones Near You</h3>
      </div>
      {zones.length > 0 ? (
        <div className="zones-list">
          {zones.map((zone, idx) => (
            <div key={idx} className="zone-card">
              <div className="zone-name">{zone.city}</div>
              <div className="zone-stats">
                <span className="zone-risk">Risk: {zone.risk_score}</span>
                <span className="zone-pm25">PM2.5: {zone.pm25}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-zones">No clean air zones found nearby</p>
      )}
    </div>
  );
};

export default CleanAirZones;
