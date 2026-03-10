import React from 'react';

function Navigation({ currentPage, setCurrentPage }) {
  const pages = ['Home', 'Dashboard', 'Risk Map', 'Eco Route', 'Health Advisor', 'Environmental Advisor'];

  return (
    <nav className="navigation">
      <div className="nav-brand" onClick={() => setCurrentPage('Home')} style={{ cursor: 'pointer' }}>
        🌍 Environmental Risk Platform
      </div>
      <div className="nav-links">
        {pages.map(page => (
          <button
            key={page}
            className={`nav-link ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
