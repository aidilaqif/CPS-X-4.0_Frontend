import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import moment from 'moment-timezone';

const FlightActivityChart = ({ flightStats }) => {
  const [timeRange, setTimeRange] = useState('hour');
  
  const processData = (data, range) => {
    if (!data?.byHour || data.byHour.length === 0) return [];
    
    const flights = data.byHour.map(item => ({
      ...item,
      timestamp: moment().hour(parseInt(item.hour)).format(),
    }));

    switch (range) {
      case 'hour':
        return flights.map(flight => ({
          time: flight.hour,
          flights: flight.flights,
          avgBatteryUsage: (flight.flights > 0 ? data.avgBatteryUsage : 0),
        }));

      case 'day':
        const byDay = {};
        flights.forEach(flight => {
          const day = moment(flight.timestamp).format('DD/MM');
          if (!byDay[day]) {
            byDay[day] = { flights: 0, batterySum: 0 };
          }
          byDay[day].flights += flight.flights;
          byDay[day].batterySum += flight.flights * data.avgBatteryUsage;
        });
        
        return Object.entries(byDay).map(([day, stats]) => ({
          time: day,
          flights: stats.flights,
          avgBatteryUsage: stats.flights > 0 ? stats.batterySum / stats.flights : 0,
        }));

      case 'month':
        const byMonth = {};
        flights.forEach(flight => {
          const month = moment(flight.timestamp).format('MMM YYYY');
          if (!byMonth[month]) {
            byMonth[month] = { flights: 0, batterySum: 0 };
          }
          byMonth[month].flights += flight.flights;
          byMonth[month].batterySum += flight.flights * data.avgBatteryUsage;
        });
        
        return Object.entries(byMonth).map(([month, stats]) => ({
          time: month,
          flights: stats.flights,
          avgBatteryUsage: stats.flights > 0 ? stats.batterySum / stats.flights : 0,
        }));

      case 'year':
        const byYear = {};
        flights.forEach(flight => {
          const year = moment(flight.timestamp).format('YYYY');
          if (!byYear[year]) {
            byYear[year] = { flights: 0, batterySum: 0 };
          }
          byYear[year].flights += flight.flights;
          byYear[year].batterySum += flight.flights * data.avgBatteryUsage;
        });
        
        return Object.entries(byYear).map(([year, stats]) => ({
          time: year,
          flights: stats.flights,
          avgBatteryUsage: stats.flights > 0 ? stats.batterySum / stats.flights : 0,
        }));

      default:
        return flights;
    }
  };

  const chartData = useMemo(() => processData(flightStats, timeRange), [flightStats, timeRange]);

  if (!chartData || chartData.length === 0) return null;

  return (
    <div className="flight-activity-chart">
      <div className="flight-activity-header">
        <h3 className="chart-title">Flight Activity Overview</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-range-select"
        >
          <option value="hour">By Hour</option>
          <option value="day">By Day</option>
          <option value="month">By Month</option>
          <option value="year">By Year</option>
        </select>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time"
              label={{ value: 'Time Period', position: 'bottom', offset: 50 }}
              angle={-45}
              textAnchor="end"
              height={80}
              tickMargin={10}
              interval={0}
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              label={{ value: 'Number of Flights', angle: -90, position: 'outside', offset: 0 }}
              padding={{ top: 20 }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              label={{ value: 'Avg Battery Usage (%)', angle: 90, position: 'outside', offset: 0 }}
              padding={{ top: 20 }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'avgBatteryUsage') return `${value.toFixed(1)}%`;
                return value;
              }}
            />
            <Legend />
            <Bar 
              dataKey="flights" 
              name="Number of Flights" 
              fill="#8884d8"
              yAxisId="left"
            />
            <Line 
              type="monotone" 
              dataKey="avgBatteryUsage"
              name="Avg Battery Usage"
              stroke="#ff7300"
              yAxisId="right"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="insights-grid">
        <div className="insight-card flight-insights">
          <h4>Flight Insights</h4>
          <p>
            Total Flights: {chartData.reduce((sum, item) => sum + item.flights, 0)}
          </p>
          <p>
            Most Active Period: {
              chartData.reduce((max, item) => 
                item.flights > (max?.flights || 0) ? item : max
              , {}).time
            }
          </p>
        </div>
        <div className="insight-card battery-insights">
          <h4>Battery Usage</h4>
          <p>
            Average Battery Per Flight: {
              (chartData.reduce((sum, item) => sum + item.avgBatteryUsage, 0) / chartData.length).toFixed(1)
            }%
          </p>
          <p>
            Max Battery Usage: {
              Math.max(...chartData.map(item => item.avgBatteryUsage)).toFixed(1)
            }%
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlightActivityChart;