import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import RiskMap from './pages/RiskMap';
import EcoRoute from './pages/EcoRoute';
import HealthAdvisor from './pages/HealthAdvisor';
import EnvironmentalAdvisorPage from './pages/EnvironmentalAdvisorPage';
import { LocationProvider } from './context/LocationContext';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('Home');

  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'Home';
    setCurrentPage(hash);
  }, []);

  useEffect(() => {
    window.location.hash = currentPage;
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <LandingPage setCurrentPage={setCurrentPage} />;
      case 'Dashboard':
        return <Dashboard />;
      case 'Risk Map':
        return <RiskMap />;
      case 'Eco Route':
        return <EcoRoute />;
      case 'Health Advisor':
        return <HealthAdvisor />;
      case 'Environmental Advisor':
        return <EnvironmentalAdvisorPage />;
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <LocationProvider>
      <div className="App">
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="content">
          {renderPage()}
        </div>
      </div>
    </LocationProvider>
  );
}

export default App;
