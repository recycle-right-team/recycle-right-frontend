import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
import './PickupMonitoring.css';

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 31.5204,
  lng: 74.3587 // Lahore, Pakistan
};

function PickupMonitoring() {
  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchActiveCollectors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/collectors/active', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollectors(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching collectors:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveCollectors();
    const interval = setInterval(fetchActiveCollectors, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

  return (
    <div className="ui-page pickup-monitoring-page">
      <div className="ui-pageHeader">
        <div>
          <h1 className="ui-pageTitle">Pickup Monitoring</h1>
          <p className="ui-pageSubtitle">Live tracking of active collectors</p>
        </div>
      </div>

      <div className="map-container ui-card">
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
          >
            {collectors.map(collector => (
              collector.currentLocation && (
                <Marker
                  key={collector._id}
                  position={{
                    lat: collector.currentLocation.lat,
                    lng: collector.currentLocation.lng
                  }}
                  onClick={() => setSelectedCollector(collector)}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#10b981" stroke="white" stroke-width="3"/><text x="20" y="27" font-size="20" text-anchor="middle" fill="white">🚛</text></svg>'
                    ),
                    scaledSize: new window.google.maps.Size(40, 40)
                  }}
                />
              )
            ))}

            {selectedCollector && (
              <InfoWindow
                position={{
                  lat: selectedCollector.currentLocation.lat,
                  lng: selectedCollector.currentLocation.lng
                }}
                onCloseClick={() => setSelectedCollector(null)}
              >
                <div className="info-window">
                  <h3>{selectedCollector.name}</h3>
                  <p><strong>Status:</strong> Active</p>
                  <p><strong>Pickups Today:</strong> {selectedCollector.totalPickups}</p>
                  <p><strong>City:</strong> {selectedCollector.city}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      <div className="collectors-list">
        <h2>Active Collectors ({collectors.length})</h2>
        <div className="collectors-grid">
          {collectors.map(collector => (
            <div key={collector._id} className="collector-card">
              <div className="collector-info">
                <h3>{collector.name}</h3>
                <p>{collector.city}</p>
              </div>
              <div className="collector-stats">
                <span className="stat-badge">{collector.totalPickups} pickups</span>
                <span className="status-active">● Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PickupMonitoring;
