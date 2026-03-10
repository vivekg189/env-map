import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { submitReport, getReports } from '../services/api';
import { useLocation } from '../context/LocationContext';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position}><Popup>Selected Location</Popup></Marker> : null;
}

function ReportsPage() {
  const { location } = useLocation();
  const [type, setType] = useState('Air Pollution');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState(null);
  const [reports, setReports] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await getReports();
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      alert('Please select a location on the map');
      return;
    }

    try {
      await submitReport({
        type,
        description,
        latitude: position[0],
        longitude: position[1],
        image_url: ''
      });
      setSubmitted(true);
      setDescription('');
      setPosition(null);
      fetchReports();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div className="reports-page">
      <h2>📢 Citizen Environmental Reporting</h2>
      
      <div className="reports-container">
        <div className="report-form">
          <h3>Submit a Report</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Issue Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option>Air Pollution</option>
                <option>Water Pollution</option>
                <option>Garbage Dumping</option>
                <option>Industrial Waste</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the environmental issue..."
                rows="4"
                required
              />
            </div>
            
            <p className="instruction">📍 Click on the map to select location</p>
            {position && <p className="selected-location">Selected: {position[0].toFixed(4)}, {position[1].toFixed(4)}</p>}
            
            <button type="submit" className="submit-btn">Submit Report</button>
            {submitted && <p className="success-message">✅ Report submitted successfully!</p>}
          </form>
        </div>

        <div className="reports-list">
          <h3>Recent Reports ({reports.length})</h3>
          <div className="reports-scroll">
            {reports.map((report) => (
              <div key={report.id} className="report-item">
                <div className="report-type">{report.type}</div>
                <p>{report.description}</p>
                <small>{new Date(report.timestamp).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MapContainer center={[location.lat, location.lon]} zoom={2} style={{ height: '400px', width: '100%', marginTop: '20px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker position={position} setPosition={setPosition} />
        {reports.map((report) => (
          <Marker key={report.id} position={[report.latitude, report.longitude]}>
            <Popup>
              <strong>{report.type}</strong><br />
              {report.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default ReportsPage;
