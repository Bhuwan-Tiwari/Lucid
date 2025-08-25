import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaEnvelope, FaChartLine, FaInfoCircle } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <FaEnvelope />
            Email Analysis System
          </Link>
          
          <nav className="nav">
            <Link to="/" className={isActive('/')}>
              <FaChartLine />
              Dashboard
            </Link>
            <Link to="/about" className={isActive('/about')}>
              <FaInfoCircle />
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
