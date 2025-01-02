// src/services/dashboard.service.js
import moment from 'moment-timezone';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// Process flights by hour helper function
const processFlightsByHour = (flights) => {
  const hourCounts = Array(24).fill(0);
  flights.forEach(flight => {
    if (flight.start_time) {
      const hour = moment(flight.start_time).hour();
      hourCounts[hour]++;
    }
  });
  return hourCounts.map((count, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    flights: count
  }));
};

// Process items data helper function
const processItemsData = (items) => {
  return {
    total: items.length,
    items: items, // Added this line to include raw items data
    byType: {
      'Roll': items.filter(item => item.label_type === 'Roll').length,
      'FG Pallet': items.filter(item => item.label_type === 'FG Pallet').length
    },
    byStatus: {
      'Available': items.filter(item => item.status === 'Available').length,
      'Checked Out': items.filter(item => item.status === 'Checked Out').length,
      'Lost': items.filter(item => item.status === 'Lost').length,
      'Unresolved': items.filter(item => item.status === 'Unresolved').length
    }
  };
};

// Process flight data helper function
const processFlightData = (flights) => {
  return {
    total: flights.length,
    totalCommands: flights.reduce((sum, flight) => sum + (flight.total_commands || 0), 0),
    avgBatteryUsage: flights.reduce((sum, flight) => {
      const usage = (flight.battery_start || 0) - (flight.battery_end || 0);
      return sum + (usage > 0 ? usage : 0);
    }, 0) / (flights.length || 1),
    byHour: processFlightsByHour(flights)
  };
};

// Process location data helper function
const processLocationData = (locations) => {
  return {
    total: locations.length,
    locations: locations, // Added this line to include raw locations data
    byType: locations.reduce((acc, loc) => {
      acc[loc.type_name] = (acc[loc.type_name] || 0) + 1;
      return acc;
    }, {})
  };
};

export const dashboardService = {
  // Fetch all dashboard data
  async getDashboardData() {
    try {
      const [itemsResponse, flightResponse, locationsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/items`),
        fetch(`${API_BASE_URL}/api/movement-logs`),
        fetch(`${API_BASE_URL}/api/locations`)
      ]);

      const itemsData = await itemsResponse.json();
      const flightData = await flightResponse.json();
      const locationsData = await locationsResponse.json();

      const items = itemsData.data || [];
      const flights = flightData.data || [];
      const locations = locationsData.data || [];

      return {
        itemStats: processItemsData(items),
        flightStats: processFlightData(flights),
        locationStats: processLocationData(locations)
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  },

  // Transform data for charts
  transformChartData(data) {
    if (!data) return { statusData: [], typeData: [], locationTypeData: [] };

    const { itemStats, locationStats } = data;

    const statusData = itemStats?.byStatus ? 
      Object.entries(itemStats.byStatus)
        .map(([name, value]) => ({ name, value: value || 0 }))
        .filter(item => item.value > 0) : [];

    const typeData = itemStats?.byType ?
      Object.entries(itemStats.byType)
        .map(([name, value]) => ({ name, value: value || 0 }))
        .filter(item => item.value > 0) : [];

    const locationTypeData = locationStats?.byType ?
      Object.entries(locationStats.byType)
        .map(([name, value]) => ({ name, value: value || 0 }))
        .filter(item => item.value > 0) : [];

    return {
      statusData,
      typeData,
      locationTypeData
    };
  }
};