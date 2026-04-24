import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const USE_MOCK = true;

const mockArea = [
  { name: 'DHA Phase 6', totalWeight: 1200 },
  { name: 'Gulshan Block 5', totalWeight: 980 },
  { name: 'Clifton', totalWeight: 870 }
];

const mockCollectors = [
  { name: 'Ali Khan', totalWeight: 500 },
  { name: 'Ahmed Raza', totalWeight: 430 },
  { name: 'Usman Tariq', totalWeight: 390 }
];

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [period, setPeriod] = useState('month');
  const [type, setType] = useState('area'); // 🔥 NEW
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      if (USE_MOCK) {
        setTimeout(() => {
          setLeaderboard(type === 'area' ? mockArea : mockCollectors);
          setLoading(false);
        }, 400);
        return;
      }

      const token = localStorage.getItem('token');

      const response = await axios.get(
        `/api/leaderboard?type=${type}&period=${period}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLeaderboard(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);

      // fallback
      setLeaderboard(type === 'area' ? mockArea : mockCollectors);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [period, type]);

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
          <h1 className="ui-pageTitle">Leaderboard</h1>
          <p className="ui-pageSubtitle">
            {type === 'area'
              ? 'Top performing neighbourhoods'
              : 'Top performing collectors'}
          </p>
        </div>
      </div>

      {/* 🔥 TYPE TOGGLE */}
      <div className="type-toggle">
        <button
          className={type === 'area' ? 'toggle-btn active' : 'toggle-btn'}
          onClick={() => setType('area')}
        >
          Area
        </button>
        <button
          className={type === 'collector' ? 'toggle-btn active' : 'toggle-btn'}
          onClick={() => setType('collector')}
        >
          Collector
        </button>
      </div>

      {/* PERIOD FILTER */}
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
            <div key={index} className={`leaderboard-item rank-${index + 1}`}>
              <div className="rank-badge">{getMedalEmoji(index)}</div>

              <div className="neighbourhood-info">
                <h3>{entry.name}</h3>
                <p>{entry.totalWeight} kg collected</p>
              </div>

              <div className="weight-display">
                <span className="weight-value">{entry.totalWeight}</span>
                <span className="weight-unit">kg</span>
              </div>
            </div>
          ))}

          {leaderboard.length === 0 && (
            <div className="no-data">
              <p>No data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;