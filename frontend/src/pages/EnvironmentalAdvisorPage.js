import React, { useState, useEffect } from 'react';
import EnvironmentalAdvisorPanel from '../components/EnvironmentalAdvisorPanel';

const EnvironmentalAdvisorPage = () => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        let errorMsg = 'Unable to retrieve your location';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied. Please enable location access.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out.';
        }
        setLocationError(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="advisor-page">
      <div className="page-header">
        <h1>🌍 AI Environmental Advisor</h1>
        <p>Get personalized environmental insights for your location</p>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Detecting your location...</p>
        </div>
      )}

      {locationError && (
        <div className="error-container">
          <p className="error-message">{locationError}</p>
          <button onClick={getLocation} className="retry-btn">
            Retry Location Detection
          </button>
        </div>
      )}

      {location && !loading && (
        <>
          <div className="location-info">
            <p>📍 Latitude: {location.latitude.toFixed(4)}</p>
            <p>📍 Longitude: {location.longitude.toFixed(4)}</p>
          </div>
          <EnvironmentalAdvisorPanel
            latitude={location.latitude}
            longitude={location.longitude}
          />
        </>
      )}

      <style>{`
        .advisor-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .page-header h1 {
          color: #1a237e;
          font-size: 32px;
          margin: 0 0 10px 0;
        }

        .page-header p {
          color: #666;
          font-size: 16px;
          margin: 0;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-container p {
          color: #666;
          font-size: 16px;
        }

        .error-container {
          background: #ffebee;
          border: 2px solid #ef5350;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
        }

        .error-message {
          color: #c62828;
          font-size: 16px;
          margin: 0 0 15px 0;
        }

        .retry-btn {
          padding: 10px 20px;
          background: #ef5350;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .retry-btn:hover {
          background: #e53935;
        }

        .location-info {
          background: #e3f2fd;
          border-left: 4px solid #2196F3;
          border-radius: 6px;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-size: 14px;
          color: #1565c0;
        }

        .location-info p {
          margin: 4px 0;
        }

        @media (max-width: 768px) {
          .advisor-page {
            padding: 10px;
          }

          .page-header h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default EnvironmentalAdvisorPage;
