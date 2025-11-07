import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:5000/api/guesthouses";

const GuestHouses = () => {
  const [guestHouses, setGuestHouses] = useState([]);
  const [formData, setFormData] = useState({
    guestHouseName: "",
    city: "",
    state: "",
    description: "",
    image_url: "",
    underMaintenance: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all guest houses
  const fetchGuestHouses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setGuestHouses(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load guest houses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestHouses();
  }, []);

  // Input handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add/Edit Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      guestHouseName: formData.guestHouseName,
      location: { city: formData.city, state: formData.state },
      description: formData.description,
      image_url: formData.image_url,
      underMaintenance: formData.underMaintenance,
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        toast.success("Guest house updated successfully!");
      } else {
        await axios.post(API_URL, payload);
        toast.success("Guest house added successfully!");
      }

      setFormData({
        guestHouseName: "",
        city: "",
        state: "",
        description: "",
        image_url: "",
        underMaintenance: false,
      });
      setEditingId(null);
      setIsModalOpen(false);
      fetchGuestHouses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save guest house");
    }
  };

  // Delete guest house
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this guest house?"))
      return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Guest house deleted successfully!");
      fetchGuestHouses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete guest house");
    }
  };

  // Edit handler
  const handleEdit = (gh) => {
    setFormData({
      guestHouseName: gh.guestHouseName,
      city: gh.location?.city || "",
      state: gh.location?.state || "",
      description: gh.description || "",
      image_url: gh.image_url || "",
      underMaintenance: gh.underMaintenance,
    });
    setEditingId(gh._id);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      guestHouseName: "",
      city: "",
      state: "",
      description: "",
      image_url: "",
      underMaintenance: false,
    });
  };

  return (
    <div className=" p-8 min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 transition-all duration-300">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
           Guest House Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
        >
           Add Guest House
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
              {editingId ? "✏️ Edit Guest House" : "Add New Guest House"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Guest House Name
                </label>
                <input
                  type="text"
                  name="guestHouseName"
                  value={formData.guestHouseName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="underMaintenance"
                  checked={formData.underMaintenance}
                  onChange={handleChange}
                  className="h-4 w-4 accent-blue-600"
                />
                <label className="text-gray-600 text-sm">
                  Under Maintenance
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Guest House List
        </h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : guestHouses.length === 0 ? (
          <p className="text-gray-500 text-center">No guest houses found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {guestHouses.map((gh) => (
              <div
                key={gh._id}
                className="group border border-gray-200 rounded-xl p-4 shadow-sm bg-gradient-to-br from-white to-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="overflow-hidden rounded-lg mb-3">
                  <img
                    src={gh.image_url}
                    alt={gh.guestHouseName}
                    className="h-44 w-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {gh.guestHouseName}
                </h3>
                <p className="text-sm text-gray-500">
                  {gh.location?.city}, {gh.location?.state}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {gh.description}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      gh.underMaintenance
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {gh.underMaintenance ? "Maintenance" : "Active"}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(gh)}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(gh._id)}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestHouses;
