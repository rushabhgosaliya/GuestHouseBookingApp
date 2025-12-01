import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusCircle } from "lucide-react";

const RoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [guesthouses, setGuesthouses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    guesthouseId: "",
    roomNumber: "",
    roomType: "single",
    roomCapacity: "",
    isAvailable: true,
  });

  useEffect(() => {
    fetchRooms();
    fetchGuesthouses();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      setRooms(Array.isArray(res.data) ? res.data : res.data.rooms || []);
    } catch (error) {
      toast.error("Failed to load rooms");
      setRooms([]);
    }
  };

  const fetchGuesthouses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/guesthouses");
      setGuesthouses(
        Array.isArray(res.data) ? res.data : res.data.guesthouses || []
      );
    } catch (error) {
      toast.error("Failed to load guesthouses");
      setGuesthouses([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        guesthouseId:
          typeof formData.guesthouseId === "object"
            ? formData.guesthouseId._id
            : formData.guesthouseId,
        roomNumber: Number(formData.roomNumber),
        roomCapacity: Number(formData.roomCapacity),
      };

      if (editingRoom) {
        await axios.put(
          `http://localhost:5000/api/rooms/${editingRoom._id}`,
          payload
        );
        toast.success("Room updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/rooms", payload);
        toast.success("Room added successfully!");
      }

      setShowModal(false);
      setEditingRoom(null);
      fetchRooms();
    } catch (error) {
      toast.error("Failed to save room");
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      ...room,
      guesthouseId:
        typeof room.guesthouseId === "object"
          ? room.guesthouseId._id
          : room.guesthouseId,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`);
      toast.success("Room deleted successfully!");
      fetchRooms();
    } catch (error) {
      toast.error("Failed to delete room");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <ToastContainer position="top-right" autoClose={1500} />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Room Management
        </h1>

        <button
          onClick={() => {
            setFormData({
              guesthouseId: "",
              roomNumber: "",
              roomType: "single",
              roomCapacity: "",
              isAvailable: true,
            });
            setEditingRoom(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md"
        >
          <PlusCircle size={18} /> Add Room
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Room ID</th>
              <th className="py-3 px-4 text-left">Guesthouse</th>
              <th className="py-3 px-4 text-left">Room No.</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Capacity</th>
              <th className="py-3 px-4 text-center">Available</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{room.roomId}</td>
                <td className="py-3 px-4">
                  {room.guesthouseId?.guestHouseName || "N/A"}
                </td>
                <td className="py-3 px-4">{room.roomNumber}</td>
                <td className="py-3 px-4 capitalize">{room.roomType}</td>
                <td className="py-3 px-4">{room.roomCapacity}</td>

                <td className="py-3 px-4 text-center">
                  {room.isAvailable ? (
                    <CheckCircle className="text-green-500 inline" />
                  ) : (
                    <XCircle className="text-red-500 inline" />
                  )}
                </td>

                {/* Updated Action Buttons */}
                <td className="py-3 px-4 flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(room)}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rooms.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No rooms found. Add one to get started!
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingRoom ? "Edit Room" : "Add New Room"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dropdown Guesthouse */}
              <select
                name="guesthouseId"
                value={formData.guesthouseId}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">Select Guesthouse</option>
                {guesthouses.map((gh) => (
                  <option key={gh._id} value={gh._id}>
                    {gh.guestHouseName}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
                placeholder="Room Number"
                className="w-full border rounded-md p-2"
                required
              />

              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="family">Family</option>
              </select>

              <input
                type="number"
                name="roomCapacity"
                value={formData.roomCapacity}
                onChange={handleInputChange}
                placeholder="Capacity"
                className="w-full border rounded-md p-2"
                required
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                />
                <label>Available</label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
                >
                  {editingRoom ? "Update" : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsManagement;
