import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RewardsConfig.css';

function RewardsConfig() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfigs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/rewards', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfigs(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching configs:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const updateConfig = async (id, pointsPerKg) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/rewards/${id}`, { pointsPerKg }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchConfigs();
    } catch (err) {
      console.error('Error updating config:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (id, value) => {
    setConfigs(configs.map(config => 
      config._id === id ? { ...config, pointsPerKg: parseFloat(value) || 0 } : config
    ));
  };

  const getWasteIcon = (type) => {
    const icons = {
      Plastic: '🥤',
      Paper: '📄',
      Metal: '🔩',
      Glass: '🍾'
    };
    return icons[type] || '♻️';
  };

  if (loading) {
    return <div className="page-loading">Loading configuration...</div>;
  }

  return (
    <div className="ui-page rewards-config-page">
      <div className="ui-pageHeader">
        <div>
          <h1 className="ui-pageTitle">Rewards Configuration</h1>
          <p className="ui-pageSubtitle">Set Green Points value per kg for each waste type</p>
        </div>
      </div>

      <div className="config-container">
        {configs.map(config => (
          <div key={config._id} className="config-card">
            <div className="config-header">
              <span className="waste-icon">{getWasteIcon(config.wasteType)}</span>
              <h3>{config.wasteType}</h3>
            </div>
            <div className="config-body">
              <div className="input-group">
                <label>Points per kg</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={config.pointsPerKg}
                  onChange={(e) => handleChange(config._id, e.target.value)}
                />
              </div>
              <button 
                className="save-btn"
                onClick={() => updateConfig(config._id, config.pointsPerKg)}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            <div className="config-footer">
              <p>Last updated: {new Date(config.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="info-notice">
        <p>💡 Changes apply immediately to all future pickups</p>
      </div>
    </div>
  );
}

export default RewardsConfig;
