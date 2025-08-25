import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaEnvelope,
  FaServer,
  FaEye,
  FaSync,
  FaExclamationTriangle
} from 'react-icons/fa';
import { emailAPI } from '../services/api';

const Dashboard = () => {
  const [config, setConfig] = useState(null);
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [configData, emailsData, statsData] = await Promise.all([
        emailAPI.getConfig(),
        emailAPI.getEmails({ testOnly: 'true', limit: 10 }),
        emailAPI.getStats()
      ]);

      setConfig(configData.data);
      setEmails(emailsData.data.emails);
      setStats(statsData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleProcessEmails = async () => {
    try {
      setRefreshing(true);
      await emailAPI.processEmails();
      await loadDashboardData();
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
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

  const getESPBadge = (espInfo) => {
    if (!espInfo) return <span className="badge badge-secondary">Unknown</span>;
    
    const confidenceColor = espInfo.confidence >= 80 ? 'success' : 
                           espInfo.confidence >= 50 ? 'warning' : 'danger';
    
    return (
      <span className={`badge badge-${confidenceColor}`}>
        {espInfo.provider} ({espInfo.confidence}%)
      </span>
    );
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Email Analysis Dashboard</h1>
        <p className="dashboard-subtitle">
          Automatically analyze email receiving chains and detect ESP providers
        </p>
      </div>

      {error && (
        <div className="card mb-6" style={{ borderLeft: '4px solid #ef4444' }}>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaExclamationTriangle style={{ color: '#ef4444' }} />
              <strong>Error:</strong> {error}
            </div>
          </div>
        </div>
      )}

      {/* Email Configuration */}
      {config && (
        <div className="email-config mb-6">
          <h3>
            <FaEnvelope /> Test Email Configuration
          </h3>
          <p>Send test emails to the address below with the specified subject line:</p>
          
          <div className="email-address">
            {config.testEmailAddress}
          </div>
          
          <div className="subject-line">
            Subject must contain: <strong>{config.testSubjectPrefix}</strong>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <div className={config.isConnected ? 'status-indicator status-online' : 'status-indicator status-offline'}>
              <div className="status-dot"></div>
              {config.isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className={config.isMonitoring ? 'status-indicator status-online' : 'status-indicator status-offline'}>
              <div className="status-dot"></div>
              {config.isMonitoring ? 'Monitoring' : 'Not Monitoring'}
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="dashboard-grid mb-6">
          <div className="card">
            <div className="card-body text-center">
              <h3 style={{ fontSize: '2rem', margin: '0', color: '#3b82f6' }}>
                {stats.stats.total}
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Total Emails</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <h3 style={{ fontSize: '2rem', margin: '0', color: '#10b981' }}>
                {stats.stats.completed}
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Processed</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <h3 style={{ fontSize: '2rem', margin: '0', color: '#f59e0b' }}>
                {stats.stats.pending}
              </h3>
              <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Pending</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="card mb-6">
        <div className="card-body">
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FaSync className={refreshing ? 'spinner' : ''} />
              Refresh Data
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleProcessEmails}
              disabled={refreshing}
            >
              <FaServer />
              Process Emails
            </button>
          </div>
        </div>
      </div>

      {/* Recent Emails */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: '0' }}>Recent Test Emails</h3>
        </div>
        <div className="card-body">
          {emails.length === 0 ? (
            <div className="text-center p-6">
              <FaEnvelope size={48} style={{ color: '#d1d5db', marginBottom: '1rem' }} />
              <p style={{ color: '#6b7280' }}>No test emails found. Send an email to get started!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Subject</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>From</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>ESP</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Received</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email) => (
                    <tr key={email._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {email.subject}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {email.from}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {getESPBadge(email.espInfo)}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={getStatusBadge(email.processingStatus)}>
                          {email.processingStatus}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(email.receivedAt).toLocaleString()}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <Link 
                          to={`/email/${email._id}`} 
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          <FaEye />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
