import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const STATS = [
  { label: 'Waste Diverted Today', value: '0.00', unit: 'kg', accent: 'accent-green', change: '— no pickups yet' },
  { label: 'Completed Pickups',    value: '0',    unit: '',   accent: 'accent-blue',  change: '— no pickups yet' },
  { label: 'Active Collectors',    value: '0',    unit: '',   accent: 'accent-amber', change: '— none assigned' },
  { label: 'Registered Households',value: '0',    unit: '',   accent: 'accent-purple',change: '— none onboarded' },
];

const RECENT_PICKUPS = [
  { name: 'Household #412', meta: 'Sector 4 · 08:30 AM', amount: '3.2 kg', status: 'completed' },
  { name: 'Household #309', meta: 'Sector 2 · 09:15 AM', amount: '1.8 kg', status: 'pending' },
  { name: 'Household #517', meta: 'Sector 7 · 10:00 AM', amount: '—',      status: 'missed' },
];

const TOP_COLLECTORS = [
  { name: 'Ahmad Bilal',   zone: 'Sector 4', pickups: 42, kg: '128.4' },
  { name: 'Sara Noor',     zone: 'Sector 2', pickups: 38, kg: '110.2' },
  { name: 'Usman Khalid',  zone: 'Sector 7', pickups: 35, kg: '98.7'  },
  { name: 'Fatima Iqbal',  zone: 'Sector 1', pickups: 31, kg: '87.3'  },
];

const WEEK_BARS = [
  { day: 'Mon', pct: 60 },
  { day: 'Tue', pct: 80 },
  { day: 'Wed', pct: 45 },
  { day: 'Thu', pct: 90 },
  { day: 'Fri', pct: 70 },
  { day: 'Sat', pct: 30 },
  { day: 'Sun', pct: 20 },
];

function StatCard({ stat }) {
  return (
    <div className={`stat-card ${stat.accent}`}>
      <span className="stat-label">{stat.label}</span>
      <div className="stat-value">
        {stat.value}
        {stat.unit && <span className="stat-unit"> {stat.unit}</span>}
      </div>
      <span className={`stat-change neutral`}>{stat.change}</span>
    </div>
  );
}

function RecentPickups() {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Recent pickups</span>
        <button className="panel-action">View all</button>
      </div>
      <div className="activity-list">
        {RECENT_PICKUPS.map((row, i) => (
          <div className="activity-row" key={i}>
            <div className="activity-info">
              <span className="activity-name">{row.name}</span>
              <span className="activity-meta">{row.meta}</span>
            </div>
            <div className="activity-right">
              <span className="activity-amount">{row.amount}</span>
              <span className={`status-pill ${row.status}`}>{row.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyActivity() {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title">Weekly waste (kg)</span>
        <button className="panel-action">This week</button>
      </div>
      <div className="bar-chart">
        {WEEK_BARS.map(b => (
          <div className="bar-col" key={b.day}>
            <div className="bar-fill" style={{ height: `${b.pct}%` }} title={`${b.day}`} />
            <span className="bar-label">{b.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopCollectors() {
  return (
    <div className="panel panel-full">
      <div className="panel-header">
        <span className="panel-title">Top collectors</span>
        <button className="panel-action">View all</button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Zone</th>
            <th>Pickups</th>
            <th>Total (kg)</th>
          </tr>
        </thead>
        <tbody>
          {TOP_COLLECTORS.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td className="muted">{c.zone}</td>
              <td className="mono">{c.pickups}</td>
              <td className="mono">{c.kg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dashboard() {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setLastRefresh(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="ui-page dashboard-page">
      <div className="ui-pageHeader">
        <div>
          <h1 className="ui-pageTitle">Dashboard</h1>
          <p className="ui-pageSubtitle">Real-time overview of RecycleRight operations</p>
        </div>
        <div className="dashboard-refresh">
          <span className="refresh-dot" />
          Auto-refresh · last {timeStr}
        </div>
      </div>

      <div className="stat-grid">
        {STATS.map((s, i) => <StatCard stat={s} key={i} />)}
      </div>

      <div className="panel-grid">
        <RecentPickups />
        <WeeklyActivity />
        <TopCollectors />
      </div>
    </div>
  );
}

export default Dashboard;