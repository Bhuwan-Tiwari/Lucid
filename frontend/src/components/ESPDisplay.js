import React from 'react';
import { 
  FaGoogle, 
  FaMicrosoft, 
  FaYahoo, 
  FaAmazon, 
  FaEnvelope, 
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaQuestionCircle
} from 'react-icons/fa';

const ESPDisplay = ({ espInfo, emailInfo }) => {
  // ESP icon mapping
  const getESPIcon = (provider) => {
    const iconMap = {
      'Gmail': FaGoogle,
      'Outlook/Hotmail': FaMicrosoft,
      'Yahoo Mail': FaYahoo,
      'Amazon SES': FaAmazon,
      'SendGrid': FaEnvelope,
      'Mailgun': FaEnvelope,
      'Mandrill': FaEnvelope,
      'Postmark': FaEnvelope,
      'Zoho Mail': FaEnvelope,
    };
    
    return iconMap[provider] || FaEnvelope;
  };

  // Confidence level styling
  const getConfidenceStyle = (confidence) => {
    if (confidence >= 80) {
      return {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        icon: FaCheckCircle,
        label: 'High Confidence'
      };
    } else if (confidence >= 50) {
      return {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        icon: FaExclamationTriangle,
        label: 'Medium Confidence'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        icon: FaQuestionCircle,
        label: 'Low Confidence'
      };
    }
  };

  // Detection method descriptions
  const getDetectionMethodDescription = (method) => {
    const descriptions = {
      'header_analysis': 'Detected through email header analysis',
      'domain_lookup': 'Identified by sender domain',
      'ip_analysis': 'Determined by originating IP address',
      'authentication_records': 'Found via authentication records (SPF/DKIM/DMARC)'
    };
    
    return descriptions[method] || 'Detection method unknown';
  };

  if (!espInfo) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <FaQuestionCircle size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <p style={{ color: '#6b7280' }}>ESP information not available</p>
        </div>
      </div>
    );
  }

  const ESPIcon = getESPIcon(espInfo.provider);
  const confidenceStyle = getConfidenceStyle(espInfo.confidence);
  const ConfidenceIcon = confidenceStyle.icon;

  return (
    <div className="card">
      <div className="card-header">
        <h3 style={{ margin: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaShieldAlt />
          Email Service Provider (ESP) Detection
        </h3>
      </div>
      <div className="card-body">
        {/* Main ESP Display */}
        <div className="esp-info-card" style={{ background: confidenceStyle.background }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <ESPIcon size={48} />
            <div>
              <div className="esp-provider-name">{espInfo.provider}</div>
              <div className="esp-confidence">
                <ConfidenceIcon style={{ marginRight: '0.5rem' }} />
                {espInfo.confidence}% Confidence
              </div>
            </div>
          </div>
          
          <div style={{ fontSize: '1rem', opacity: 0.9 }}>
            {confidenceStyle.label} • {getDetectionMethodDescription(espInfo.detectionMethod)}
          </div>
        </div>

        {/* Detection Details */}
        <div className="mt-4">
          <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Detection Details</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="card" style={{ margin: '0' }}>
              <div className="card-body">
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Detection Method
                </h5>
                <p style={{ margin: '0', fontWeight: '600' }}>
                  {espInfo.detectionMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
            </div>
            
            <div className="card" style={{ margin: '0' }}>
              <div className="card-body">
                <h5 style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Confidence Score
                </h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '100px', 
                    height: '8px', 
                    backgroundColor: '#e5e7eb', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${espInfo.confidence}%`,
                      height: '100%',
                      backgroundColor: espInfo.confidence >= 80 ? '#10b981' : espInfo.confidence >= 50 ? '#f59e0b' : '#ef4444',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <span style={{ fontWeight: '600' }}>{espInfo.confidence}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detection Indicators */}
        {espInfo.indicators && espInfo.indicators.length > 0 && (
          <div className="mt-4">
            <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Detection Indicators</h4>
            <div className="esp-indicators">
              {espInfo.indicators.map((indicator, index) => (
                <span key={index} className="esp-indicator">
                  {indicator}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ESP Information */}
        <div className="mt-4 p-3" style={{ backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #e0f2fe' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#0369a1' }}>About {espInfo.provider}</h4>
          <div style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.6' }}>
            {getESPDescription(espInfo.provider)}
          </div>
        </div>

        {/* Reliability Assessment */}
        <div className="mt-4">
          <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Reliability Assessment</h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className={`badge ${espInfo.confidence >= 80 ? 'badge-success' : espInfo.confidence >= 50 ? 'badge-warning' : 'badge-danger'}`}>
              Detection Quality: {espInfo.confidence >= 80 ? 'Excellent' : espInfo.confidence >= 50 ? 'Good' : 'Poor'}
            </div>
            <div className="badge badge-info">
              Method: {espInfo.detectionMethod.replace('_', ' ')}
            </div>
            <div className="badge badge-secondary">
              Indicators: {espInfo.indicators ? espInfo.indicators.length : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ESP descriptions
const getESPDescription = (provider) => {
  const descriptions = {
    'Gmail': 'Google Gmail is a free email service developed by Google. It is widely used for personal and business communications.',
    'Outlook/Hotmail': 'Microsoft Outlook (formerly Hotmail) is a web-based email service provided by Microsoft as part of the Office 365 suite.',
    'Yahoo Mail': 'Yahoo Mail is a web-based email service provided by Yahoo. It offers free and premium email services.',
    'Amazon SES': 'Amazon Simple Email Service (SES) is a cloud-based email sending service designed for bulk email sending and transactional emails.',
    'SendGrid': 'SendGrid is a cloud-based email delivery platform that provides reliable email delivery for applications and marketing campaigns.',
    'Mailgun': 'Mailgun is an email automation service provided by Rackspace for sending, receiving, and tracking emails.',
    'Mandrill': 'Mandrill is a transactional email API for MailChimp users, designed for sending automated, one-to-one emails.',
    'Postmark': 'Postmark is a fast and reliable transactional email service for web applications.',
    'Zoho Mail': 'Zoho Mail is a web-based email service provided by Zoho Corporation, popular among businesses.',
    'Unknown': 'The email service provider could not be identified with sufficient confidence.'
  };
  
  return descriptions[provider] || 'Information about this email service provider is not available.';
};

export default ESPDisplay;
