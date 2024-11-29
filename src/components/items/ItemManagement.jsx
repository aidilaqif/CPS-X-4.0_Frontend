import React, { useState, useEffect } from "react";
import {
  Package,
  Loader2,
  ChevronUp,
  ChevronDown,
  Plus,
  X,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import "../../assets/styles/components/ItemManagement.css";

const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    location: "",
  });
  const [sorting, setSorting] = useState({
    field: null,
    direction: "asc",
  });
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [itemDetails, setItemDetails] = useState({})
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    itemId: null,
    itemLabel: "",
  });
  const [formData, setFormData] = useState({
    label_id: "",
    label_type: "Roll",
    location_id: "",
    details: {
      code: "",
      name: "",
      size_mm: "",
      plt_number: "",
      quantity: "",
      work_order_id: "",
      total_pieces: "",
    },
  });

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsResponse, locationsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/items`),
          fetch(`${API_BASE_URL}/api/locations`),
        ]);

        if (!itemsResponse.ok || !locationsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const itemsData = await itemsResponse.json();
        const locationsData = await locationsResponse.json();

        setItems(itemsData.data);
        setLocations(locationsData.data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  const fetchItemDetails = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/items/${itemId}/exists`);
      if (!response.ok) throw new Error("Failed to fetch item details");
      const data = await response.json();
      setItemDetails(prev => ({
        ...prev,
        [itemId]: data.item
      }));
    } catch (err) {
      console.error("Error fetching item details:", err);
      setError("Failed to fetch item details");
    }
  };

  const handleRowExpand = async (itemId) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(itemId)) {
      newExpandedRows.delete(itemId);
    } else {
      newExpandedRows.add(itemId);
      if (!itemDetails[itemId]) {
        await fetchItemDetails(itemId);
      }
    }
    setExpandedRows(newExpandedRows);
  };

  const getUniqueValues = (field) => {
    return [...new Set(items.map((item) => item[field]))].filter(Boolean);
  };

  const filteredItems = items.filter((item) => {
    return (
      (filters.type === "" || item.label_type === filters.type) &&
      (filters.status === "" || item.status === filters.status) &&
      (filters.location === "" || item.location_id === filters.location)
    );
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sorting.field) return 0;

    let valueA = a[sorting.field];
    let valueB = b[sorting.field];

    if (sorting.field === "last_scan_time") {
      valueA = valueA ? new Date(valueA).getTime() : 0;
      valueB = valueB ? new Date(valueB).getTime() : 0;
    }

    if (valueA < valueB) return sorting.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sorting.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    setSorting((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const resetForm = () => {
    setFormData({
      label_id: "",
      label_type: "Roll",
      location_id: "",
      details: {
        code: "",
        name: "",
        size_mm: "",
        plt_number: "",
        quantity: "",
        work_order_id: "",
        total_pieces: "",
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("details.")) {
      const detailField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          [detailField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Refresh the items list
      const itemsResponse = await fetch(`${API_BASE_URL}/api/items`);
      const itemsData = await itemsResponse.json();
      setItems(itemsData.data);

      // Close the confirmation dialog
      setDeleteConfirm({ isOpen: false, itemId: null, itemLabel: "" });
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create item");
      }

      const itemsResponse = await fetch(`${API_BASE_URL}/api/items`);
      const itemsData = await itemsResponse.json();
      setItems(itemsData.data);

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error creating item:", err);
      setError("Failed to create item");
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      Unresolved: "bg-yellow-100 text-yellow-800",
      Available: "bg-green-100 text-green-800",
      "Checked Out": "bg-blue-100 text-blue-800",
    };
    return statusMap[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    if (!dateString)
      return <span className="text-blue-600 font-medium">New Scan</span>;

    try {
      const date = new Date(dateString);
      return date
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(",", "");
    } catch (error) {
      return dateString;
    }
  };

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
      <div className="item-management-loading">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="item-management-error">{error}</div>;
  }

  return (
    <div className="item-management">
      <div className="item-management-header">
        <div className="item-management-title">
          <Package className="w-6 h-6" />
          <h1>Item Management</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="item-management-button item-management-button-primary"
        >
          <Plus className="w-4 h-4" /> Add New Item
        </button>
      </div>

      <div className="item-management-filters">
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
          className="item-management-filter"
        >
          <option value="">All Types</option>
          {getUniqueValues("label_type").map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="item-management-filter"
        >
          <option value="">All Status</option>
          {getUniqueValues("status").map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={filters.location}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, location: e.target.value }))
          }
          className="item-management-filter"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.location_id} value={loc.location_id}>
              {loc.location_id}
            </option>
          ))}
        </select>
      </div>

      <div className="item-management-table-container">
        <table className="item-management-table">
          <thead>
            <tr>
              <th>Expand</th>
              <th onClick={() => handleSort("label_id")}>
                <div className="flex items-center gap-1">
                  Label ID
                  {renderSortIcon("label_id")}
                </div>
              </th>
              <th onClick={() => handleSort("label_type")}>
                <div className="flex items-center gap-1">
                  Type
                  {renderSortIcon("label_type")}
                </div>
              </th>
              <th onClick={() => handleSort("location_id")}>
                <div className="flex items-center gap-1">
                  Location
                  {renderSortIcon("location_id")}
                </div>
              </th>
              <th onClick={() => handleSort("status")}>
                <div className="flex items-center gap-1">
                  Status
                  {renderSortIcon("status")}
                </div>
              </th>
              <th onClick={() => handleSort("last_scan_time")}>
                <div className="flex items-center gap-1">
                  Last Scan
                  {renderSortIcon("last_scan_time")}
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <React.Fragment key={item.label_id}>
                <tr>
                  <td>
                    <button onClick={() => handleRowExpand(item.label_id)}>
                      {expandedRows.has(item.label_id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td>{item.label_id}</td>
                  <td>{item.label_type}</td>
                  <td>{item.location_id}</td>
                  <td>
                    <span
                      className={`item-management-status ${
                        item.status === "Resolved"
                          ? "item-management-status-resolved"
                          : "item-management-status-unresolved"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{formatDate(item.last_scan_time)}</td>
                  <td>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          itemId: item.label_id,
                          itemLabel: item.label_id,
                        })
                      }
                      className="item-management-button-icon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                {expandedRows.has(item.label_id) && (
                  <tr>
                    <td colSpan="7" className="item-management-expanded-row">
                      {itemDetails[item.label_id] ? (
                        <div className="item-management-details">
                          {item.label_type === "Roll" ? (
                            <>
                              <p>Name: {itemDetails[item.label_id].details?.name}</p>
                              <p>Size (mm): {itemDetails[item.label_id].details?.size_mm}</p>
                            </>
                          ) : (
                            <>
                              <p>Pallet Number: {itemDetails[item.label_id].details?.plt_number}</p>
                              <p>Quantity: {itemDetails[item.label_id].details?.quantity}</p>
                              <p>Work Order ID: {itemDetails[item.label_id].details?.work_order_id}</p>
                              <p>Total Pieces: {itemDetails[item.label_id].details?.total_pieces}</p>
                            </>
                          )}
                        </div>
                      ) : (
                        <p>Loading details...</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="item-management-modal-overlay">
          <div className="item-management-modal">
            <div className="item-management-modal-header">
              <h2>Delete Item</h2>
              <button
                onClick={() =>
                  setDeleteConfirm({
                    isOpen: false,
                    itemId: null,
                    itemLabel: "",
                  })
                }
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="item-management-modal-content">
              <p>
                Are you sure you want to delete item{" "}
                <span className="font-semibold">{deleteConfirm.itemLabel}</span>?
                This action cannot be undone.
              </p>
              <div className="item-management-modal-footer">
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      isOpen: false,
                      itemId: null,
                      itemLabel: "",
                    })
                  }
                  className="item-management-button item-management-button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.itemId)}
                  className="item-management-button item-management-button-primary"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {isModalOpen && (
        <div className="item-management-modal-overlay">
          <div className="item-management-modal">
            <div className="item-management-modal-header">
              <h2>Add New Item</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="item-management-form">
              <div className="item-management-form-grid">
                {/* Form fields remain the same, just update classes */}
                <div className="item-management-form-group">
                  <label>Label ID</label>
                  <input
                    type="text"
                    name="label_id"
                    value={formData.label_id}
                    onChange={handleInputChange}
                    required
                    className="item-management-input"
                  />
                </div>
                {/* ... other form fields ... */}
              </div>
              <div className="item-management-modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="item-management-button item-management-button-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="item-management-button item-management-button-primary"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemManagement;
