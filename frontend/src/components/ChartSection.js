import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChartSection = ({ predictions }) => (
  <div className="chart-container">
    <div className="chart-header">
      <h2>7-Day Risk Forecast</h2>
      <p>Predicted environmental risk levels for the next week</p>
    </div>
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={predictions} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip 
            contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #ddd', borderRadius: '8px' }}
            cursor={{ stroke: '#2E7D32', strokeWidth: 2 }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="predicted_risk" 
            stroke="#2E7D32" 
            strokeWidth={3}
            dot={{ fill: '#2E7D32', r: 5 }}
            activeDot={{ r: 7 }}
            fillOpacity={1}
            fill="url(#colorRisk)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ChartSection;
