import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reports.css';

const USE_MOCK = true;

const mockReports = [
  {
    _id: '1',
    type: 'Missed Pickup',
    status: 'Open',
    description: 'Collector did not show up for pickup.',
    createdAt: new Date(),
    householdId: {
      name: 'Ali Household',
      address: 'DHA Phase 6, Karachi'
    },
    photo: null
  },
  {
    _id: '2',
    type: 'Improper Sorting',
    status: 'Resolved',
    description: 'Waste was not properly sorted.',
    createdAt: new Date(),
    householdId: {
      name: 'Ahmed Household',
      address: 'Gulshan-e-Iqbal, Karachi'
    },
    photo: null
  }
];

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchReports = async () => {
    try {
      if (USE_MOCK) {
        setTimeout(() => {
          setReports(mockReports);
          setLoading(false);
        }, 400);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.get('/api/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReports(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setReports(mockReports);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const markAsResolved = async (id) => {
    if (USE_MOCK) {
      setReports(prev =>
        prev.map(r =>
          r._id === id ? { ...r, status: 'Resolved' } : r
        )
      );
      return;
    }

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

  // 🔍 FILTERING LOGIC
  const filteredReports = reports
    .filter(r => {
      if (filter === 'all') return true;
      return r.status.toLowerCase() === filter;
    })
    .filter(r =>
      Object.values(r)
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  // 📊 STATS
  const openCount = reports.filter(r => r.status === 'Open').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  if (loading) {
    return <div className="page-loading">Loading reports...</div>;
  }

  return (
    <div className="ui-page reports-page">

      {/* HEADER */}
      <div className="ui-pageHeader">
        <div>
          <h1 className="ui-pageTitle">Reports & Complaints</h1>
          <p className="ui-pageSubtitle">
            Manage household complaints and service issues
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="report-stats">
        <div className="stat-card open">
          <h3>{openCount}</h3>
          <p>Open</p>
        </div>
        <div className="stat-card resolved">
          <h3>{resolvedCount}</h3>
          <p>Resolved</p>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="report-controls">
        <input
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>

          <button
            className={filter === 'open' ? 'active' : ''}
            onClick={() => setFilter('open')}
          >
            Open
          </button>

          <button
            className={filter === 'resolved' ? 'active' : ''}
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* REPORTS */}
      <div className="reports-container">
        {filteredReports.map(report => (
          <div key={report._id} className={`report-card ${report.status.toLowerCase()}`}>

            <div className="report-header">
              <div>
                <h3>{report.householdId?.name}</h3>
                <p className="report-type">{report.type}</p>
              </div>

              <span className={`status-badge ${report.status.toLowerCase()}`}>
                {report.status}
              </span>
            </div>

            <div className="report-body">
              <p>📍 {report.householdId?.address}</p>
              <p>{report.description}</p>
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

        {filteredReports.length === 0 && (
          <div className="no-reports">
            <p>No reports found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;