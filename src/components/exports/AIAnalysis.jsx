import React, { useState, useEffect } from "react";
import { Battery, Activity, Gauge } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { analysisService } from "../../services/analysis.service";
import "../../assets/styles/components/AIAnalysis.css";

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
      console.log("Fetching battery data..");
      console.log("Fetching movement data..");
      console.log("Fetching performance data..");
      const batteryData = await analysisService.getBatteryEfficiency();
      const movementData = await analysisService.getMovementPatterns();
      const performanceData = await analysisService.getDronePerformance();

      setBatteryAnalysis(batteryData);
      setMovementAnalysis(movementData);
      setPerformanceAnalysis(performanceData);
      console.log("Battery data:", batteryData);
      console.log("Movement data:", movementData);
      console.log("Performance data:", performanceData);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message);
    }
  };

  const renderBatteryEfficiency = () => {
    if (!batteryAnalysis) return null;

    const chartData = [
      {
        name: "Consumption",
        value: batteryAnalysis.metrics.avg_battery_consumption,
      },
      {
        name: "Duration",
        value: batteryAnalysis.metrics.avg_flight_duration,
      },
      {
        name: "Efficiency",
        value: batteryAnalysis.metrics.battery_per_minute,
      },
    ];

    return (
      <div className="analysis-section">
        <div className="analysis-header">
          <Battery className="analysis-icon" />
          <h3>Battery Efficiency</h3>
        </div>
        <div className="analysis-chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="analysis-insights">
          <p>{batteryAnalysis.analysis}</p>
        </div>
      </div>
    );
  };

  const renderMovementPatterns = () => {
    if (!movementAnalysis) return null;

    return (
      <div className="analysis-section">
        <div className="analysis-header">
          <Activity className="analysis-icon" />
          <h3>Movement Patterns</h3>
        </div>
        <div className="analysis-chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={movementAnalysis.patterns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="action" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar
                yAxisId="left"
                dataKey="usage_count"
                fill="#3b82f6"
                name="Usage Count"
              />
              <Bar
                yAxisId="right"
                dataKey="usage_percentage"
                fill="#22c55e"
                name="Efficiency %"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="analysis-insights">
          <p>{movementAnalysis.analysis}</p>
        </div>
      </div>
    );
  };

  const renderPerformanceAnalysis = () => {
    if (!performanceAnalysis) return null;

    const chartData = [
      {
        name: "Commands",
        value: performanceAnalysis.metrics.avg_commands_per_flight,
      },
      {
        name: "Duration",
        value: performanceAnalysis.metrics.avg_flight_duration,
      },
      {
        name: "Efficiency",
        value: performanceAnalysis.metrics.items_per_minute,
      },
      {
        name: "Battery",
        value: performanceAnalysis.metrics.items_per_battery_unit,
      },
    ];

    return (
      <div className="analysis-section">
        <div className="analysis-header">
          <Gauge className="analysis-icon" />
          <h3>Performance Analysis</h3>
        </div>
        <div className="analysis-chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="analysis-insights">
          <p>{performanceAnalysis.analysis}</p>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="analysis-error">
        Failed to fetch analysis data: {error}
      </div>
    );
  }

  return (
    <div className="ai-analysis">
      {renderBatteryEfficiency()}
      {renderMovementPatterns()}
      {renderPerformanceAnalysis()}
    </div>
  );
};

export default AIAnalysis;
