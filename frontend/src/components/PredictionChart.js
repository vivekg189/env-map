import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PredictionChart({ predictions }) {
  return (
    <div className="prediction-chart">
      <h3>📊 7-Day Risk Prediction</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={predictions}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="predicted_risk" stroke="#ff5722" strokeWidth={2} name="Predicted Risk" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PredictionChart;
