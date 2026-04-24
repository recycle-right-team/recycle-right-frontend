import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Analytics.css';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

// 🧪 MOCK DATA
const mockKPIs = {
  totalWaste: 12500,
  participationRate: 68,
  avgCollectionTime: 14,
  totalPayout: 320000
};

const mockWaste = {
  Plastic: 4200,
  Paper: 3000,
  Metal: 2200,
  Glass: 3100
};

const mockRevenue = [
  { collectors: 5, revenue: 1200 },
  { collectors: 10, revenue: 2000 },
  { collectors: 15, revenue: 2600 },
  { collectors: 20, revenue: 3100 },
  { collectors: 25, revenue: 3300 }
];

function Analytics() {
  const [kpis, setKpis] = useState(mockKPIs);
  const [wasteByType, setWasteByType] = useState(mockWaste);
  const [revenueData, setRevenueData] = useState(mockRevenue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // 🔌 Replace with real API later
      setKpis(mockKPIs);
      setWasteByType(mockWaste);
      setRevenueData(mockRevenue);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('RecycleRight Analytics Report', 14, 20);

    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.text(`Total Waste: ${kpis.totalWaste} kg`, 14, 45);
    doc.text(`Participation: ${kpis.participationRate}%`, 14, 52);
    doc.text(`Avg Time: ${kpis.avgCollectionTime} min`, 14, 59);
    doc.text(`Total Payout: PKR ${kpis.totalPayout}`, 14, 66);

    doc.save('analytics.pdf');
  };

  const wasteChartData = Object.entries(wasteByType).map(([type, value]) => ({
    name: type,
    value
  }));

  if (loading) {
    return <div className="page-loading">Loading analytics...</div>;
  }

  return (
    <div className="ui-page analytics-page">

      {/* HEADER */}
      <div className="ui-pageHeader">
        <div>
          <h1 className="ui-pageTitle">Analytics Dashboard</h1>
          <p className="ui-pageSubtitle">Operational insights & performance metrics</p>
        </div>

        <button className="export-btn" onClick={exportToPDF}>
          📄 Export PDF
        </button>
      </div>

      {/* 🔝 KPI BAR */}
      <div className="kpi-bar">

        <div className="kpi-card">
          <p>Total Waste</p>
          <h2>{kpis.totalWaste} kg</h2>
        </div>

        <div className="kpi-card">
          <p>Participation</p>
          <h2>{kpis.participationRate}%</h2>
        </div>

        <div className="kpi-card">
          <p>Avg Collection</p>
          <h2>{kpis.avgCollectionTime} min</h2>
        </div>

        <div className="kpi-card">
          <p>Total Payout</p>
          <h2>PKR {kpis.totalPayout}</h2>
        </div>

      </div>

      {/* 📊 CHARTS */}
      <div className="charts-grid">

        {/* PIE */}
        <div className="chart-card">
          <h3>Waste by Type</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={wasteChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {wasteChartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="chart-card">
          <h3>Revenue vs Collector Supply</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="collectors" label={{ value: 'Collectors', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Avg Revenue', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}

export default Analytics;