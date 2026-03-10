import React, { useState, useEffect } from 'react';
import { getRiskScore, getPrediction } from '../services/api';
import { FaWind, FaTint, FaThermometerHalf, FaTachometerAlt, FaChartLine } from 'react-icons/fa';
import RiskCard from '../components/RiskCard';
import StatCard from '../components/StatCard';
import ChartSection from '../components/ChartSection';
import './Dashboard.css';

function Dashboard() {
  const [riskData, setRiskData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserLocation();
    const interval = setInterval(() => {
      getUserLocation();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Location error:', error.code, error.message);
          fetchData(40.7128, -74.0060);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      fetchData(40.7128, -74.0060);
    }
  };

  const fetchData = async (lat, lon) => {
    try {
      const riskRes = await getRiskScore(lat, lon);
      const predRes = await getPrediction();
      setRiskData(riskRes.data);
      setPredictions(predRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading Environmental Data...</div>;

  const getRiskColor = (level) => {
    if (level === 'Low') return '#10b981';
    if (level === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  const getRiskBgColor = (level) => {
    if (level === 'Low') return 'rgba(16, 185, 129, 0.1)';
    if (level === 'Medium') return 'rgba(245, 158, 11, 0.1)';
    return 'rgba(239, 68, 68, 0.1)';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Environmental Dashboard</h1>
          <p>Real-time environmental monitoring and analysis</p>
        </div>
      </div>

      {riskData && (
        <>
          <RiskCard riskData={riskData} getRiskColor={getRiskColor} getRiskBgColor={getRiskBgColor} />

          <div className="stats-grid">
            <StatCard 
              icon={FaThermometerHalf}
              title="Temperature"
              value={riskData.temperature}
              unit="°C"
            />
            <StatCard 
              icon={FaTint}
              title="Humidity"
              value={riskData.humidity}
              unit="%"
            />
            <StatCard 
              icon={FaWind}
              title="Wind Speed"
              value={riskData.wind_speed}
              unit=""
            />
            <StatCard 
              icon={FaTachometerAlt}
              title="Pressure"
              value={riskData.pressure}
              unit=""
            />
            <StatCard 
              icon={FaChartLine}
              title="PM2.5"
              value={riskData.pm25}
              unit=""
            />
          </div>

          <ChartSection predictions={predictions} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
