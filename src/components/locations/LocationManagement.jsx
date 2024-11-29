import React, { useState, useEffect } from "react";
import { MapPin, Loader2, Plus, X } from "lucide-react";
import { locationService } from "../../services/location.service";
import "../../assets/styles/components/LocationManagement.css";

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    location_id: "",
    type_name: "",
  });

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const response = await locationService.getAllLocations();
      setLocations(response.data);
      setError(null);
    } catch (err) {
      console.log("Error fetching locations:", err);
      setError("Failed to fetch locations");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await locationService.createLocation(formData);
      await fetchLocation();
      setIsModalOpen(false);
      setFormData({ location_id: "", type_name: "" });
    } catch (err) {
      console.error("Error creating location:", err);
      setError("Failed to create location");
    }
  };

  if (loading) {
    return (
      <div className="location-management-loading">
        <Loader2 className="location-management-loading-spinner w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return <div className="location-management-error">{error}</div>;
  }

  return (
    <div className="location-management">
      <div className="location-management-header">
        <div className="location-management-title">
          <MapPin className="w-6 h-6" />
          <h1>Location Management</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="location-management-button location-management-button-primary"
        >
          <Plus className="w-4 h-4" /> Add New Location
        </button>
      </div>

      <div className="location-management-table-container">
        <table className="location-management-table">
          <thead>
            <tr>
              <th>Location ID</th>
              <th>Type Name</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.location_id}>
                <td>{location.location_id}</td>
                <td>{location.type_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="location-management-modal-overlay">
          <div className="location-management-modal">
            <div className="location-management-modal-header">
              <h2>Add New Location</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData({ location_id: "", type_name: "" });
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="location-management-form">
              <div className="location-management-form-group">
                <label>Location ID</label>
                <input
                  type="text"
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="location-management-form-group">
                <label>Type Name</label>
                <input
                  type="text"
                  name="type_name"
                  value={formData.type_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="location-management-modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ location_id: "", type_name: "" });
                  }}
                  className="location-management-button location-management-button-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="location-management-button location-management-button-primary"
                >
                  Create Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationManagement;