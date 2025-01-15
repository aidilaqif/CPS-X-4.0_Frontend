import React, { useState, useEffect } from 'react';
import {  Battery, Activity, Gauge, ChevronRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Legend, Area } from 'recharts';
import { analysisService } from '../../services/analysis.service';
import '../../assets/styles/components/AIAnalysis.css';
import moment from 'moment-timezone';

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
    if (!data?.timeSeriesData || !data?.metrics) return null;
  
    // Format time series data 
    const formattedTimeData = data.timeSeriesData.map(entry => ({
      ...entry,
      timestamp: moment(entry.timestamp).format('HH:mm'),
      actualConsumption: Number(entry.actualConsumption),
      recommendedConsumption: Number(entry.recommendedConsumption),
      actualEfficiency: Number(entry.actualEfficiency),
      recommendedEfficiency: Number(entry.recommendedEfficiency)
    }));
  
    // Calculate efficiency gap
    const efficiencyGap = (
      Number(data.metrics.avg_actual_efficiency) - 
      Number(data.metrics.avg_recommended_efficiency)
    ).toFixed(2);

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
      <div className="battery-analysis-section">
      <div className="battery-metrics-grid">
        <div className="metric-card">
        <h4>Average Consumption</h4>
        <p className="metric-value">{data.metrics.avg_actual_consumption}u</p>
        <p className="metric-label">vs {data.metrics.avg_recommended_consumption}u recommended</p>
        </div>
        <div className="metric-card">
        <h4>Efficiency Rate</h4>
        <p className="metric-value">{data.metrics.avg_actual_efficiency}</p>
        <p className="metric-label">items/battery unit</p>
        </div>
        <div className="metric-card">
        <h4>Efficiency Gap</h4>
        <p className={`metric-value ${efficiencyGap < 0 ? 'negative' : 'positive'}`}>
          {efficiencyGap}
        </p>
        <p className="metric-label">vs recommended</p>
        </div>
      </div>
      
      <div className="battery-charts-container">
        <div className="chart-wrapper">
        <h4>Consumption Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={formattedTimeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="actualConsumption" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.3}
            name="Actual"
          />
          <Area 
            type="monotone" 
            dataKey="recommendedConsumption" 
            stroke="#82ca9d" 
            fill="#82ca9d"
            fillOpacity={0.3}
            name="Recommended"
          />
          </AreaChart>
        </ResponsiveContainer>
        </div>
    
        <div className="chart-wrapper">
        <h4>Efficiency Trends</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedTimeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="actualEfficiency" 
            stroke="#8884d8" 
            name="Actual"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="recommendedEfficiency" 
            stroke="#82ca9d" 
            name="Recommended"
            strokeWidth={2}
          />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </div>
    
      <div className="analysis-content">
        <h4>Analysis Insights</h4>
        <div className="insights-list">
        {groupedInsights.map((group, index) => (
        <div key={index} className="insight-group">
        {group.map((insight, idx) => (
          <div key={idx} className="insight-item">
          {insight.match(/^\d/) && <ChevronRight className="insight-icon" />}
          <p>{insight.match(/^\d/) ? <strong>{insight.replace(/-/g, '').replace(/\*/g, ' ')}</strong>: insight.replace(/-/g, '') }
          </p>
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
      <div className="analysis-section">
        <div className="section-header">
          <Battery className="section-icon-battery" />
          <h3>Battery Efficiency</h3>
        </div>
        <BatteryEfficiencySection data={batteryAnalysis} />
      </div>
      <MovementPatternsSection data={movementAnalysis} />
      <PerformanceAnalysisSection data={performanceAnalysis} />
    </div>
  );
};

export default AIAnalysis;