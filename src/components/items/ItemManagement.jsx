import React, { useState, useEffect } from "react";
import {
  Package,
  Loader2,
  ChevronUp,
  ChevronDown,
  Plus,
  X,
  Trash2,
} from "lucide-react";

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

        console.log("Items Data:", itemsData);
        console.log("Locations Data:", locationsData);

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-4 bg-red-100 text-red-700 rounded-md">{error}</div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Item Management</h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" /> Add New Item
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
          className="border p-2 rounded"
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
          className="border p-2 rounded"
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
          className="border p-2 rounded"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc.location_id} value={loc.location_id}>
              {loc.location_id}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("label_id")}
                >
                  <div className="flex items-center gap-1">
                    Label ID
                    {renderSortIcon("label_id")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("label_type")}
                >
                  <div className="flex items-center gap-1">
                    Type
                    {renderSortIcon("label_type")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("location_id")}
                >
                  <div className="flex items-center gap-1">
                    Location
                    {renderSortIcon("location_id")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status
                    {renderSortIcon("status")}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("last_scan_time")}
                >
                  <div className="flex items-center gap-1">
                    Last Scan
                    {renderSortIcon("last_scan_time")}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedItems.map((item) => (
                <tr key={item.label_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.label_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.label_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.location_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${formatStatus(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.last_scan_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          itemId: item.label_id,
                          itemLabel: item.label_id,
                        })
                      }
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-4">Delete Item</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete item{" "}
                <span className="font-semibold">{deleteConfirm.itemLabel}</span>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      isOpen: false,
                      itemId: null,
                      itemLabel: "",
                    })
                  }
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.itemId)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Item</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label ID
                  </label>
                  <input
                    type="text"
                    name="label_id"
                    value={formData.label_id}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="label_type"
                    value={formData.label_type}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                  >
                    <option value="Roll">Roll</option>
                    <option value="FG Pallet">FG Pallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    name="location_id"
                    value={formData.location_id}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Location</option>
                    {locations.map((loc) => (
                      <option key={loc.location_id} value={loc.location_id}>
                        {loc.location_id}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.label_type === "Roll" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code
                      </label>
                      <input
                        type="text"
                        name="details.code"
                        value={formData.details.code}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="details.name"
                        value={formData.details.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size (mm)
                      </label>
                      <input
                        type="number"
                        name="details.size_mm"
                        value={formData.details.size_mm}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pallet Number
                      </label>
                      <input
                        type="text"
                        name="details.plt_number"
                        value={formData.details.plt_number}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="details.quantity"
                        value={formData.details.quantity}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Order ID
                      </label>
                      <input
                        type="text"
                        name="details.work_order_id"
                        value={formData.details.work_order_id}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Pieces
                      </label>
                      <input
                        type="number"
                        name="details.total_pieces"
                        value={formData.details.total_pieces}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
