import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaEnvelope,
  FaUser,
  FaClock,
  FaSync
} from 'react-icons/fa';
import { emailAPI } from '../services/api';
import ReceivingChainVisualization from '../components/ReceivingChainVisualization';
import ESPDisplay from '../components/ESPDisplay';

const EmailDetails = () => {
  const { id } = useParams();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEmailDetails();
  }, [id]);

  const loadEmailDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await emailAPI.getEmailById(id);
      setEmail(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadEmailDetails();
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'badge badge-success',
      processing: 'badge badge-warning',
      pending: 'badge badge-info',
      failed: 'badge badge-danger'
    };
    return badges[status] || 'badge badge-secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4">Loading email details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="card-body">
            <h3 style={{ color: '#ef4444', margin: '0 0 1rem 0' }}>Error Loading Email</h3>
            <p>{error}</p>
            <div className="mt-4">
              <Link to="/" className="btn btn-primary">
                <FaArrowLeft />
                Back to Dashboard
              </Link>
              <button className="btn btn-secondary ml-2" onClick={handleRefresh}>
                <FaSync />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="container">
        <div className="card">
          <div className="card-body text-center">
            <p>Email not found</p>
            <Link to="/" className="btn btn-primary">
              <FaArrowLeft />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="mb-6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link to="/" className="btn btn-outline mb-3">
              <FaArrowLeft />
              Back to Dashboard
            </Link>
            <h1 style={{ margin: '0', fontSize: '2rem', fontWeight: '700' }}>
              Email Analysis Details
            </h1>
          </div>
          <button className="btn btn-secondary" onClick={handleRefresh}>
            <FaSync />
            Refresh
          </button>
        </div>
      </div>

      {/* Email Overview */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 style={{ margin: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaEnvelope />
            Email Information
          </h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Basic Details</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <strong>Subject:</strong>
                  <div style={{ marginTop: '0.25rem', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '0.25rem' }}>
                    {email.subject}
                  </div>
                </div>
                <div>
                  <strong>From:</strong>
                  <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaUser style={{ color: '#6b7280' }} />
                    {email.from}
                  </div>
                </div>
                <div>
                  <strong>To:</strong>
                  <div style={{ marginTop: '0.25rem' }}>{email.to}</div>
                </div>
                <div>
                  <strong>Message ID:</strong>
                  <div style={{ marginTop: '0.25rem', fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                    {email.messageId}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Processing Status</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <strong>Status:</strong>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span className={getStatusBadge(email.processingStatus)}>
                      {email.processingStatus}
                    </span>
                  </div>
                </div>
                <div>
                  <strong>Received:</strong>
                  <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaClock style={{ color: '#6b7280' }} />
                    {formatDate(email.receivedAt)}
                  </div>
                </div>
                {email.processedAt && (
                  <div>
                    <strong>Processed:</strong>
                    <div style={{ marginTop: '0.25rem' }}>{formatDate(email.processedAt)}</div>
                  </div>
                )}
                <div>
                  <strong>Email Size:</strong>
                  <div style={{ marginTop: '0.25rem' }}>{(email.size / 1024).toFixed(2)} KB</div>
                </div>
                {email.attachmentCount > 0 && (
                  <div>
                    <strong>Attachments:</strong>
                    <div style={{ marginTop: '0.25rem' }}>{email.attachmentCount}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="mb-6">
        <ESPDisplay espInfo={email.espInfo} emailInfo={email} />
      </div>

      <div className="mb-6">
        <ReceivingChainVisualization receivingChain={email.receivingChain} emailInfo={email} />
      </div>

      {email.processingErrors && email.processingErrors.length > 0 && (
        <div className="card mb-6">
          <div className="card-header">
            <h3 style={{ margin: '0', color: '#ef4444' }}>Processing Errors</h3>
          </div>
          <div className="card-body">
            {email.processingErrors.map((error, index) => (
              <div key={index} className="mb-3 p-3" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem' }}>
                <div style={{ fontWeight: '600', color: '#dc2626' }}>{error.error}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {formatDate(error.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: '0' }}>Raw Email Data</h3>
        </div>
        <div className="card-body">
          <details>
            <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '1rem' }}>
              View Raw Headers
            </summary>
            <pre style={{ 
              backgroundColor: '#f8fafc', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              fontSize: '0.75rem',
              overflow: 'auto',
              maxHeight: '400px'
            }}>
              {email.rawHeaders}
            </pre>
          </details>
          
          {email.rawBody && (
            <details className="mt-4">
              <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '1rem' }}>
                View Email Body
              </summary>
              <div style={{ 
                backgroundColor: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                maxHeight: '300px',
                overflow: 'auto'
              }}>
                {email.rawBody}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailDetails;
