import React from 'react';
import { FaServer, FaArrowRight, FaLock, FaUnlock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ReceivingChainVisualization = ({ receivingChain, emailInfo }) => {
  if (!receivingChain || receivingChain.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <FaServer size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
          <p style={{ color: '#6b7280' }}>No receiving chain data available</p>
        </div>
      </div>
    );
  }

  const getEncryptionIcon = (encryption) => {
    if (encryption && (encryption.includes('TLS') || encryption.includes('SSL'))) {
      return <FaLock style={{ color: '#10b981' }} title="Encrypted" />;
    }
    return <FaUnlock style={{ color: '#ef4444' }} title="Not Encrypted" />;
  };

  const getAuthIcon = (authResult) => {
    if (authResult === 'authenticated') {
      return <FaCheckCircle style={{ color: '#10b981' }} title="Authenticated" />;
    } else if (authResult === 'unauthenticated') {
      return <FaTimesCircle style={{ color: '#ef4444' }} title="Unauthenticated" />;
    }
    return null;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 style={{ margin: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaServer />
          Email Receiving Chain ({receivingChain.length} hops)
        </h3>
      </div>
      <div className="card-body">
        {/* Chain Overview */}
        <div className="mb-4 p-3" style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Total Hops:</strong> {receivingChain.length}
            </div>
            <div>
              <strong>First Server:</strong> {receivingChain[0]?.server || 'Unknown'}
            </div>
            <div>
              <strong>Last Server:</strong> {receivingChain[receivingChain.length - 1]?.server || 'Unknown'}
            </div>
            <div>
              <strong>Journey Time:</strong> {
                receivingChain[0]?.timestamp && receivingChain[receivingChain.length - 1]?.timestamp
                  ? `${Math.round((new Date(receivingChain[receivingChain.length - 1].timestamp) - new Date(receivingChain[0].timestamp)) / 1000)}s`
                  : 'Unknown'
              }
            </div>
          </div>
        </div>

        {/* Timeline Visualization */}
        <div className="receiving-chain-timeline">
          {receivingChain.map((hop, index) => (
            <div key={index} className="timeline-item">
              {/* Timeline connector */}
              {index > 0 && (
                <div className="timeline-connector">
                  <FaArrowRight style={{ color: '#6b7280' }} />
                </div>
              )}
              
              {/* Hop card */}
              <div className="hop-card">
                <div className="hop-header">
                  <div className="hop-number">
                    {hop.order}
                  </div>
                  <div className="hop-title">
                    <FaServer style={{ marginRight: '0.5rem' }} />
                    {hop.server || 'Unknown Server'}
                  </div>
                  <div className="hop-icons">
                    {getEncryptionIcon(hop.encryption)}
                    {getAuthIcon(hop.authResult)}
                  </div>
                </div>
                
                <div className="hop-details">
                  {hop.ip && (
                    <div className="hop-detail">
                      <strong>IP:</strong> <code>{hop.ip}</code>
                    </div>
                  )}
                  {hop.protocol && (
                    <div className="hop-detail">
                      <strong>Protocol:</strong> <span className="badge badge-info">{hop.protocol}</span>
                    </div>
                  )}
                  {hop.encryption && (
                    <div className="hop-detail">
                      <strong>Encryption:</strong> <span className="badge badge-success">{hop.encryption}</span>
                    </div>
                  )}
                  {hop.authResult && (
                    <div className="hop-detail">
                      <strong>Auth:</strong> 
                      <span className={`badge ${hop.authResult === 'authenticated' ? 'badge-success' : 'badge-warning'}`}>
                        {hop.authResult}
                      </span>
                    </div>
                  )}
                  <div className="hop-detail">
                    <strong>Timestamp:</strong> 
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {formatTimestamp(hop.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Summary */}
        <div className="mt-4 p-3" style={{ backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #e0f2fe' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#0369a1' }}>Security Analysis</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Encrypted Hops:</strong> {receivingChain.filter(hop => hop.encryption).length}/{receivingChain.length}
            </div>
            <div>
              <strong>Authenticated Hops:</strong> {receivingChain.filter(hop => hop.authResult === 'authenticated').length}/{receivingChain.length}
            </div>
            <div>
              <strong>Protocols Used:</strong> {[...new Set(receivingChain.map(hop => hop.protocol).filter(Boolean))].join(', ') || 'Unknown'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivingChainVisualization;
