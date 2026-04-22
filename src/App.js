import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Collectors from './pages/Collectors';
import PickupMonitoring from './pages/PickupMonitoring';
import Reports from './pages/Reports';
import Leaderboard from './pages/Leaderboard';
import Heatmap from './pages/Heatmap';
import Analytics from './pages/Analytics';
import RewardsConfig from './pages/RewardsConfig';
import Layout from './components/Layout';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />
        } />
        
        <Route path="/" element={
          isAuthenticated ? <Layout setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />
        }>
          <Route index element={<Dashboard />} />
          <Route path="collectors" element={<Collectors />} />
          <Route path="pickups" element={<PickupMonitoring />} />
          <Route path="reports" element={<Reports />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="heatmap" element={<Heatmap />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="rewards" element={<RewardsConfig />} />
        </Route>
        
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
