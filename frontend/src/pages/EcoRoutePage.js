import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import { getEcoRoute } from '../services/api';
import { useLocation } from '../context/LocationContext';
import 'leaflet/dist/leaflet.css';

function EcoRoutePage() {
  const { location } = useLocation();
  const [startLat, setStartLat] = useState(location.lat.toString());
  const [startLon, setStartLon] = useState(location.lon.toString());
  const [endLat, setEndLat] = useState('');
  const [endLon, setEndLon] = useState('');
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);

  const findRoute = async () => {
    setLoading(true);
    try {
      const response = await getEcoRoute(
        parseFloat(startLat),
        parseFloat(startLon),
        parseFloat(endLat),
        parseFloat(endLon)
      );
      setRouteData(response.data);
    } catch (error) {
      console.error('Error finding route:', error);
    }
    setLoading(false);
  };

  const getRiskColor = (level) => {
    if (level === 'Low') return 'green';
    if (level === 'Medium') return 'orange';
    return 'red';
  };

  return (
    <div className="eco-route-page">
      <h2>🌿 Eco-Friendly Route Finder</h2>
      
      <div className="route-controls">
        <div className="input-group">
          <h4>Start Location</h4>
          <input type="number" placeholder="Latitude" value={startLat} onChange={(e) => setStartLat(e.target.value)} />
          <input type="number" placeholder="Longitude" value={startLon} onChange={(e) => setStartLon(e.target.value)} />
        </div>
        
        <div className="input-group">
          <h4>Destination</h4>
          <input type="number" placeholder="Latitude" value={endLat} onChange={(e) => setEndLat(e.target.value)} />
          <input type="number" placeholder="Longitude" value={endLon} onChange={(e) => setEndLon(e.target.value)} />
        </div>
        
        <button onClick={findRoute} disabled={loading} className="find-route-btn">
          {loading ? 'Finding Route...' : '🔍 Find Eco Route'}
        </button>
      </div>

      {routeData && (
        <div className="route-info">
          <div className="info-card">
            <h4>Average Pollution</h4>
            <p className="value">{routeData.average_pollution} µg/m³</p>
          </div>
          <div className="info-card">
            <h4>Risk Level</h4>
            <p className="value" style={{ color: getRiskColor(routeData.risk_level) }}>
              {routeData.risk_level}
            </p>
          </div>
        </div>
      )}

      <MapContainer center={[location.lat, location.lon]} zoom={4} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {routeData && (
          <>
            <Polyline 
              positions={routeData.route.map(p => [p.lat, p.lon])} 
              color={getRiskColor(routeData.risk_level)}
              weight={4}
            />
            <Marker position={[parseFloat(startLat), parseFloat(startLon)]}>
              <Popup>Start</Popup>
            </Marker>
            <Marker position={[parseFloat(endLat), parseFloat(endLon)]}>
              <Popup>Destination</Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
}

export default EcoRoutePage;
