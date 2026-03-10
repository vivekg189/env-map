import React, { useState, useEffect } from 'react';
import { FaCloudRain, FaMapSigns, FaRoute, FaBrain, FaShieldAlt, FaChartLine, FaMapPin, FaDatabase, FaChartBar, FaLightbulb, FaCheckCircle, FaArrowRight, FaStar, FaHeartbeat } from 'react-icons/fa';
import './LandingPage.css';

function LandingPage({ setCurrentPage }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg',
    'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg',
    'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg',
    'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg',
    'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-carousel">
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className={`carousel-slide ${idx === currentImageIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="carousel-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <FaStar size={16} /> Next-Gen Environmental Intelligence
          </div>
          <h1>Breathe Smarter, Live Healthier</h1>
          <p>AI-powered environmental monitoring that predicts risks before they happen. Protect your family with real-time insights.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => setCurrentPage('Dashboard')}>
              Start Monitoring <FaArrowRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('Risk Map')}>
              View Live Map
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Lives Protected</span>
            </div>
            <div className="stat">
              <span className="stat-number">100+</span>
              <span className="stat-label">Global Cities</span>
            </div>
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>Intelligent Features That Save Lives</h2>
          <p>Cutting-edge technology meets environmental protection</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper gradient-1">
              <FaCloudRain className="feature-icon" />
            </div>
            <h3>Predict Environmental Risks Early</h3>
            <p>Know Before It Happens - Our platform analyzes environmental trends and predicts pollution patterns up to 7 days in advance. Plan outdoor activities, travel, and daily routines with confidence by knowing when air quality is expected to improve or worsen.</p>
            <div className="feature-badge">Predictive Environmental Intelligence</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper gradient-2">
              <FaMapSigns className="feature-icon" />
            </div>
            <h3>Real-Time Environmental Monitoring</h3>
            <p>See What's Around You - Instantly view environmental conditions in your area. Interactive maps display PM2.5 levels, weather conditions, and risk scores with color-coded indicators so you can easily identify safer or riskier zones.</p>
            <div className="feature-badge">Live Environmental Updates</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper gradient-3">
              <FaRoute className="feature-icon" />
            </div>
            <h3>Eco-Friendly Navigation</h3>
            <p>Smarter Commute Routes - Find routes that reduce pollution exposure during your commute. The system compares the fastest route and the cleanest route, helping you choose a healthier path without significantly increasing travel time.</p>
            <div className="feature-badge">Cleaner Travel Decisions</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper gradient-4">
              <FaBrain className="feature-icon" />
            </div>
            <h3>AI Environmental Advisor</h3>
            <p>Personalized Environmental Guidance - Receive intelligent recommendations based on your health profile, activity level, and environmental conditions. Whether you are sensitive to pollution or planning outdoor exercise, the system provides personalized safety advice.</p>
            <div className="feature-badge">AI-Powered Health Insights</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>Our Intelligent Pipeline</h2>
          <p>From raw data to actionable insights in milliseconds</p>
        </div>
        <div className="pipeline-grid">
          <div className="pipeline-card">
            <div className="card-number">01</div>
            <div className="pipeline-icon-wrapper">
              <FaMapPin className="pipeline-icon" />
            </div>
            <h3>Detect Location</h3>
            <p>Pinpoint your exact location with GPS precision</p>
          </div>
          <div className="pipeline-card">
            <div className="card-number">02</div>
            <div className="pipeline-icon-wrapper">
              <FaDatabase className="pipeline-icon" />
            </div>
            <h3>Collect Data</h3>
            <p>Aggregate real-time data from 1000+ sensors globally</p>
          </div>
          <div className="pipeline-card">
            <div className="card-number">03</div>
            <div className="pipeline-icon-wrapper">
              <FaChartBar className="pipeline-icon" />
            </div>
            <h3>Analyze Risks</h3>
            <p>Process with advanced ML models for accuracy</p>
          </div>
          <div className="pipeline-card">
            <div className="card-number">04</div>
            <div className="pipeline-icon-wrapper">
              <FaLightbulb className="pipeline-icon" />
            </div>
            <h3>Deliver Insights</h3>
            <p>Get personalized recommendations instantly</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="section-header">
          <h2>Why EcoRisk AI Leads the Industry</h2>
          <p>Technology that actually protects your health</p>
        </div>
        <div className="benefits-list">
          <div className="benefit-item">
            <div className="benefit-icon-box">
              <FaShieldAlt className="benefit-icon" />
            </div>
            <div>
              <h4>Real-Time Protection</h4>
              <p>Instant alerts when pollution levels spike. Never be caught off-guard again.</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon-box">
              <FaChartLine className="benefit-icon" />
            </div>
            <div>
              <h4>7-Day Forecasting</h4>
              <p>Plan your week with confidence. Know when it's safe to exercise outdoors.</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon-box">
              <FaHeartbeat className="benefit-icon" />
            </div>
            <div>
              <h4>Health Personalization</h4>
              <p>Tailored advice based on your health profile and location patterns.</p>
            </div>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon-box">
              <FaStar className="benefit-icon" />
            </div>
            <div>
              <h4>Global Coverage</h4>
              <p>Monitor 100+ cities worldwide. Travel with environmental intelligence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Join the Environmental Revolution</h2>
          <p>50,000+ users already protecting their health. Be part of the change.</p>
          <button className="btn btn-cta" onClick={() => setCurrentPage('Dashboard')}>
            Start Your Journey <FaArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
