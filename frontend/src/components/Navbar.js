import React from 'react';
import './Navbar.css';

function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => setCurrentPage('Home')} style={{ cursor: 'pointer' }}>
          EcoRisk AI
        </div>
        <div className="navbar-links">
          <button onClick={() => setCurrentPage('Dashboard')} className="nav-link">Dashboard</button>
          <button onClick={() => setCurrentPage('Risk Map')} className="nav-link">Risk Map</button>
          <button onClick={() => setCurrentPage('Eco Route')} className="nav-link">Eco Route</button>
          <button onClick={() => setCurrentPage('Health Advisor')} className="nav-link">Health Advisor</button>
          <button onClick={() => setCurrentPage('Environmental Advisor')} className="nav-link">AI Advisor</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
