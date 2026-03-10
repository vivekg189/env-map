import React, { useState, useEffect } from 'react';
import { getCleanAirZones } from '../services/api';
import { FaLeaf } from 'react-icons/fa';

function CleanAirZonesPage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const cachedData = sessionStorage.getItem('cleanAirZones');
    if (cachedData) {
      setZones(JSON.parse(cachedData));
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
          fetchCleanAirZones(lat, lon);
        },
        () => {
          setUserLocation({ lat: 40.7128, lon: -74.0060 });
          fetchCleanAirZones(40.7128, -74.0060);
        }
      );
    } else {
      setUserLocation({ lat: 40.7128, lon: -74.0060 });
      fetchCleanAirZones(40.7128, -74.0060);
    }
  };

  const fetchCleanAirZones = async (lat, lon) => {
    try {
      const res = await getCleanAirZones(lat, lon);
      const data = res.data.clean_air_zones || [];
      setZones(data);
      sessionStorage.setItem('cleanAirZones', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching clean air zones:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clean-air-zones-page">
      <div className="page-header">
        <FaLeaf size={32} color="#10b981" />
        <h1>Clean Air Zones Near You</h1>
        <p>Discover the safest locations with the best air quality</p>
      </div>

      {loading && <div className="loading">Loading clean air zones...</div>}

      {!loading && (
        <div className="zones-container">
          {zones.length > 0 ? (
            <div className="zones-grid">
              {zones.map((zone, idx) => (
                <div key={idx} className="zone-card-large">
                  <div className="zone-rank">#{idx + 1}</div>
                  <div className="zone-header">
                    <h3>{zone.city}</h3>
                    <span className="zone-badge">✓ Clean Air Zone</span>
                  </div>
                  <div className="zone-details">
                    <div className="detail-item">
                      <span className="label">Risk Score</span>
                      <span className="value">{zone.risk_score}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">PM2.5</span>
                      <span className="value">{zone.pm25} μg/m³</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Status</span>
                      <span className="value safe">Safe</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No clean air zones found in your area</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CleanAirZonesPage;
