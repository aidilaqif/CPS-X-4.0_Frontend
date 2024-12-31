// src/components/dashboard/FlightActivityChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartWrapper from './ChartWrapper';

const FlightActivityChart = ({ flightStats }) => {
  if (!flightStats?.byHour || flightStats.byHour.length === 0) return null;

  return (
    <ChartWrapper title="Flight Activity by Hour">
      <ResponsiveContainer>
        <LineChart data={flightStats.byHour}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="flights" 
            stroke="#8884d8" 
            name="Number of Flights"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default FlightActivityChart;