import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Analytics.css';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

function Analytics() {
  const [wasteByType, setWasteByType] = useState({});
  const [collectorGrowth, setCollectorGrowth] = useState([]);
  const [pickupTrends, setPickupTrends] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = dateRange.startDate && dateRange.endDate 
        ? `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        : '';

      const [wasteRes, growthRes, trendsRes] = await Promise.all([
        axios.get(`/api/analytics/waste-by-type${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/analytics/collector-growth', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/analytics/pickup-trends', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setWasteByType(wasteRes.data);
      setCollectorGrowth(growthRes.data);
      setPickupTrends(trendsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('RecycleRight Pakistan - Analytics Report', 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    
    if (dateRange.startDate && dateRange.endDate) {
      doc.text(`Period: ${dateRange.startDate} to ${dateRange.endDate}`, 14, 38);
    }

    // Waste by Type
    doc.setFontSize(16);
    doc.text('Waste Diverted by Type', 14, 50);
    
    const wasteData = Object.entries(wasteByType).map(([type, weight]) => [type, `${weight.toFixed(2)} kg`]);
    doc.autoTable({
      startY: 55,
      head: [['Waste Type', 'Weight']],
      body: wasteData
    });

    // Pickup Trends
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Recent Pickup Trends', 14, 20);
    
    const trendsData = pickupTrends.slice(-10).map(trend => [
      trend.date,
      trend.count.toString(),
      `${trend.weight} kg`
    ]);
    
    doc.autoTable({
      startY: 25,
      head: [['Date', 'Pickups', 'Weight']],
      body: trendsData
    });

    doc.save('recycleright-analytics.pdf');
  };

  const wasteChartData = Object.entries(wasteByType).map(([type, weight]) => ({
    name: type,
    value: parseFloat(weight.toFixed(2))
  }));

  if (loading) {
    return <div className="page-loading">Loading analytics...</div>;
  }

  return (
    <div className="ui-page analytics-page">
      <div className="ui-pageHeader">
        <div>
          <h1 className="ui-pageTitle">Analytics & Reports</h1>
          <p className="ui-pageSubtitle">Comprehensive insights into waste management operations</p>
        </div>
      </div>

      <div className="analytics-controls">
        <div className="date-range-picker">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            placeholder="Start Date"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            placeholder="End Date"
          />
        </div>
        <button className="export-btn" onClick={exportToPDF}>
          📄 Export PDF
        </button>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Waste Diverted by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={wasteChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value} kg`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {wasteChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Collector Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={collectorGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} name="Collectors" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-width">
          <h3>Pickup Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pickupTrends.slice(-30)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Pickups" />
              <Bar yAxisId="right" dataKey="weight" fill="#10b981" name="Weight (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
