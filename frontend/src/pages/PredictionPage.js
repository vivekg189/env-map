import React, { useState, useEffect } from 'react';
import { getPrediction, getSafetyScore } from '../services/api';
import PredictionChart from '../components/PredictionChart';
import SafetyScoreCard from '../components/SafetyScoreCard';
import { useLocation } from '../context/LocationContext';

function PredictionPage() {
  const { location, loading: locationLoading } = useLocation();
  const [predictions, setPredictions] = useState([]);
  const [safetyData, setSafetyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locationLoading) {
      fetchData();
    }
  }, [location, locationLoading]);

  const fetchData = async () => {
    try {
      const predResponse = await getPrediction();
      setPredictions(predResponse.data.predictions || []);
      
      const safetyResponse = await getSafetyScore(location.lat, location.lon);
      setSafetyData(safetyResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="loading">Loading predictions...</div>;
  }

  return (
    <div className="prediction-page">
      <h2>🤖 AI Environmental Risk Prediction</h2>
      
      <div className="prediction-container">
        {safetyData && <SafetyScoreCard data={safetyData} />}
        
        <div className="prediction-section">
          {predictions.length > 0 ? (
            <PredictionChart predictions={predictions} />
          ) : (
            <div className="no-data">
              <p>Insufficient historical data for predictions</p>
              <p>System will generate predictions after collecting more data</p>
            </div>
          )}
        </div>

        <div className="prediction-info">
          <h3>About AI Predictions</h3>
          <p>Our AI model uses machine learning to predict future environmental risk levels based on:</p>
          <ul>
            <li>Historical PM2.5 and PM10 data</li>
            <li>Temperature and humidity patterns</li>
            <li>Seasonal trends</li>
            <li>Location-specific factors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PredictionPage;
