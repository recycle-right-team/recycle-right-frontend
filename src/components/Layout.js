import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import ConnectionStatus from './ConnectionStatus';
import './Layout.css';

function Layout({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  const titles = {
    '/': 'Dashboard',
    '/collectors': 'Collectors',
    '/pickups': 'Pickup Monitoring',
    '/reports': 'Reports & Complaints',
    '/leaderboard': 'Leaderboard',
    '/heatmap': 'Heatmap',
    '/analytics': 'Analytics',
    '/rewards': 'Rewards Config',
  };

  const pageTitle = titles[location.pathname] ?? 'Admin Portal';

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark" aria-hidden="true">R</div>
          <div className="logo-text">
            <div className="logo-name">RecycleRight</div>
            <div className="logo-sub">Admin Portal</div>
          </div>
        </div>
        <nav className="nav-menu">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-dot" />
            Dashboard
          </NavLink>
          <NavLink to="/collectors" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-dot" />
            Collectors
          </NavLink>
          <NavLink to="/pickups" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-dot" />
            Pickup Monitoring
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-dot" />
            Reports & Complaints
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-dot" />
            Leaderboard
          </NavLink>
          <NavLink to="/heatmap" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-dot" />
            Heatmap
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-dot" />
            Analytics
          </NavLink>
          <NavLink to="/rewards" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-dot" />
            Rewards Config
          </NavLink>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">{pageTitle}</div>
        </header>
        <Outlet />
        <ConnectionStatus />
      </main>
    </div>
  );
}

export default Layout;
