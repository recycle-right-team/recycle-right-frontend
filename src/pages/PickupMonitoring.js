import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader
} from '@react-google-maps/api';
import axios from 'axios';
import './PickupMonitoring.css';

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 31.5204,
  lng: 74.3587
};

// 🧪 MOCK DAILY STATS
const mockStats = {
  activeRequests: 48,
  collectorsOnline: 15,
  inProgress: 18,
  avgResponseTime: 12
};

// 🧪 MOCK MISSED PICKUPS
const mockMissedPickups = [
  {
    id: 1,
    lat: 31.520,
    lng: 74.360,
    household: 'Household #102',
    reason: 'Collector unavailable'
  },
  {
    id: 2,
    lat: 31.515,
    lng: 74.345,
    household: 'Household #215',
    reason: 'No response'
  }
];

function PickupMonitoring() {
  const [collectors, setCollectors] = useState([]);
  const [missedPickups, setMissedPickups] = useState([]);

  const [selectedCollector, setSelectedCollector] = useState(null);
  const [selectedMissed, setSelectedMissed] = useState(null);

  const [stats] = useState(mockStats);
  const [loading, setLoading] = useState(true);

  // ✅ SAFE MODERN GOOGLE MAPS LOADER
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'
  });

  // ---------------- FETCH COLLECTORS ----------------
  const fetchCollectors = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get('/api/collectors/active', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCollectors(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // ---------------- FETCH MISSED ----------------
  const fetchMissed = async () => {
    setMissedPickups(mockMissedPickups);
  };

  useEffect(() => {
    fetchCollectors();
    fetchMissed();

    const interval = setInterval(() => {
      fetchCollectors();
      fetchMissed();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!isLoaded) {
    return <div className="page-loading">Loading map...</div>;
  }

  return (
    <div className="ui-page pickup-monitoring-page">

      {/* HEADER */}
      <div className="ui-pageHeader">
        <div>
          <h1 className="ui-pageTitle">Pickup Monitoring</h1>
          <p className="ui-pageSubtitle">Daily live operations overview</p>
        </div>
      </div>

      {/* 📊 STATS BAR */}
      <div className="stats-bar">

        <div className="stat-card">
          <p>Active Requests</p>
          <h2>{stats.activeRequests}</h2>
        </div>

        <div className="stat-card">
          <p>Collectors Online</p>
          <h2>{stats.collectorsOnline}</h2>
        </div>

        <div className="stat-card">
          <p>In Progress</p>
          <h2>{stats.inProgress}</h2>
        </div>

        <div className="stat-card">
          <p>Avg Response</p>
          <h2>{stats.avgResponseTime} min</h2>
        </div>

      </div>

      {/* 🗺 MAP */}
      <div className="map-container ui-card">

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
        >

          {/* 🚛 COLLECTORS */}
          {collectors.map(c => (
            c.currentLocation && (
              <Marker
                key={c._id}
                position={{
                  lat: c.currentLocation.lat,
                  lng: c.currentLocation.lng
                }}
                onClick={() => {
                  setSelectedCollector(c);
                  setSelectedMissed(null);
                }}
                icon={{
                  url:
                    'data:image/svg+xml;charset=UTF-8,' +
                    encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                        <circle cx="20" cy="20" r="18" fill="#10b981" stroke="white" stroke-width="3"/>
                        <text x="20" y="27" font-size="18" text-anchor="middle">🚛</text>
                      </svg>
                    `)
                }}
              />
            )
          ))}

          {/* ❌ MISSED PICKUPS */}
          {missedPickups.map(m => (
            <Marker
              key={m.id}
              position={{ lat: m.lat, lng: m.lng }}
              onClick={() => {
                setSelectedMissed(m);
                setSelectedCollector(null);
              }}
              icon={{
                url:
                  'data:image/svg+xml;charset=UTF-8,' +
                  encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
                      <circle cx="20" cy="20" r="18" fill="#ef4444" stroke="white" stroke-width="3"/>
                      <text x="20" y="27" font-size="18" text-anchor="middle">✖</text>
                    </svg>
                  `)
              }}
            />
          ))}

          {/* COLLECTOR INFO */}
          {selectedCollector && (
            <InfoWindow
              position={{
                lat: selectedCollector.currentLocation.lat,
                lng: selectedCollector.currentLocation.lng
              }}
              onCloseClick={() => setSelectedCollector(null)}
            >
              <div>
                <h3>{selectedCollector.name}</h3>
                <p>🚛 Active Collector</p>
                <p>{selectedCollector.city}</p>
              </div>
            </InfoWindow>
          )}

          {/* MISSED INFO */}
          {selectedMissed && (
            <InfoWindow
              position={{
                lat: selectedMissed.lat,
                lng: selectedMissed.lng
              }}
              onCloseClick={() => setSelectedMissed(null)}
            >
              <div className="info-window">

                <h3 style={{ color: '#ef4444' }}>Missed Pickup</h3>

                <p><strong>Household:</strong> {selectedMissed.household}</p>
                <p><strong>Reason:</strong> {selectedMissed.reason}</p>

                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>

                  <button
                    className="map-action-btn"
                    onClick={() => alert(`Message collector for pickup ${selectedMissed.id}`)}
                  >
                    💬 Message Collector
                  </button>

                  <button
                    className="map-action-btn secondary"
                    onClick={() => alert(`Message ${selectedMissed.household}`)}
                  >
                    🏠 Message Household
                  </button>

                </div>

              </div>
            </InfoWindow>
          )}

        </GoogleMap>
      </div>

      {/* LIST */}
      <div className="collectors-list">
        <h2>Active Collectors ({collectors.length})</h2>

        <div className="collectors-grid">
          {collectors.map(c => (
            <div key={c._id} className="collector-card">
              <h3>{c.name}</h3>
              <p>{c.city}</p>
              <span className="status-active">● Active</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default PickupMonitoring;