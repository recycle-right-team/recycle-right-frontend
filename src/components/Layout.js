import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Truck,
  Map,
  BarChart3,
  AlertCircle,
  Trophy,
  Settings,
  ChevronDown,
  RadioTower
} from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';
import './Layout.css';

function Layout({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [openSections, setOpenSections] = useState({
    operations: true,
    insights: true,
    system: true,
  });

  const titles = {
    '/': 'Dashboard',
    '/collectors': 'Collector Management',
    '/collector-vetting': 'Collector Vetting',
    '/reports': 'Complaints',
    '/leaderboard': 'Leaderboard',
    '/monitoring': 'Monitoring Map',
    '/analytics': 'Analytics',
    '/rewards': 'Rewards',
  };

  const pageTitle = titles[location.pathname] ?? 'Admin Portal';

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 🔥 Auto-open section based on route
  useEffect(() => {
    if (['/pickups', '/collectors', '/heatmap'].includes(location.pathname)) {
      setOpenSections(prev => ({ ...prev, operations: true }));
    }
    if (['/analytics', '/reports'].includes(location.pathname)) {
      setOpenSections(prev => ({ ...prev, insights: true }));
    }
    if (['/rewards', '/leaderboard'].includes(location.pathname)) {
      setOpenSections(prev => ({ ...prev, system: true }));
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">R</div>
          <div className="logo-text">
            <div className="logo-name">RecycleRight</div>
            <div className="logo-sub">Admin Portal</div>
          </div>
        </div>

        <nav className="nav-menu">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>

          {/* OPERATIONS */}
          <div className="nav-category-header" onClick={() => toggleSection('operations')}>
            <span>Operations</span>
            <ChevronDown className={openSections.operations ? 'rotate' : ''} size={14} />
          </div>

          <div className={`nav-section ${openSections.operations ? 'open' : ''}`}>
            <NavLink to="/collectors" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Users size={16} />
              Collectors
            </NavLink>

            <NavLink to="/collector-vetting" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Truck size={16} />
              Collector Vetting
            </NavLink>

            <NavLink to="/pickup-map" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Map size={16} />
              Pickup Monitoring
            </NavLink>

            <NavLink to="/broadcast" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <RadioTower size={16} />
              Broadcast
            </NavLink>
          </div>

          {/* INSIGHTS */}
          <div className="nav-category-header" onClick={() => toggleSection('insights')}>
            <span>Insights</span>
            <ChevronDown className={openSections.insights ? 'rotate' : ''} size={14} />
          </div>

          <div className={`nav-section ${openSections.insights ? 'open' : ''}`}>
            <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <BarChart3 size={16} />
              Analytics
            </NavLink>

            <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <AlertCircle size={16} />
              Complaints
            </NavLink>
          </div>

          {/* SYSTEM */}
          <div className="nav-category-header" onClick={() => toggleSection('system')}>
            <span>System</span>
            <ChevronDown className={openSections.system ? 'rotate' : ''} size={14} />
          </div>

          <div className={`nav-section ${openSections.system ? 'open' : ''}`}>
            <NavLink to="/rewards" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Settings size={16} />
              Rewards
            </NavLink>

            <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Trophy size={16} />
              Leaderboard
            </NavLink>
          </div>
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