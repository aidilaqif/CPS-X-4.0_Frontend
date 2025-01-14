import React, { useState, useEffect } from 'react';
import { Battery, Activity, Gauge, ChevronRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analysisService } from '../../services/analysis.service';
import '../../assets/styles/components/AIAnalysis.css';

const AIAnalysis = () => {
  const [batteryAnalysis, setBatteryAnalysis] = useState(null);
  const [movementAnalysis, setMovementAnalysis] = useState(null);
  const [performanceAnalysis, setPerformanceAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const [batteryData, movementData, performanceData] = await Promise.all([
        analysisService.getBatteryEfficiency(),
        analysisService.getMovementPatterns(),
        analysisService.getDronePerformance()
      ]);

      setBatteryAnalysis(batteryData);
      setMovementAnalysis(movementData);
      setPerformanceAnalysis(performanceData);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message);
    }
  };

  const BatteryEfficiencySection = ({ data }) => {
    if (!data) return null;

    const chartData = [
      { name: 'Consumption', value: parseFloat(data.metrics.avg_battery_consumption) },
      { name: 'Duration', value: parseFloat(data.metrics.avg_flight_duration) },
      { name: 'Efficiency', value: parseFloat(data.metrics.battery_per_minute) }
    ];

    const insights = data.analysis.split('\n').filter(Boolean);
    const groupedInsights = [];
    let currentGroup = [];

    insights.forEach((insight) => {
      if (insight.match(/^\d/)) {
      if (currentGroup.length) {
        groupedInsights.push(currentGroup);
        currentGroup = [];
      }
      }
      currentGroup.push(insight);
    });

    if (currentGroup.length) {
      groupedInsights.push(currentGroup);
    }

    return (
      <div className="analysis-section">
      <div className="section-header">
        <Battery className="section-icon-battery" />
        <h3>Battery Efficiency</h3>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#0aa691" />
        </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="metrics-container">
        <div className="metric-item">
        <span className="metric-label">Average Consumption:</span>
        <span className="metric-value">{data.metrics.avg_battery_consumption} units/flight</span>
        </div>
        <div className="metric-item">
        <span className="metric-label">Flight Duration:</span>
        <span className="metric-value">{data.metrics.avg_flight_duration} hours</span>
        </div>
        <div className="metric-item">
        <span className="metric-label">Battery per Minute:</span>
        <span className="metric-value">{data.metrics.battery_per_minute} units</span>
        </div>
      </div>

      <div className="analysis-content">
        <h4>Analysis Insights:</h4>
        <div className="insights-list">
        {groupedInsights.map((group, index) => (
          <div key={index} className="insight-group">
          {group.map((insight, idx) => (
            <div key={idx} className="insight-item">
            {insight.match(/^\d/) && <ChevronRight className="insight-icon" />}
            <p>{insight.match(/^\d/) ? <strong>{insight.replace(/-/g, '')}</strong> : insight.replace(/-/g, '')}</p>
            </div>
          ))}
          </div>
        ))}
        </div>
      </div>
      </div>
    );
  };

  const MovementPatternsSection = ({ data }) => {
    if (!data) return null;

    const insights = data.analysis.split('\n').filter(Boolean);
    const groupedInsights = [];
    let currentGroup = [];

    insights.forEach((insight) => {
      if (insight.match(/^\d/)) {
      if (currentGroup.length) {
        groupedInsights.push(currentGroup);
        currentGroup = [];
      }
      }
      currentGroup.push(insight);
    });

    if (currentGroup.length) {
      groupedInsights.push(currentGroup);
    }

    return (
      <div className="analysis-section">
      <div className="section-header">
        <Activity className="section-icon-activity" />
        <h3>Movement Patterns</h3>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.patterns}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="action" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Bar yAxisId="left" dataKey="usage_count" fill="#a6670a" name="Usage Count" />
          <Bar yAxisId="right" dataKey="usage_percentage" fill="#0aa660" name="Efficiency %" />
        </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="analysis-content">
        <h4>Movement Analysis:</h4>
        <div className="insights-list">
        {groupedInsights.map((group, index) => (
          <div key={index} className="insight-group">
          {group.map((insight, idx) => (
            <div key={idx} className="insight-item">
            {insight.match(/^\d/) && <ChevronRight className="insight-icon" />}
            <p>{insight.match(/^\d/) ? <strong>{insight.replace(/-/g, '')}</strong> : insight.replace(/-/g, '')}</p>
            </div>
          ))}
          </div>
        ))}
        </div>
      </div>
      </div>
    );
  };

  const PerformanceAnalysisSection = ({ data }) => {
    if (!data) return null;

    const chartData = [
      { name: 'Commands', value: parseFloat(data.metrics.avg_commands_per_flight) },
      { name: 'Duration', value: parseFloat(data.metrics.avg_flight_duration) },
      { name: 'Efficiency', value: parseFloat(data.metrics.items_per_minute) },
      { name: 'Battery', value: parseFloat(data.metrics.items_per_battery_unit) }
    ];

    const insights = data.analysis.split('\n').filter(Boolean);
    const groupedInsights = [];
    let currentGroup = [];

    insights.forEach((insight) => {
      if (insight.match(/^\d/)) {
      if (currentGroup.length) {
        groupedInsights.push(currentGroup);
        currentGroup = [];
      }
      }
      currentGroup.push(insight);
    });

    if (currentGroup.length) {
      groupedInsights.push(currentGroup);
    }

    return (
      <div className="analysis-section">
      <div className="section-header">
      <Gauge className="section-icon-gauge" />
      <h3>Performance Analysis</h3>
      </div>

      <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#c41010" strokeWidth={3} />
      </LineChart>
      </ResponsiveContainer>
      </div>

      <div className="metrics-container">
      <div className="metric-item">
      <span className="metric-label">Commands per Flight:</span>
      <span className="metric-value">{data.metrics.avg_commands_per_flight}</span>
      </div>
      <div className="metric-item">
      <span className="metric-label">Flight Duration:</span>
      <span className="metric-value">{data.metrics.avg_flight_duration} hours</span>
      </div>
      <div className="metric-item">
      <span className="metric-label">Unique Movements:</span>
      <span className="metric-value">{data.metrics.avg_unique_movements}</span>
      </div>
      </div>

      <div className="analysis-content">
      <h4>Performance Insights:</h4>
      <div className="insights-list">
      {groupedInsights.map((group, index) => (
        <div key={index} className="insight-group">
        {group.map((insight, idx) => (
        <div key={idx} className="insight-item">
        {insight.match(/^\d/) && <ChevronRight className="insight-icon" />}
        <p>{insight.match(/^\d/) ? <strong>{insight.replace(/-/g, '')}</strong> : insight.replace(/-/g, '')}</p>
        </div>
        ))}
        </div>
      ))}
      </div>
      </div>
      </div>
    );
  };

  if (error) {
    return <div className="analysis-error">Failed to fetch analysis data: {error}</div>;
  }

  return (
    <div className="ai-analysis">
      <BatteryEfficiencySection data={batteryAnalysis} />
      <MovementPatternsSection data={movementAnalysis} />
      <PerformanceAnalysisSection data={performanceAnalysis} />
    </div>
  );
};

export default AIAnalysis;