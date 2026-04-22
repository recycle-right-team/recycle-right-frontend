import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/leaderboard?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaderboard(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  return (
    <div className="ui-page leaderboard-page">
      <div className="ui-pageHeader">
        <div>
          <h1 className="ui-pageTitle">Neighbourhood Leaderboard</h1>
          <p className="ui-pageSubtitle">Top performing neighbourhoods by waste diverted</p>
        </div>
      </div>

      <div className="filter-buttons">
        <button 
          className={period === 'week' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setPeriod('week')}
        >
          This Week
        </button>
        <button 
          className={period === 'month' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setPeriod('month')}
        >
          This Month
        </button>
        <button 
          className={period === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setPeriod('all')}
        >
          All Time
        </button>
      </div>

      {loading ? (
        <div className="page-loading">Loading leaderboard...</div>
      ) : (
        <div className="leaderboard-container">
          {leaderboard.map((entry, index) => (
            <div key={entry.neighbourhood} className={`leaderboard-item rank-${index + 1}`}>
              <div className="rank-badge">
                {getMedalEmoji(index)}
              </div>
              <div className="neighbourhood-info">
                <h3>{entry.neighbourhood}</h3>
                <p>{entry.totalWeight} kg diverted</p>
              </div>
              <div className="weight-display">
                <span className="weight-value">{entry.totalWeight}</span>
                <span className="weight-unit">kg</span>
              </div>
            </div>
          ))}

          {leaderboard.length === 0 && (
            <div className="no-data">
              <p>No data available for this period</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
