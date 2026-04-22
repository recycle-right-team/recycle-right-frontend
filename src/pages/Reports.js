import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reports.css';

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const markAsResolved = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/reports/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReports();
    } catch (err) {
      console.error('Error resolving report:', err);
    }
  };

  if (loading) {
    return <div className="page-loading">Loading reports...</div>;
  }

  return (
    <div className="ui-page reports-page">
      <div className="ui-pageHeader">
        <div>
          <h1 className="ui-pageTitle">Reports & Complaints</h1>
          <p className="ui-pageSubtitle">Manage household reports and complaints</p>
        </div>
      </div>

      <div className="reports-container">
        {reports.map(report => (
          <div key={report._id} className={`report-card ${report.status.toLowerCase()}`}>
            <div className="report-header">
              <div>
                <h3>{report.householdId?.name || 'Unknown Household'}</h3>
                <p className="report-type">{report.type}</p>
              </div>
              <span className={`status-badge ${report.status.toLowerCase()}`}>
                {report.status}
              </span>
            </div>
            
            <div className="report-body">
              <p className="report-address">📍 {report.householdId?.address || 'No address'}</p>
              <p className="report-description">{report.description}</p>
              <p className="report-date">
                📅 {new Date(report.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {report.photo && (
                <div className="report-photo">
                  <img src={`/${report.photo}`} alt="Report" />
                </div>
              )}
            </div>

            {report.status === 'Open' && (
              <div className="report-actions">
                <button 
                  className="btn-resolve"
                  onClick={() => markAsResolved(report._id)}
                >
                  Mark as Resolved
                </button>
              </div>
            )}
          </div>
        ))}

        {reports.length === 0 && (
          <div className="no-reports">
            <p>No reports or complaints found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
