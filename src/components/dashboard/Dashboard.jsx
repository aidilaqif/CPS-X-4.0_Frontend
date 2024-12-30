import React, { useEffect, useState } from "react";
import { Card, message } from "antd";
import {
  fetchDroneCoverage,
  fetchStockTakeStats,
  fetchRelocationStats,
  fetchMovementHistory,
} from "../../services/dashboard.service";
import "../../assets/styles/components/Dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState({
    droneCoverage: null,
    stockTakeStats: null,
    relocationStats: null,
    movementHistory: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [droneCoverage, stockTakeStats, relocationStats, movementHistory] =
          await Promise.all([
            fetchDroneCoverage(),
            fetchStockTakeStats(),
            fetchRelocationStats(),
            fetchMovementHistory(),
          ]);

        setData({
          droneCoverage,
          stockTakeStats,
          relocationStats,
          movementHistory,
        });
      } catch (err) {
        message.error(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <Card title="Drone Coverage Statistics" className="dashboard-card">
        <p>{data.droneCoverage ? JSON.stringify(data.droneCoverage) : "Loading..."}</p>
      </Card>
      <Card title="Stock Take Statistics" className="dashboard-card">
        <p>{data.stockTakeStats ? JSON.stringify(data.stockTakeStats) : "Loading..."}</p>
      </Card>
      <Card title="Relocation Statistics" className="dashboard-card">
        <p>{data.relocationStats ? JSON.stringify(data.relocationStats) : "Loading..."}</p>
      </Card>
      <Card title="Item Movement History" className="dashboard-card">
        <ul>
          {data.movementHistory.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Dashboard;
