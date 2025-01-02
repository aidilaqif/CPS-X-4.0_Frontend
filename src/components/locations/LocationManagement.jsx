import React, { useState, useEffect } from "react";
import {
  MapPin,
  Loader2,
  Plus,
  X,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { locationService } from "../../services/location.service";
import "../../assets/styles/components/LocationManagement.css";

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    locationId: null,
    locationLabel: "",
  });
  const [formData, setFormData] = useState({
    location_id: "",
    type_name: "",
  });
  const [filters, setFilters] = useState({
    type_name: "",
    location_id: "",
  });
  const [sorting, setSorting] = useState({
    field: null,
    direction: "asc",
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

  const handleDelete = async (locationId) => {
    try {
      await locationService.deleteLocation(locationId);
      // Refresh the locations list after successful deletion
      await fetchLocation();
      // Close the confirmation dialog
      setDeleteConfirm({ isOpen: false, locationId: null, locationLabel: "" });
    } catch (err) {
      console.error("Error deleting location:", err);
      setError("Failed to delete location: " + err.message);
    }
  };

  // Get unique values for filters
  const getUniqueValues = (field) => {
    return [...new Set(locations.map((location) => location[field]))].filter(
      Boolean
    );
  };

  // Handle sorting
  const handleSort = (field) => {
    setSorting((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Filter and sort locations
  const filteredLocations = locations.filter((location) => {
    return (
      (filters.type_name === "" || location.type_name === filters.type_name) &&
      (filters.location_id === "" ||
        location.location_id
          .toLowerCase()
          .includes(filters.location_id.toLowerCase()))
    );
  });

  const sortedLocations = [...filteredLocations].sort((a, b) => {
    if (!sorting.field) return 0;

    let valueA = a[sorting.field];
    let valueB = b[sorting.field];

    if (typeof valueA === "string") valueA = valueA.toLowerCase();
    if (typeof valueB === "string") valueB = valueB.toLowerCase();

    if (valueA < valueB) return sorting.direction === "asc" ? -1 : 1;
    if (valueB < valueA) return sorting.direction === "asc" ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (field) => {
    if (sorting.field !== field) return null;
    return sorting.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
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

      {/* Filters Section */}
      <div className="location-management-filters">
        <input
          type="text"
          placeholder="Search Location"
          value={filters.location_id}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, location_id: e.target.value }))
          }
          className="location-management-filter"
        />
        <select
          value={filters.type_name}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type_name: e.target.value }))
          }
          className="location-management-filter"
        >
          <option value="">All Types</option>
          {getUniqueValues("type_name").map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="location-management-table-container">
        <table className="location-management-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("location_id")}>
                <div className="flex items-center gap-1 cursor-pointer">
                  Location ID
                  {renderSortIcon("location_id")}
                </div>
              </th>
              <th onClick={() => handleSort("type_name")}>
                <div className="flex items-center gap-1 cursor-pointer">
                  Type Name
                  {renderSortIcon("type_name")}
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedLocations.map((location) => (
              <tr key={location.location_id}>
                <td>{location.location_id}</td>
                <td>{location.type_name}</td>
                <td>
                  <button
                    onClick={() =>
                      setDeleteConfirm({
                        isOpen: true,
                        locationId: location.location_id,
                        locationLabel: location.location_id,
                      })
                    }
                    className="location-management-button-icon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedLocations.length === 0 && (
          <div className="location-management-no-results">
            No locations found matching the filters
          </div>
        )}
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
                <label htmlFor="type_name">Type Name</label>
                <select
                  id="type_name"
                  name="type_name"
                  value={formData.type_name}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Paper Roll Location">
                    Paper Roll Location
                  </option>
                  <option value="FG Location">FG Pallet Location</option>
                </select>
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

      {/* Delete confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="location-management-modal-overlay">
          <div className="location-management-modal">
            <div className="location-management-modal-header">
              <h2>Delete Location</h2>
              <button
                onClick={() =>
                  setDeleteConfirm({
                    isOpen: false,
                    locationId: null,
                    locationLabel: "",
                  })
                }
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="location-management-modal-content">
              <p>
                Are you sure you want to delete location{" "}
                <span className="font-semibold">
                  {deleteConfirm.locationLabel}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="location-management-modal-footer">
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      isOpen: false,
                      locationId: null,
                      locationLabel: "",
                    })
                  }
                  className="location-management-button location-management-button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.locationId)}
                  className="location-management-button location-management-button-primary"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationManagement;
