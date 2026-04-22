import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConnectionStatus.css';

function ConnectionStatus() {
  const [status, setStatus] = useState({ database: 'checking', lastCheck: null });
  const [visible, setVisible] = useState(true);

  const checkConnection = async () => {
    try {
      const response = await axios.get('/api/health');
      setStatus({
        database: response.data.database,
        lastCheck: new Date().toLocaleTimeString()
      });
    } catch (err) {
      setStatus({
        database: 'error',
        lastCheck: new Date().toLocaleTimeString()
      });
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const getStatusColor = () => {
    if (status.database === 'connected') return 'green';
    if (status.database === 'checking') return 'yellow';
    return 'red';
  };

  const getStatusText = () => {
    if (status.database === 'connected') return '✓ Database Connected';
    if (status.database === 'checking') return '⟳ Checking...';
    return '✗ Database Disconnected';
  };

  return (
    <div className={`connection-status ${getStatusColor()}`}>
      <span className="status-text">{getStatusText()}</span>
      {status.lastCheck && (
        <span className="last-check">Last check: {status.lastCheck}</span>
      )}
      <button className="close-btn" onClick={() => setVisible(false)}>×</button>
    </div>
  );
}

export default ConnectionStatus;
