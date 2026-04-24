import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import jsPDF from 'jspdf';
import './Analytics.css';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

/* =========================
   KPI MOCKS
========================= */
const mockKPIs = {
  totalWaste: 12500,
  participationRate: 68,
  avgCollectionTime: 14,
  totalPayout: 320000
};

/* =========================
   WASTE BREAKDOWN
========================= */
const mockWaste = {
  Plastic: 4200,
  Paper: 3000,
  Metal: 2200,
  Glass: 3100
};

/* =========================
   SUPPLY vs DEMAND MODEL
========================= */
const mockSupplyDemand = [
  { collectors: 5,  demand: 120, revenuePerCollector: 240 },
  { collectors: 10, demand: 260, revenuePerCollector: 220 },
  { collectors: 15, demand: 420, revenuePerCollector: 200 },
  { collectors: 20, demand: 600, revenuePerCollector: 180 },
  { collectors: 25, demand: 750, revenuePerCollector: 160 }
];

function Analytics() {
  const [kpis, setKpis] = useState(mockKPIs);
  const [wasteByType, setWasteByType] = useState(mockWaste);
  const [supplyDemand, setSupplyDemand] = useState(mockSupplyDemand);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setKpis(mockKPIs);
    setWasteByType(mockWaste);
    setSupplyDemand(mockSupplyDemand);
    setLoading(false);
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('RecycleRight Analytics Report', 14, 20);

    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.text(`Total Waste: ${kpis.totalWaste} kg`, 14, 45);
    doc.text(`Participation: ${kpis.participationRate}%`, 14, 52);
    doc.text(`Avg Collection Time: ${kpis.avgCollectionTime} min`, 14, 59);
    doc.text(`Total Payout: PKR ${kpis.totalPayout}`, 14, 66);

    doc.save('analytics.pdf');
  };

  const wasteChartData = Object.entries(wasteByType).map(([name, value]) => ({
    name,
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
          <p className="ui-pageSubtitle">
            Operational insights & demand–supply balance
          </p>
        </div>

        <button className="export-btn" onClick={exportToPDF}>
          📄 Export PDF
        </button>
      </div>

      {/* =========================
          KPI BAR
      ========================= */}
      <div className="kpi-bar">

        <div className="kpi-card">
          <p>Total Waste</p>
          <h2>{kpis.totalWaste} kg</h2>
        </div>

        <div className="kpi-card">
          <p>Participation Rate</p>
          <h2>{kpis.participationRate}%</h2>
        </div>

        <div className="kpi-card">
          <p>Avg Collection Time</p>
          <h2>{kpis.avgCollectionTime} min</h2>
        </div>

        <div className="kpi-card">
          <p>Total Payout</p>
          <h2>PKR {kpis.totalPayout}</h2>
        </div>

      </div>

      {/* =========================
          CHARTS GRID
      ========================= */}
      <div className="charts-grid">

        {/* 🍃 WASTE PIE CHART */}
        <div className="chart-card">
          <h3>Waste Diversion by Type</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={wasteChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {wasteChartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🚨 SUPPLY vs DEMAND (FIXED LOGIC) */}
        <div className="chart-card">
          <h3>Demand vs Collector Supply Pressure</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplyDemand}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="collectors"
                label={{
                  value: 'Collectors Available',
                  position: 'insideBottom',
                  offset: -5
                }}
              />

              {/* LEFT = DEMAND */}
              <YAxis
                yAxisId="left"
                label={{
                  value: 'Household Demand',
                  angle: -90,
                  position: 'insideLeft'
                }}
              />

              {/* RIGHT = REVENUE EFFICIENCY */}
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: 'Revenue per Collector',
                  angle: 90,
                  position: 'insideRight'
                }}
              />

              <Tooltip />
              <Legend />

              {/* DEMAND */}
              <Bar
                yAxisId="left"
                dataKey="demand"
                fill="#3b82f6"
                name="Household Demand"
              />

              {/* REVENUE PER COLLECTOR */}
              <Bar
                yAxisId="right"
                dataKey="revenuePerCollector"
                fill="#10b981"
                name="Revenue per Collector"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Analytics;