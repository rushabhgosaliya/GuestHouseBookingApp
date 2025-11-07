import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";


const RoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    guesthouseId: "",
    roomNumber: "",
    roomType: "single",
    roomCapacity: "",
    image_url: "",
    isAvailable: true,
  });

  // Fetch rooms from backend
  useEffect(() => {
    fetchRooms();
  }, []);

 const fetchRooms = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/rooms");
    console.log("Rooms API response:", res.data);
    setRooms(Array.isArray(res.data) ? res.data : res.data.rooms || []);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    setRooms([]);
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
    if (editingRoom) {
      await axios.put(`http://localhost:5000/api/rooms/${editingRoom._id}`, formData);
    } else {
      await axios.post("http://localhost:5000/api/rooms", formData);
    }
    setShowModal(false);
    setEditingRoom(null);
    fetchRooms();
  } catch (error) {
    console.error("Error saving room:", error);
  }
};

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData(room);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this room?")) return;
  try {
    await axios.delete(`http://localhost:5000/api/rooms/${id}`);
    fetchRooms();
  } catch (error) {
    console.error("Error deleting room:", error);
  }
};


  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          🏨 Room Management
        </h1>
        <button
          onClick={() => {
            setFormData({
              guesthouseId: "",
              roomNumber: "",
              roomType: "single",
              roomCapacity: "",
              image_url: "",
              isAvailable: true,
            });
            setEditingRoom(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
        >
          <Plus size={18} /> Add Room
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Room ID</th>
              <th className="py-3 px-4 text-left">Guesthouse ID</th>
              <th className="py-3 px-4 text-left">Room No.</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Capacity</th>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-center">Available</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
         <tbody>
  {rooms.map((room) => (
    <tr
      key={room._id}
      className="border-b hover:bg-gray-50 transition"
    >
      <td className="py-3 px-4">{room.roomId}</td>
      <td className="py-3 px-4">
        {room.guesthouseId?.guestHouseName || room.guesthouseId || "N/A"}
      </td>
      <td className="py-3 px-4">{room.roomNumber}</td>
      <td className="py-3 px-4 capitalize">{room.roomType}</td>
      <td className="py-3 px-4">{room.roomCapacity}</td>
      <td className="py-3 px-4">
        <img
          src={room.image_url}
          alt="room"
          className="w-14 h-14 object-cover rounded-md"
        />
      </td>
      <td className="py-3 px-4 text-center">
        {room.isAvailable ? (
          <CheckCircle className="text-green-500 inline" />
        ) : (
          <XCircle className="text-red-500 inline" />
        )}
      </td>
      <td className="py-3 px-4 flex justify-center gap-3">
        <button
          onClick={() => handleEdit(room)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm"
        >
          <Edit size={14} /> Edit
        </button>
        <button
          onClick={() => handleDelete(room._id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm"
        >
          <Trash2 size={14} /> Delete
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingRoom ? "Edit Room" : "Add New Room"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="guesthouseId"
                value={formData.guesthouseId}
                onChange={handleInputChange}
                placeholder="Guesthouse ID"
                className="w-full border rounded-md p-2"
                required
              />
              <input
                type="number"
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
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="Image URL"
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
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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



