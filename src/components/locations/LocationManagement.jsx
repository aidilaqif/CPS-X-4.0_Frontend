import React, { useState, useEffect } from "react";
import { MapPin, Loader2, Plus, X, Trash2 } from "lucide-react";
import { locationService } from "../../services/location.service";

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
            <MapPin className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Location Management</h1>
        </div>
        <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            <Plus className="w-4 h-4" /> Add New Location
        </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type Name
                </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {locations.map((location) => (
                <tr key={location.location_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {location.location_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {location.type_name}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>

        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Location</h2>
                <button
                onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ location_id: "", type_name: "" });
                }}
                className="text-gray-500 hover:text-gray-700"
                >
                <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location ID
                    </label>
                    <input
                    type="text"
                    name="location_id"
                    value={formData.location_id}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type Name
                    </label>
                    <input
                    type="text"
                    name="type_name"
                    value={formData.type_name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded"
                    />
                </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ location_id: "", type_name: "" });
                    }}
                    className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
