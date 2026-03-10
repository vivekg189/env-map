import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { getEcoRoute } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapUpdater({ center, routes, navigationMode, currentLocation }) {
  const map = useMap();
  
  useEffect(() => {
    if (navigationMode && currentLocation) {
      map.setView([currentLocation.lat, currentLocation.lon], 16);
    } else if (routes.length > 0 && routes[0].coordinates.length > 0) {
      const bounds = L.latLngBounds(routes[0].coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(center, 10);
    }
  }, [center, routes, navigationMode, currentLocation, map]);
  
  return null;
}

function EcoRoute() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
  const [navigationMode, setNavigationMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [navigationWatcher, setNavigationWatcher] = useState(null);

  const geocodeLocation = async (locationName, countryCode = 'IN') => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&countrycodes=${countryCode}&format=json&limit=1`,
        { headers: { 'User-Agent': 'EcoRouteApp' } }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const handleFindRoute = async () => {
    if (!startLocation || !endLocation) {
      alert('Please enter both start and destination locations');
      return;
    }

    setLoading(true);
    try {
      const start = await geocodeLocation(startLocation);
      const end = await geocodeLocation(endLocation);

      if (!start || !end) {
        alert('Could not find one or both locations. Please try again.');
        setLoading(false);
        return;
      }

      setStartCoords(start);
      setEndCoords(end);

      const res = await getEcoRoute(start.lat, start.lon, end.lat, end.lon);
      setRoutes(res.data.routes);
      setMapCenter([start.lat, start.lon]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching routes:', error);
      alert('Error fetching routes. Please try again.');
      setLoading(false);
    }
  };

  const startNavigation = () => {
    setNavigationMode(true);
    
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Navigation location error:', error.code, error.message);
          if (error.code === 1) alert('Location permission denied. Cannot track location.');
          if (error.code === 3) alert('Location request timed out.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      setNavigationWatcher(watcher);
    } else {
      alert('Geolocation not supported on this device.');
      setNavigationMode(false);
    }
  };

  const stopNavigation = () => {
    setNavigationMode(false);
    if (navigationWatcher !== null) {
      navigator.geolocation.clearWatch(navigationWatcher);
      setNavigationWatcher(null);
    }
  };

  const handleUseLocation = (isStart) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
              { headers: { 'User-Agent': 'EcoRouteApp' } }
            );
            const data = await response.json();
            const locationName = data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
            
            if (isStart) {
              setStartLocation(locationName);
            } else {
              setEndLocation(locationName);
            }
          } catch (error) {
            if (isStart) {
              setStartLocation(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
            } else {
              setEndLocation(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
            }
          }
        },
        (error) => {
          console.error('Location error:', error.code, error.message);
          if (error.code === 1) alert('Location permission denied.');
          if (error.code === 3) alert('Location request timed out.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert('Geolocation not supported on this device.');
    }
  };

  const getRouteColor = (type) => {
    if (type === 'eco') return '#10b981';
    if (type === 'shortest') return '#3b82f6';
    return '#8b5cf6';
  };

  const getRouteLabel = (type) => {
    if (type === 'eco') return '🌿 Low Risk Route (Recommended)';
    if (type === 'shortest') return '⚡ Shortest Route';
    return '✨ Optimal Route';
  };

  const getRiskLevel = (pm25) => {
    if (pm25 <= 25) return { level: 'Low', color: '#10b981' };
    if (pm25 <= 50) return { level: 'Moderate', color: '#f59e0b' };
    if (pm25 <= 75) return { level: 'High', color: '#ef4444' };
    return { level: 'Very High', color: '#dc2626' };
  };

  if (navigationMode) {
    return (
      <div className="eco-route">
        <div style={{ background: '#1a202c', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0' }}>🧭 Navigation Active</h2>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                Both routes displayed - Compare in real-time
              </p>
            </div>
            <button 
              onClick={stopNavigation}
              style={{
                padding: '0.5rem 1rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✕ End Navigation
            </button>
          </div>
        </div>

        {currentLocation && (
          <div style={{ background: '#f0fdf4', border: '2px solid #10b981', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            <p style={{ margin: 0, color: '#166534' }}>
              📍 Current Location: {currentLocation.lat.toFixed(4)}, {currentLocation.lon.toFixed(4)}
            </p>
          </div>
        )}

        <MapContainer center={mapCenter} zoom={16} style={{ height: '600px', width: '100%', marginBottom: '1rem' }}>
          <MapUpdater center={mapCenter} routes={routes} navigationMode={navigationMode} currentLocation={currentLocation} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {routes.map((route, idx) => (
            <Polyline
              key={idx}
              positions={route.coordinates}
              color={getRouteColor(route.type)}
              weight={6}
              opacity={0.7}
              dashArray={route.type === 'shortest' ? '5, 5' : 'none'}
            />
          ))}

          {startCoords && (
            <Marker position={[startCoords.lat, startCoords.lon]}>
              <Popup><strong>Start</strong></Popup>
            </Marker>
          )}

          {endCoords && (
            <Marker position={[endCoords.lat, endCoords.lon]}>
              <Popup><strong>Destination</strong></Popup>
            </Marker>
          )}

          {currentLocation && (
            <Marker position={[currentLocation.lat, currentLocation.lon]}>
              <Popup><strong>You are here</strong></Popup>
            </Marker>
          )}
        </MapContainer>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {routes.map((route, idx) => {
            const riskInfo = getRiskLevel(route.avg_pm25);
            return (
              <div key={idx} style={{ background: '#f7fafc', border: `2px solid ${getRouteColor(route.type)}`, padding: '1rem', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: getRouteColor(route.type) }}>
                  {getRouteLabel(route.type)}
                </h4>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>📏 {route.distance} km</p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>⏱️ {route.duration} min</p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>💨 PM2.5: {route.avg_pm25} μg/m³</p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>🎯 Risk: {route.risk_score}</p>
                <p style={{ margin: '0.5rem 0 0 0', color: riskInfo.color, fontWeight: 'bold', fontSize: '0.9rem' }}>
                  ⚠️ {riskInfo.level} Risk
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="eco-route">
      <h1>🌿 Eco-Friendly Route Finder</h1>
      <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
        Find the safest route with lowest pollution and environmental risk
      </p>
      
      <div className="route-inputs">
        <div className="input-group">
          <h3>Start Location</h3>
          <div className="input-row">
            <input
              type="text"
              placeholder="Enter city, address, or place name"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              style={{ flex: 3 }}
            />
            <button onClick={() => handleUseLocation(true)} className="location-btn">
              📍 Use My Location
            </button>
          </div>
        </div>

        <div className="input-group">
          <h3>Destination</h3>
          <div className="input-row">
            <input
              type="text"
              placeholder="Enter city, address, or place name"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              style={{ flex: 3 }}
            />
            <button onClick={() => handleUseLocation(false)} className="location-btn">
              📍 Use My Location
            </button>
          </div>
        </div>

        <button onClick={handleFindRoute} className="find-route-btn" disabled={loading}>
          {loading ? '🔄 Finding Routes...' : '🌿 Find Low Risk Route'}
        </button>
      </div>

      {routes.length > 0 && (
        <div className="route-legend">
          <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>Route Comparison</h3>
          <button 
            onClick={startNavigation}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          >
            🧭 Start Navigation (View Both Routes)
          </button>
          {routes.map((route, idx) => {
            const riskInfo = getRiskLevel(route.avg_pm25);
            return (
              <div 
                key={idx} 
                className="legend-item" 
                style={{ 
                  padding: '1rem', 
                  background: '#f7fafc', 
                  borderRadius: '8px', 
                  marginBottom: '0.5rem',
                  borderLeft: `5px solid ${getRouteColor(route.type)}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="legend-line" style={{ backgroundColor: getRouteColor(route.type), width: '50px', height: '5px' }}></span>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{getRouteLabel(route.type)}</span>
                </div>
                <div className="route-stats" style={{ marginTop: '0.5rem', display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
                  <span>📏 {route.distance} km</span>
                  <span>⏱️ {route.duration} min</span>
                  <span>💨 PM2.5: {route.avg_pm25} μg/m³</span>
                  <span>🎯 Risk Score: {route.risk_score}</span>
                  <span style={{ color: riskInfo.color, fontWeight: 'bold' }}>⚠️ {riskInfo.level} Risk</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MapContainer center={mapCenter} zoom={8} style={{ height: '600px', width: '100%', marginTop: '20px' }}>
        <MapUpdater center={mapCenter} routes={routes} navigationMode={false} currentLocation={null} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {routes.map((route, idx) => {
          const riskInfo = getRiskLevel(route.avg_pm25);
          return (
            <Polyline
              key={idx}
              positions={route.coordinates}
              color={getRouteColor(route.type)}
              weight={6}
              opacity={0.8}
              dashArray={route.type === 'shortest' ? '5, 5' : 'none'}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>{getRouteLabel(route.type)}</h4>
                  <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                  <p><strong>Distance:</strong> {route.distance} km</p>
                  <p><strong>Duration:</strong> {route.duration} min</p>
                  <p><strong>Average PM2.5:</strong> {route.avg_pm25} μg/m³</p>
                  <p><strong>Risk Score:</strong> {route.risk_score}</p>
                  <p style={{ color: riskInfo.color, fontWeight: 'bold' }}>
                    <strong>Risk Level:</strong> {riskInfo.level}
                  </p>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {startCoords && (
          <Marker position={[startCoords.lat, startCoords.lon]}>
            <Popup><strong>Start:</strong><br/>{startLocation}</Popup>
          </Marker>
        )}

        {endCoords && (
          <Marker position={[endCoords.lat, endCoords.lon]}>
            <Popup><strong>Destination:</strong><br/>{endLocation}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default EcoRoute;
