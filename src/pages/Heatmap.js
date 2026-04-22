import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, HeatmapLayer } from '@react-google-maps/api';
import axios from 'axios';
import './Heatmap.css';

const mapContainerStyle = {
  width: '100%',
  height: '700px'
};

const center = {
  lat: 31.5204,
  lng: 74.3587 // Lahore, Pakistan
};

const libraries = ['visualization'];

function Heatmap() {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHeatmapData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/pickups/heatmap', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data.map(item => ({
        location: new window.google.maps.LatLng(item.location.lat, item.location.lng),
        weight: item.weight
      }));
      
      setHeatmapData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching heatmap data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchHeatmapData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

  return (
    <div className="ui-page heatmap-page">
      <div className="ui-pageHeader">
        <div>
          <h1 className="ui-pageTitle">Waste Collection Heatmap</h1>
          <p className="ui-pageSubtitle">Visualize collection density across the city</p>
        </div>
      </div>

      <div className="heatmap-legend">
        <div className="legend-item">
          <span className="legend-color high"></span>
          <span>High Activity</span>
        </div>
        <div className="legend-item">
          <span className="legend-color medium"></span>
          <span>Medium Activity</span>
        </div>
        <div className="legend-item">
          <span className="legend-color low"></span>
          <span>Low Activity / Underserved</span>
        </div>
      </div>

      <div className="map-container ui-card">
        <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
          >
            {heatmapData.length > 0 && (
              <HeatmapLayer
                data={heatmapData}
                options={{
                  radius: 30,
                  opacity: 0.6,
                  gradient: [
                    'rgba(0, 255, 255, 0)',
                    'rgba(0, 255, 255, 1)',
                    'rgba(0, 191, 255, 1)',
                    'rgba(0, 127, 255, 1)',
                    'rgba(0, 63, 255, 1)',
                    'rgba(0, 0, 255, 1)',
                    'rgba(0, 0, 223, 1)',
                    'rgba(0, 0, 191, 1)',
                    'rgba(0, 0, 159, 1)',
                    'rgba(0, 0, 127, 1)',
                    'rgba(63, 0, 91, 1)',
                    'rgba(127, 0, 63, 1)',
                    'rgba(191, 0, 31, 1)',
                    'rgba(255, 0, 0, 1)'
                  ]
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      <div className="refresh-notice">
        <span>🔄 Data refreshes every 5 minutes</span>
      </div>
    </div>
  );
}

export default Heatmap;
