import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Collectors.css';

function Collectors() {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCollectors = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Redirect to login if no token
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get('/api/collectors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollectors(response.data);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching collectors:', err);
      
      // Handle 401 errors
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        setError(err.message || 'Failed to load collectors');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/collectors/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCollectors();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'status-badge pending',
      Verified: 'status-badge verified',
      Suspended: 'status-badge suspended'
    };
    return badges[status] || 'status-badge';
  };

  if (loading) {
    return <div className="page-loading">Loading collectors...</div>;
  }

  if (error) {
    return (
      <div className="ui-page collectors-page">
        <div className="ui-pageHeader">
          <h1 className="ui-pageTitle">Collector Management</h1>
        </div>
        <div className="error-message" style={{ padding: '20px', color: '#d32f2f' }}>
          Error loading collectors: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="ui-page collectors-page">
      <div className="ui-pageHeader">
        <div>
          <h1 className="ui-pageTitle">Collector Management</h1>
          <p className="ui-pageSubtitle">Manage and monitor all registered collectors</p>
        </div>
      </div>

      <div className="table-container">
        <table className="collectors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Status</th>
              <th>Total Pickups</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {collectors.map(collector => (
              <tr key={collector._id}>
                <td>{collector.name}</td>
                <td>{collector.email}</td>
                <td>{collector.phone}</td>
                <td>{collector.city}</td>
                <td>
                  <span className={getStatusBadge(collector.status)}>
                    {collector.status}
                  </span>
                </td>
                <td>{collector.totalPickups}</td>
                <td>
                  <div className="action-buttons">
                    {collector.status === 'Pending' && (
                      <>
                        <button 
                          className="btn-approve"
                          onClick={() => updateStatus(collector._id, 'Verified')}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn-reject"
                          onClick={() => updateStatus(collector._id, 'Suspended')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {collector.status === 'Verified' && (
                      <button 
                        className="btn-suspend"
                        onClick={() => updateStatus(collector._id, 'Suspended')}
                      >
                        Suspend
                      </button>
                    )}
                    {collector.status === 'Suspended' && (
                      <button 
                        className="btn-approve"
                        onClick={() => updateStatus(collector._id, 'Verified')}
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Collectors;
