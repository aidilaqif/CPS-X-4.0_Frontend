import React, { useState, useEffect } from "react";
import "../styles.css"; // Make sure this path is correct

const DroneInterface = () => {
  const [connected, setConnected] = useState(false);
  const [battery, setBattery] = useState(0);
  const [qrResult, setQrResult] = useState("");
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_BASE}/status`);
        const data = await response.json();
        setConnected(data.connected);
        setBattery(data.battery);
        setQrResult(data.qr_result);
      } catch (err) {
        setError("Failed to fetch drone status");
      }
    };

    const intervalId = setInterval(fetchStatus, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleConnect = async () => {
    try {
      const response = await fetch(`${API_BASE}/connect`, { method: "POST" });
      const data = await response.json();
      if (data.status === "connected") {
        setConnected(true);
        setError("");
      }
    } catch (err) {
      setError("Failed to connect to drone");
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch(`${API_BASE}/disconnect`, { method: "POST" });
      setConnected(false);
    } catch (err) {
      setError("Failed to disconnect from drone");
    }
  };

  const sendCommand = async (cmd) => {
    try {
      const response = await fetch(`${API_BASE}/command/${cmd}`);
      const data = await response.json();
      if (data.status === "error") {
        setError(data.message);
      }
    } catch (err) {
      setError(`Failed to execute command: ${cmd}`);
    }
  };

  const forceEmergencyStop = async () => {
    try {
      await fetch(`${API_BASE}/force_emergency`, { method: "POST" });
    } catch (err) {
      console.error("Force emergency failed:", err);
    }
  };

  const calibrateDrone = async () => {
    try {
      setError("");
      const response = await fetch(`${API_BASE}/calibrate`, {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        // Add some user feedback
        setError("Calibration successful");
        setTimeout(() => setError(""), 3000); // Clear message after 3 seconds
      } else {
        setError(data.message || "Calibration failed");
      }
    } catch (err) {
      setError("Calibration failed: " + err.message);
    }
  };

  // Add this new function in the DroneInterface component, after the calibrateDrone function:
  const saveLogs = async () => {
    try {
      const response = await fetch(`${API_BASE}/save_logs`, {
        method: "POST",
      });
      const data = await response.json();

      if (data.status === "success") {
        setError("Logs saved successfully!");
        // Clear success message after 3 seconds
        setTimeout(() => setError(""), 3000);
      } else {
        setError(data.message || "Failed to save logs");
      }
    } catch (err) {
      setError("Failed to save logs: " + err.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            Tello Drone Control
            <div className="status-bar">
              <span className={connected ? "connected" : "disconnected"}>
                {connected ? "● Connected" : "○ Disconnected"}
              </span>
              <span>Battery: {battery}%</span>
            </div>
          </div>
        </div>

        <div className="button-container">
          <button
            className={`button ${connected ? "danger" : ""}`}
            onClick={connected ? handleDisconnect : handleConnect}
          >
            {connected ? "Disconnect" : "Connect"}
          </button>
          <button
            className="button"
            onClick={calibrateDrone}
            disabled={!connected}
            style={{
              backgroundColor: "#4a9eff",
              marginLeft: "10px",
            }}
          >
            Calibrate IMU
          </button>
          <div className="controls">
            <div></div>
            <button
              className="button"
              onClick={() => sendCommand("takeoff")}
              disabled={!connected}
            >
              Take Off
            </button>
            <div></div>

            <div></div>
            <button
              className="button"
              onClick={() => sendCommand("forward")}
              disabled={!connected}
            >
              Forward
            </button>
            <div></div>

            <button
              className="button"
              onClick={() => sendCommand("left")}
              disabled={!connected}
            >
              Left
            </button>
            <button
              className="button"
              onClick={() => sendCommand("up")}
              disabled={!connected}
            >
              Up
            </button>
            <button
              className="button"
              onClick={() => sendCommand("right")}
              disabled={!connected}
            >
              Right
            </button>

            <div></div>
            <button
              className="button"
              onClick={() => sendCommand("down")}
              disabled={!connected}
            >
              Down
            </button>
            <div></div>

            <div></div>
            <button
              className="button"
              onClick={() => sendCommand("back")}
              disabled={!connected}
            >
              Back
            </button>
            <div></div>

            <div></div>
            <button
              className="button"
              onClick={() => sendCommand("land")}
              disabled={!connected}
            >
              Land
            </button>
            <div></div>
          </div>
          {/*  Add this button just before the emergency stop button in the JSX: */}
          <button
            className="button"
            onClick={saveLogs}
            disabled={!connected}
            style={{
              backgroundColor: "#2ecc71",
              marginBottom: "10px",
            }}
          >
            Save Movement Logs
          </button>
          <button
            className="button danger"
            onClick={() => sendCommand("emergency")}
            disabled={!connected}
          >
            Emergency Stop
          </button>
        </div>
      </div>

      <button
        className="button danger"
        onClick={forceEmergencyStop}
        style={{
          backgroundColor: "darkred",
          fontWeight: "bold",
          padding: "15px",
        }}
      >
        FORCE EMERGENCY STOP
      </button>

      {error && <div className="alert">{error}</div>}

      <div className="card">
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

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">QR Code Result</h2>
        </div>
        <div className="qr-result">{qrResult || "No QR code detected"}</div>
      </div>
    </div>
  );
};

export default DroneInterface;
