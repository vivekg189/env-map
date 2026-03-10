import React, { useState, useEffect } from 'react';
import { getAnalyticsData } from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLocation } from '../context/LocationContext';

function Analytics() {
  const { location, loading: locationLoading } = useLocation();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('3h');

  useEffect(() => {
    if (!locationLoading) {
      fetchAnalyticsData();
    }
  }, [location, locationLoading, timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const res = await getAnalyticsData(timeRange, location.lat, location.lon);
      setChartData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;

  return (
    <div className="analytics">
      <h1>Environmental Analytics</h1>
      
      <div className="time-range-selector">
        <button 
          className={timeRange === '1h' ? 'active' : ''} 
          onClick={() => setTimeRange('1h')}
        >
          Last 1 Hour
        </button>
        <button 
          className={timeRange === '3h' ? 'active' : ''} 
          onClick={() => setTimeRange('3h')}
        >
          Last 3 Hours
        </button>
      </div>
      
      <div className="chart-section">
        <h2>Pollution Trends (PM2.5)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pm25" stroke="#ef4444" strokeWidth={2} name="PM2.5 (μg/m³)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h2>Temperature Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} name="Temperature (°C)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h2>Risk Score History</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="risk_score" fill="#8884d8" name="Risk Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
