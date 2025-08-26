import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Email Analysis System</h3>
            <p>
              A comprehensive tool for analyzing email receiving chains and 
              identifying Email Service Providers (ESPs) automatically.
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Features</h3>
            <p>• Automatic email reception and processing</p>
            <p>• Receiving chain visualization</p>
            <p>• ESP detection and analysis</p>
            <p>• Real-time monitoring</p>
          </div>
          
          <div className="footer-section">
            <h3>Technology Stack</h3>
            <p>• React.js Frontend</p>
            <p>• Node.js + Express Backend</p>
            <p>• MongoDB Database</p>
            <p>• IMAP Email Processing</p>
          </div>
          
          <div className="footer-section">
            <h3>Connect</h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a href="https://github.com/Bhuwan-Tiwari" target="_blank" rel="noopener noreferrer">
                <FaGithub size={24} />
              </a>
              <a href="https://www.linkedin.com/in/bhuwan-tiwari-68783422b/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={24} />
              </a>
              <a href="bhuwan1200@gmail.com">
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 LucidGrowth Email Analysis System. Built for technical demonstration.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
