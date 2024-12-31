// src/components/dashboard/LocationChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartWrapper from './ChartWrapper';

const LocationChart = ({ locationTypeData }) => {
  if (!locationTypeData || locationTypeData.length === 0) return null;

  return (
    <ChartWrapper title="Location Type Distribution">
      <ResponsiveContainer>
        <BarChart data={locationTypeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name="Number of Locations" />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default LocationChart;