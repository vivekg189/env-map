import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { getNearbyRiskMap, getCleanAirZones, getPollutionHotspots } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 9);
  }, [center, map]);
  return null;
}

function RiskMap() {
  const [cities, setCities] = useState([]);
  const [cleanZones, setCleanZones] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState([20.5937, 78.9629]);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLocation([lat, lon]);
          fetchAllData(lat, lon);
        },
        () => fetchAllData(20.5937, 78.9629)
      );
    } else {
      fetchAllData(20.5937, 78.9629);
    }
  };

  const fetchAllData = async (lat, lon) => {
    try {
      const [citiesRes, zonesRes, hotspotsRes] = await Promise.all([
        getNearbyRiskMap(lat, lon),
        getCleanAirZones(lat, lon),
        getPollutionHotspots(lat, lon)
      ]);
      setCities(citiesRes.data.cities || []);
      setCleanZones(zonesRes.data.clean_air_zones || []);
      setHotspots(hotspotsRes.data.pollution_hotspots || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (riskLevel) => {
    if (riskLevel === 'Low') return '#10b981';
    if (riskLevel === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  const createCustomIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
      iconSize: [25, 25],
      iconAnchor: [12, 12]
    });
  };

  return (
    <div className="risk-map">
      <h1>Environmental Risk Map - Nearby Cities</h1>
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
          Clean Air Zone (Risk &lt; 30)
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
          Moderate Risk (31-60)
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
          Pollution Hotspot (Risk &gt; 70)
        </div>
      </div>
      
      {loading && <div className="loading">Loading map...</div>}
      
      {!loading && (
        <MapContainer center={userLocation} zoom={9} style={{ height: '600px', width: '100%' }}>
          <MapCenter center={userLocation} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {cities.map((city, idx) => (
            <React.Fragment key={`city-${idx}`}>
              <Circle
                center={[city.lat, city.lon]}
                radius={15000}
                pathOptions={{ 
                  color: getMarkerColor(city.risk_level),
                  fillColor: getMarkerColor(city.risk_level),
                  fillOpacity: 0.2
                }}
              />
              <Marker 
                position={[city.lat, city.lon]}
                icon={createCustomIcon(getMarkerColor(city.risk_level))}
              >
                <Popup>
                  <div className="popup-content">
                    <h3>{city.name}</h3>
                    <p><strong>Risk Score:</strong> {city.risk_score}</p>
                    <p><strong>Risk Level:</strong> <span style={{ color: getMarkerColor(city.risk_level), fontWeight: 'bold' }}>{city.risk_level}</span></p>
                    <hr style={{ margin: '8px 0' }} />
                    <p><strong>PM2.5:</strong> {city.pm25} μg/m³</p>
                    <p><strong>PM10:</strong> {city.pm10} μg/m³</p>
                    <p><strong>Temperature:</strong> {city.temperature}°C</p>
                    <p><strong>Humidity:</strong> {city.humidity}%</p>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

          {cleanZones.map((zone, idx) => (
            <Marker 
              key={`clean-${idx}`}
              position={[zone.latitude, zone.longitude]}
              icon={createCustomIcon('#10b981')}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{zone.city} ✓</h3>
                  <p><strong>Clean Air Zone</strong></p>
                  <p><strong>Risk Score:</strong> {zone.risk_score}</p>
                  <p><strong>PM2.5:</strong> {zone.pm25} μg/m³</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {hotspots.map((hotspot, idx) => (
            <Marker 
              key={`hotspot-${idx}`}
              position={[hotspot.latitude, hotspot.longitude]}
              icon={createCustomIcon('#ef4444')}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{hotspot.city} ⚠️</h3>
                  <p><strong>Pollution Hotspot</strong></p>
                  <p><strong>Risk Score:</strong> {hotspot.risk_score}</p>
                  <p><strong>Risk Level:</strong> {hotspot.risk_level}</p>
                  <p><strong>PM2.5:</strong> {hotspot.pm25} μg/m³</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}

export default RiskMap;
