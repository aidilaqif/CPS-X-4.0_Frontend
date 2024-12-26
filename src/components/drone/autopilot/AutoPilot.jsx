import React, { useState, useEffect } from "react";
import "../../../styles.css";
import ScannedItemsTable from "../shared_components/ScannedItemTable";
import { Card, message } from "antd";

const AutoPilot = () => {
  const [connected, setConnected] = useState(false);
  const [battery, setBattery] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [flightPlanLoaded, setFlightPlanLoaded] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState("");
  const [qrResult, setQrResult] = useState("");
  const [flightPlanPreview, setFlightPlanPreview] = useState(null);
  const [calibrating, setCalibrating] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch drone status
        const statusResponse = await fetch(`${API_BASE}/status`);
        const statusData = await statusResponse.json();
        setConnected(statusData.connected);
        setBattery(statusData.battery);
        setQrResult(statusData.qr_result);

        // Fetch scanned items
        const scannedItemsResponse = await fetch(`${API_BASE}/scanned-items`);
        const scannedItemsData = await scannedItemsResponse.json();
        setScannedItems(
          scannedItemsData.items.map((item) => ({
            ...item,
            key: item.label_id + item.timestamp, // Add key for Ant Design Table
          }))
        );
      } catch (err) {
        message.error("Failed to fetch drone status");
      }
    };

    const intervalId = setInterval(fetchData, 1000);

    // Add global update function
    window.updateScannedItems = (updatedItems) => {
      setScannedItems(
        updatedItems.map((item) => ({
          ...item,
          key: item.label_id + item.timestamp,
        }))
      );
    };

    return () => {
      clearInterval(intervalId);
      delete window.updateScannedItems;
    };
  }, [API_BASE]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFlightPlanLoaded(false);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setFlightPlanPreview(data);
        } catch (err) {
          setError("Invalid flight plan file");
        }
      };
      reader.readAsText(file);
    }
  };

  const uploadFlightPlan = async () => {
    if (!selectedFile) {
      setError("Please select a flight plan file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_BASE}/autopilot/upload_flight_plan`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.status === "success") {
        setFlightPlanLoaded(true);
        setError("Flight plan loaded successfully");
        setTimeout(() => setError(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to upload flight plan");
    }
  };

  const startAutopilot = async () => {
    if (battery < 20) {
      setError("Battery too low for autopilot (minimum 20% required)");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/autopilot/start_autopilot`, {
        method: "POST",
      });

      const data = await response.json();
      if (data.status === "success") {
        setIsExecuting(true);
        setError("Autopilot started");
        setTimeout(() => setError(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to start autopilot");
    }
  };

  const stopAutopilot = async () => {
    try {
      await fetch(`${API_BASE}/autopilot/stop_autopilot`, {
        method: "POST",
      });
      setIsExecuting(false);
      setError("Autopilot stopped");
      setTimeout(() => setError(""), 3000);
    } catch (err) {
      setError("Failed to stop autopilot");
    }
  };

  const calibrateDrone = async () => {
    if (!connected) {
      setError("Drone must be connected to calibrate");
      return;
    }

    try {
      setCalibrating(true);
      setError("Calibrating IMU - Please keep drone stationary...");

      const response = await fetch(`${API_BASE}/calibrate`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setError("Calibration successful");
        setTimeout(() => setError(""), 3000);
      } else {
        setError(data.message || "Calibration failed");
      }
    } catch (err) {
      setError("Calibration failed: " + err.message);
    } finally {
      setCalibrating(false);
    }
  };

  const emergencyStop = async () => {
    try {
      await fetch(`${API_BASE}/force_emergency`, {
        method: "POST",
      });
      setIsExecuting(false);
      setError("EMERGENCY STOP ACTIVATED");
    } catch (err) {
      setError("Failed to execute emergency stop");
    }
  };

  return (
    <div className="container">
      <div className="dashboard-grid">
        {/* AutoPilot Control Card */}
        <div className="card control-card">
          <div className="card-header">
            <div className="card-title">
              Tello Drone AutoPilot
              <div className="status-bar">
                <span className={connected ? "connected" : "disconnected"}>
                  {connected ? "● Connected" : "○ Disconnected"}
                </span>
                <span>Battery: {battery}%</span>
                {isExecuting && (
                  <span className="executing">● AutoPilot Active</span>
                )}
              </div>
            </div>
          </div>

          <div className="autopilot-controls">
            {/* Calibration Section */}
            <div className="calibration-section">
              <button
                className={`button calibrate ${
                  calibrating ? "calibrating" : ""
                }`}
                onClick={calibrateDrone}
                disabled={!connected || isExecuting || calibrating}
              >
                {calibrating ? "Calibrating..." : "Calibrate IMU"}
              </button>
              <div className="calibration-note">
                Note: Calibrate before starting AutoPilot for better stability
              </div>
            </div>

            {/* File Upload Section */}
            <div className="file-upload">
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                disabled={!connected || isExecuting}
              />
              <button
                className="button"
                onClick={uploadFlightPlan}
                disabled={!selectedFile || !connected || isExecuting}
              >
                Upload Flight Plan
              </button>
            </div>

            {/* Execution Controls */}
            <div className="execution-controls">
              <button
                className={`button ${isExecuting ? "danger" : "primary"}`}
                onClick={isExecuting ? stopAutopilot : startAutopilot}
                disabled={!connected || !flightPlanLoaded}
              >
                {isExecuting ? "Stop AutoPilot" : "Start AutoPilot"}
              </button>
            </div>

            {/* Flight Plan Preview */}
            {flightPlanPreview && (
              <div className="flight-plan-preview">
                <h3>Flight Plan Preview</h3>
                <div className="preview-content">
                  <p>
                    Total Commands:{" "}
                    {flightPlanPreview.session_summary.total_commands}
                  </p>
                  <p>
                    Battery Required:{" "}
                    {flightPlanPreview.session_summary.battery_start -
                      flightPlanPreview.session_summary.battery_end}
                    %
                  </p>
                  <p>Commands:</p>
                  <div className="command-list">
                    {Object.entries(
                      flightPlanPreview.session_summary.command_breakdown
                    ).map(([command, count]) => (
                      <div key={command} className="command-item">
                        {command}: {count}x
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Camera Feed Card */}
        <div className="card camera-card">
          <div className="card-header">
            <h2 className="card-title">Drone Camera Feed</h2>
          </div>
          <div className="video-feed">
            {connected ? (
              <img src={`${API_BASE}/video_feed`} alt="Drone camera feed" />
            ) : (
              <div className="placeholder">Camera feed unavailable</div>
            )}
          </div>
        </div>

        {/* QR Result Card */}
        <Card title="QR Code Detection" className="qr-result-card">
          <div className="qr-result">
            {qrResult ? (
              <div className="qr-content">
                <pre>{qrResult}</pre>
              </div>
            ) : (
              "No QR code detected"
            )}
          </div>
        </Card>

        {/* Scanned Items History Card */}
        <Card
          title="Scanned Items History"
          className="scanned-items-card"
          style={{ marginTop: "1rem" }}
        >
          <ScannedItemsTable items={scannedItems} />
        </Card>
      </div>

      {/* Emergency Stop Button - Full Width */}
      <button
        className="button danger force-emergency"
        onClick={emergencyStop}
        disabled={!connected}
      >
        FORCE EMERGENCY STOP
      </button>

      {error && (
        <div
          className={`alert ${
            error.includes("success")
              ? "success"
              : error.includes("Calibrating")
              ? "info"
              : error.includes("EMERGENCY")
              ? "emergency"
              : "error"
          }`}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default AutoPilot;
