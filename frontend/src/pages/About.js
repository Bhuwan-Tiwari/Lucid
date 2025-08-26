import React from 'react';
import {
  FaEnvelope,
  FaServer,
  FaShieldAlt,
  FaChartLine,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaExternalLinkAlt
} from 'react-icons/fa';

const About = () => {
  return (
    <div className="container">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="dashboard-title">About Email Analysis System</h1>
        <p className="dashboard-subtitle">
          Understanding how emails travel and identifying their origins
        </p>
      </div>

      {/* Overview */}
      <div className="card mb-6">
        <div className="card-body">
          <h2 style={{ marginBottom: '1.5rem', color: '#374151' }}>Project Overview</h2>
          <p style={{ fontSize: '1.125rem', lineHeight: '1.7', color: '#4b5563' }}>
            The Email Analysis System is a comprehensive full-stack application designed to automatically 
            analyze incoming emails and extract valuable metadata. It identifies the complete receiving 
            chain (the path emails take through various servers) and detects the Email Service Provider 
            (ESP) used to send the email.
          </p>
          <p style={{ fontSize: '1.125rem', lineHeight: '1.7', color: '#4b5563', marginTop: '1rem' }}>
            This system demonstrates advanced email header parsing, network analysis, and pattern 
            recognition techniques used by professional email security and deliverability tools.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 style={{ margin: '0' }}>Key Features</h2>
        </div>
        <div className="card-body">
          <div className="dashboard-grid">
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <FaEnvelope size={48} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Automatic Email Reception</h3>
              <p style={{ color: '#6b7280' }}>
                Monitors designated email addresses and automatically processes incoming test emails
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <FaServer size={48} style={{ color: '#10b981', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Receiving Chain Analysis</h3>
              <p style={{ color: '#6b7280' }}>
                Extracts and visualizes the complete path emails take through mail servers
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <FaShieldAlt size={48} style={{ color: '#f59e0b', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>ESP Detection</h3>
              <p style={{ color: '#6b7280' }}>
                Identifies Email Service Providers using advanced pattern matching and analysis
              </p>
            </div>
            
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <FaChartLine size={48} style={{ color: '#8b5cf6', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Real-time Dashboard</h3>
              <p style={{ color: '#6b7280' }}>
                Responsive web interface for viewing analysis results and system statistics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 style={{ margin: '0' }}>Technology Stack</h2>
        </div>
        <div className="card-body">
          <div className="dashboard-grid">
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FaReact style={{ color: '#61dafb' }} />
                Frontend
              </h3>
              <ul style={{ listStyle: 'none', padding: '0' }}>
                <li style={{ padding: '0.25rem 0' }}>• React.js with modern hooks</li>
                <li style={{ padding: '0.25rem 0' }}>• React Router for navigation</li>
                <li style={{ padding: '0.25rem 0' }}>• Responsive CSS design</li>
                <li style={{ padding: '0.25rem 0' }}>• Axios for API communication</li>
                <li style={{ padding: '0.25rem 0' }}>• React Icons for UI elements</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FaNodeJs style={{ color: '#339933' }} />
                Backend
              </h3>
              <ul style={{ listStyle: 'none', padding: '0' }}>
                <li style={{ padding: '0.25rem 0' }}>• Node.js with Express.js</li>
                <li style={{ padding: '0.25rem 0' }}>• IMAP email processing</li>
                <li style={{ padding: '0.25rem 0' }}>• Email header parsing</li>
                <li style={{ padding: '0.25rem 0' }}>• RESTful API design</li>
                <li style={{ padding: '0.25rem 0' }}>• Security middleware</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FaDatabase style={{ color: '#47a248' }} />
                Database
              </h3>
              <ul style={{ listStyle: 'none', padding: '0' }}>
                <li style={{ padding: '0.25rem 0' }}>• MongoDB for data storage</li>
                <li style={{ padding: '0.25rem 0' }}>• Mongoose ODM</li>
                <li style={{ padding: '0.25rem 0' }}>• Indexed queries</li>
                <li style={{ padding: '0.25rem 0' }}>• Data validation</li>
                <li style={{ padding: '0.25rem 0' }}>• Aggregation pipelines</li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Additional Tools</h3>
              <ul style={{ listStyle: 'none', padding: '0' }}>
                <li style={{ padding: '0.25rem 0' }}>• Email parsing libraries</li>
                <li style={{ padding: '0.25rem 0' }}>• Pattern matching algorithms</li>
                <li style={{ padding: '0.25rem 0' }}>• Error handling & logging</li>
                <li style={{ padding: '0.25rem 0' }}>• Rate limiting</li>
                <li style={{ padding: '0.25rem 0' }}>• Environment configuration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 style={{ margin: '0' }}>How It Works</h2>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                flexShrink: 0
              }}>
                1
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Email Reception</h4>
                <p style={{ color: '#6b7280', margin: '0' }}>
                  The system monitors a designated email address using IMAP protocol. When emails arrive 
                  with the specified test subject line, they are automatically captured for analysis.
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                flexShrink: 0
              }}>
                2
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Header Parsing</h4>
                <p style={{ color: '#6b7280', margin: '0' }}>
                  Email headers are parsed to extract "Received" headers, which contain information about 
                  each server the email passed through, including timestamps, IP addresses, and protocols.
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                flexShrink: 0
              }}>
                3
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>ESP Detection</h4>
                <p style={{ color: '#6b7280', margin: '0' }}>
                  Advanced pattern matching analyzes headers, domains, and authentication records to 
                  identify the Email Service Provider with confidence scoring.
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                flexShrink: 0
              }}>
                4
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>Visualization</h4>
                <p style={{ color: '#6b7280', margin: '0' }}>
                  Results are presented through an intuitive web interface with timeline visualizations 
                  for receiving chains and detailed ESP information with confidence indicators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* References */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 style={{ margin: '0' }}>References & Tools</h2>
        </div>
        <div className="card-body">
          <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
            This project was inspired by and references professional email analysis tools:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a 
              href="https://toolbox.googleapps.com/apps/messageheader/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                textDecoration: 'none',
                color: '#3b82f6',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f8fafc'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <FaExternalLinkAlt />
              Google Message Header Analyzer
            </a>
            <a 
              href="https://inboxdoctor.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                textDecoration: 'none',
                color: '#3b82f6',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f8fafc'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <FaExternalLinkAlt />
              InboxDoctor Free Tests
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mb-6">
      
      </div>
    </div>
  );
};

export default About;
