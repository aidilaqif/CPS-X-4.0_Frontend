import React, { useState, useEffect } from 'react';
import {  Battery, ChevronRight , DownloadIcon} from 'lucide-react';
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { analysisService } from '../../services/analysis.service';
import '../../assets/styles/components/AIAnalysis.css';

const AIAnalysis = () => {
  const [batteryAnalysis, setBatteryAnalysis] = useState(null);
  // const [movementAnalysis, setMovementAnalysis] = useState(null);
  // const [performanceAnalysis, setPerformanceAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const [batteryData] = await Promise.all([
        analysisService.getBatteryEfficiency(),
        // analysisService.getMovementPatterns(),
        // analysisService.getDronePerformance()
      ]);

      setBatteryAnalysis(batteryData);
      // setMovementAnalysis(movementData);
      // setPerformanceAnalysis(performanceData);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message);
    }
  };

  const BatteryEfficiencySection = ({ data }) => {
    if (!data?.timeSeriesData || !data?.metrics) return null;
  
    // Keep your existing metrics calculation
    const efficiencyGap = (
      Number(data.metrics.avg_actual_rate) -
      Number(data.metrics.avg_recommended_rate)
    ).toFixed(2);
  
  // Process insights
  const processInsights = (analysisText) => {
    const sections = {
      findings: [],
      implications: [],
      recommendations: []
    };
    
    let currentSection = null;
    
    const lines = analysisText.split('\n').filter(Boolean);
    
    lines.forEach(line => {
      if (line.includes('**Findings:**')) {
        currentSection = 'findings';
      } else if (line.includes('**Implications:**')) {
        currentSection = 'implications';
      } else if (line.includes('**Recommendations:**')) {
        currentSection = 'recommendations';
      } else if (currentSection && line.trim()) {
        const cleanedLine = line
          .replace(/^\d+\.\s*\*\*/, '')
          .replace(/\*\*/g, '')
          .trim();
          
        if (cleanedLine) {
          sections[currentSection].push({
            isHeader: line.includes('**') && line.match(/^\d/),
            content: cleanedLine
          });
        }
      }
    });
    
    return sections;
  };

  const insights = processInsights(data.analysis);

  const renderInsightSection = (title, items) => (
    <div className="insight-section">
      <h3 className="insight-section-title">{title}</h3>
      <div className="insight-section-content">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={`insight-item ${item.isHeader ? 'insight-header' : 'insight-detail'}`}
          >
            {item.isHeader ? (
              <div className="insight-header-content">
                <ChevronRight className="insight-icon" />
                <p><strong>{item.content}</strong></p>
              </div>
            ) : (
              <div className="insight-detail-content">
                <p>{item.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
    

    return (
      <div className="battery-analysis-section">
        {/* Battery Comparison Chart */}
        <div className="battery-metrics-grid">
          <div className="metric-card">
            <h4>Actual Rate</h4>
            <p className="metric-value">{data.metrics.avg_actual_rate}%/s</p>
            <p className="metric-label">consumption rate</p>
          </div>
          <div className="metric-card">
            <h4>Recommended Rate</h4>
            <p className="metric-value">{data.metrics.avg_recommended_rate}%/s</p>
            <p className="metric-label">based on specs</p>
          </div>
          <div className="metric-card">
            <h4>Efficiency Gap</h4>
            <p className={`metric-value ${efficiencyGap < 0 ? 'positive' : 'negative'}`}>
              {efficiencyGap}%
            </p>
            <p className="metric-label">vs recommended</p>
          </div>
        </div>
  
        <div className="battery-charts-container">
          <div className="chart-wrapper">
            <h4>Battery Level Comparison</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timePoint"
                  label={{ value: 'Time (seconds)', position: 'insideBottomRight', offset: -6}}
                />
                <YAxis 
                  label={{ value: 'Battery (%)', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Actual Consumption"
                  stroke="#8884d8"
                  strokeWidth={3}
                  dot={true}
                />
                <Line
                  type="monotone"
                  dataKey="Recommended Consumption"
                  stroke="#82ca9d"
                  strokeWidth={3}
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        <div className="analysis-content">
        <div className="insights-container">
          {renderInsightSection('Findings', insights.findings)}
          {renderInsightSection('Implications', insights.implications)}
          {renderInsightSection('Recommendations', insights.recommendations)}
        </div>
      </div>
        </div>
    );
  };
  

  // const MovementPatternsSection = ({ data }) => {
  //   if (!data) return null;

  //   const insights = data.analysis.split('\n').filter(Boolean);
  //   const groupedInsights = [];
  //   let currentGroup = [];

  //   insights.forEach((insight) => {
  //     if (insight.match(/^\d/)) {
  //     if (currentGroup.length) {
  //       groupedInsights.push(currentGroup);
  //       currentGroup = [];
  //     }
  //     }
  //     currentGroup.push(insight);
  //   });

  //   if (currentGroup.length) {
  //     groupedInsights.push(currentGroup);
  //   }

  //   return (
  //     <div className="analysis-section">
  //     <div className="section-header">
  //       <Activity className="section-icon-activity" />
  //       <h3>Movement Patterns</h3>
  //     </div>

  //     <div className="chart-container">
  //       <ResponsiveContainer width="100%" height={300}>
  //       <BarChart data={data.patterns}>
  //         <CartesianGrid strokeDasharray="3 3" />
  //         <XAxis dataKey="action" />
  //         <YAxis yAxisId="left" orientation="left" />
  //         <YAxis yAxisId="right" orientation="right" />
  //         <Tooltip />
  //         <Bar yAxisId="left" dataKey="usage_count" fill="#a6670a" name="Usage Count" />
  //         <Bar yAxisId="right" dataKey="usage_percentage" fill="#0aa660" name="Efficiency %" />
  //       </BarChart>
  //       </ResponsiveContainer>
  //     </div>

  //     <div className="analysis-content">
  //       <h4>Movement Analysis:</h4>
  //       <div className="insights-list">
  //         {groupedInsights.map((group, index) => (
  //           <div key={index} className="insight-group">
  //           {group.map((insight, idx) => (
  //             <div key={idx} className="insight-item">
  //             {insight.match(/^\d/) && <ChevronRight className="insight-icon" />}
  //             <p>{insight.match(/^\d/) ? <strong>{insight.replace(/-/g, '')}</strong> : insight.replace(/-/g, '')}</p>
  //             </div>
  //           ))}
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //     </div>
  //   );
  // };

  // const PerformanceAnalysisSection = ({ data }) => {
  //   if (!data) return null;

  //   const chartData = [
  //     { name: 'Commands', value: parseFloat(data.metrics.avg_commands_per_flight) },
  //     { name: 'Duration', value: parseFloat(data.metrics.avg_flight_duration) },
  //     { name: 'Efficiency', value: parseFloat(data.metrics.items_per_minute) },
  //     { name: 'Battery', value: parseFloat(data.metrics.items_per_battery_unit) }
  //   ];

  //   const insights = data.analysis.split('\n').filter(Boolean);
  //   const groupedInsights = [];
  //   let currentGroup = [];

  //   insights.forEach((insight) => {
  //     if (insight.match(/^\d/)) {
  //     if (currentGroup.length) {
  //       groupedInsights.push(currentGroup);
  //       currentGroup = [];
  //     }
  //     }
  //     currentGroup.push(insight);
  //   });

  //   if (currentGroup.length) {
  //     groupedInsights.push(currentGroup);
  //   }

  //   return (
  //     <div className="analysis-section">
  //     <div className="section-header">
  //     <Gauge className="section-icon-gauge" />
  //     <h3>Performance Analysis</h3>
  //     </div>

  //     <div className="chart-container">
  //     <ResponsiveContainer width="100%" height={300}>
  //     <LineChart data={chartData}>
  //       <CartesianGrid strokeDasharray="3 3" />
  //       <XAxis dataKey="name" />
  //       <YAxis />
  //       <Tooltip />
  //       <Line type="monotone" dataKey="value" stroke="#c41010" strokeWidth={3} />
  //     </LineChart>
  //     </ResponsiveContainer>
  //     </div>

  //     <div className="metrics-container">
  //     <div className="metric-item">
  //     <span className="metric-label">Commands per Flight:</span>
  //     <span className="metric-value">{data.metrics.avg_commands_per_flight}</span>
  //     </div>
  //     <div className="metric-item">
  //     <span className="metric-label">Flight Duration:</span>
  //     <span className="metric-value">{data.metrics.avg_flight_duration} hours</span>
  //     </div>
  //     <div className="metric-item">
  //     <span className="metric-label">Unique Movements:</span>
  //     <span className="metric-value">{data.metrics.avg_unique_movements}</span>
  //     </div>
  //     </div>

  //     <div className="analysis-content">
  //     <h4>Performance Insights:</h4>
  //     <div className="insights-list">
  //     {groupedInsights.map((group, index) => (
  //       <div key={index} className="insight-group">
  //       {group.map((insight, idx) => (
  //       <div key={idx} className="insight-item">
  //       {insight.match(/^\d/) && <ChevronRight className="insight-icon" />}
  //       <p>{insight.match(/^\d/) ? <strong>{insight.replace(/-/g, '')}</strong> : insight.replace(/-/g, '')}</p>
  //       </div>
  //       ))}
  //       </div>
  //     ))}
  //     </div>
  //     </div>
  //     </div>
  //   );
  // };

  if (error) {
    return <div className="analysis-error">Failed to fetch analysis data: {error}</div>;
  }
  const handleDownload = async () => {};
  
  return (
    <div className="ai-analysis">
      <div className="analysis-section">
        <div className="section-header">
          <Battery className="section-icon-battery" />
          <h3>Battery Efficiency</h3>
        </div>
        <BatteryEfficiencySection data={batteryAnalysis} />
        <div className="download-footer">
                <button
                    onClick={() => handleDownload()}
                    className="download-button download-button-primary"
                >
                    <DownloadIcon className="w-4 h-4" /> Download Report
                </button>
            </div>
      </div>
      {/* <MovementPatternsSection data={movementAnalysis} /> */}
      {/* <PerformanceAnalysisSection data={performanceAnalysis} /> */}
    </div>
    
  );
};

export default AIAnalysis;