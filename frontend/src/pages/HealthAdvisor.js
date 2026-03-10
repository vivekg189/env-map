import React, { useState, useEffect } from 'react';
import { getAIHealthRisk } from '../services/api';

function HealthAdvisor() {
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    condition: 'healthy',
    activity: 'walking',
    exposure_time: 30
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location error:', error);
          alert('Please enable location access for personalized health advice');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userLocation) {
      alert('Location not detected. Please enable location access.');
      return;
    }

    if (!formData.age) {
      alert('Please enter your age');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...userLocation,
        ...formData,
        age: parseInt(formData.age)
      };

      const res = await getAIHealthRisk(payload);
      setResult(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Error getting health advice. Please try again.');
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    if (level === 'Low') return '#10b981';
    if (level === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="health-advisor">
      <h1>🏥 AI Personalized Health Risk Advisor</h1>
      <p style={{ color: '#718096', marginBottom: '2rem' }}>
        Get personalized health recommendations based on current environmental conditions
      </p>

      <div className="health-form-container">
        <form onSubmit={handleSubmit} className="health-form">
          <h3>Your Health Profile</h3>
          
          <div className="form-field">
            <label>Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              placeholder="Enter your age"
              min="1"
              max="120"
              required
            />
          </div>

          <div className="form-field">
            <label>Health Condition</label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
            >
              <option value="healthy">Healthy</option>
              <option value="asthma">Asthma</option>
              <option value="heart disease">Heart Disease</option>
              <option value="child">Child (Under 12)</option>
              <option value="elderly">Elderly (Over 65)</option>
            </select>
          </div>

          <div className="form-field">
            <label>Activity Level</label>
            <select
              value={formData.activity}
              onChange={(e) => setFormData({...formData, activity: e.target.value})}
            >
              <option value="resting">Resting</option>
              <option value="walking">Walking</option>
              <option value="exercise">Exercise</option>
            </select>
          </div>

          <div className="form-field">
            <label>Planned Exposure Duration (minutes)</label>
            <input
              type="number"
              value={formData.exposure_time}
              onChange={(e) => setFormData({...formData, exposure_time: e.target.value})}
              min="5"
              max="480"
            />
          </div>

          <button type="submit" className="analyze-btn" disabled={loading}>
            {loading ? '🔄 Analyzing...' : '🧠 Analyze Health Risk'}
          </button>
        </form>

        {result && (
          <div className="health-result">
            <h3>Health Risk Assessment</h3>
            
            <div className="risk-badge" style={{ backgroundColor: getRiskColor(result.risk_level) }}>
              <div className="risk-score">{result.risk_score}</div>
              <div className="risk-label">{result.risk_level} Risk</div>
            </div>

            <div className="env-summary">
              <h4>Current Environmental Conditions</h4>
              <div className="env-grid">
                <div className="env-item">
                  <span className="env-label">PM2.5</span>
                  <span className="env-value">{result.environmental_data.pm25} μg/m³</span>
                </div>
                <div className="env-item">
                  <span className="env-label">Temperature</span>
                  <span className="env-value">{result.environmental_data.temperature}°C</span>
                </div>
                <div className="env-item">
                  <span className="env-label">Humidity</span>
                  <span className="env-value">{result.environmental_data.humidity}%</span>
                </div>
              </div>
            </div>

            <div className="ai-advice">
              <h4>🤖 AI Health Recommendations</h4>
              <div className="advice-content">
                {result.ai_health_advice}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HealthAdvisor;
