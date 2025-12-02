import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  BedDouble,
} from "lucide-react";
import { PlusCircle } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BedManagement = () => {
  const [beds, setBeds] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBed, setEditingBed] = useState(null);
  const [formData, setFormData] = useState({
    roomId: "",
    bednumber: "",
    bedType: "single",
    isAvailable: true,
  });

  // Fetch beds + rooms
  useEffect(() => {
    fetchBeds();
    fetchRooms();
  }, []);

  const fetchBeds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/beds");
      setBeds(Array.isArray(res.data) ? res.data : res.data.beds || []);
    } catch (error) {
      console.error("Error fetching beds:", error);
      setBeds([]);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
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
      const payload = {
        ...formData,
        roomId:
          typeof formData.roomId === "object"
            ? formData.roomId._id
            : formData.roomId,
        bednumber: Number(formData.bednumber),
        bedType: "single", // ALWAYS single
      };

      if (editingBed) {
        await axios.put(
          `http://localhost:5000/api/beds/${editingBed._id}`,
          payload
        );
      } else {
        await axios.post("http://localhost:5000/api/beds", payload);
      }

      setShowModal(false);
      setEditingBed(null);
      fetchBeds();
    } catch (error) {
      console.error("Error saving bed:", error.response?.data || error.message);
      // alert(error.response?.data?.message || "Error saving bed. Try again.");
      toast.error(error.response?.data?.message || "Error saving bed. Try again.");
      
    }
  };

  const handleEdit = (bed) => {
    setEditingBed(bed);
    setFormData({
      ...bed,
      bedType: "single", // FORCE single for edit
      roomId: typeof bed.roomId === "object" ? bed.roomId._id : bed.roomId,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bed?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/beds/${id}`);
      fetchBeds();
    } catch (error) {
      console.error("Error deleting bed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
      Bed Management
        </h1>

        <button
          onClick={() => {
            setFormData({
              roomId: "",
              bednumber: "",
              bedType: "single",
              isAvailable: true,
            });
            setEditingBed(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
        >
         <PlusCircle size={18} />   Add Bed
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">bedId</th>
              <th className="py-3 px-4 text-left">Room</th>
              <th className="py-3 px-4 text-left">Bed No.</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-center">Available</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {beds.map((bed, index) => (
              <tr
                key={bed._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">
                  {bed.roomId?.roomNumber
                    ? `Room ${bed.roomId.roomNumber} (${bed.roomId.roomType})`
                    : "N/A"}
                </td>
                <td className="py-3 px-4">{bed.bednumber}</td>
                <td className="py-3 px-4 capitalize">single</td>{" "}
                {/* ALWAYS Single */}
                <td className="py-3 px-4 text-center">
                  {bed.isAvailable ? (
                    <CheckCircle className="text-green-500 inline" />
                  ) : (
                    <XCircle className="text-red-500 inline" />
                  )}
                </td>
                <td className="py-3 px-4 flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(bed)}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium"
                  >
                     Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bed._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-sm font-medium"
                  >
                    
                     Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {beds.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No beds found. Add one to get started!
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingBed ? "Edit Bed" : "Add New Bed"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Room Selection */}
              <select
                name="roomId"
                value={formData.roomId}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">Select Room</option>

                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    Room {room.roomNumber} ({room.roomType})
                    {room.guesthouseId?.guestHouseName
                      ? ` - ${room.guesthouseId.guestHouseName}`
                      : ""}
                  </option>
                ))}
              </select>

              {/* Bed Number */}
              <input
                type="number"
                name="bednumber"
                value={formData.bednumber}
                onChange={handleInputChange}
                placeholder="Bed Number"
                className="w-full border rounded-md p-2"
                required
              />

              {/* Single Bed (Fixed, No Dropdown) */}
              <div>
                <label className="text-gray-600 text-sm">Bed Type</label>
                <input
                  type="text"
                  value="single"
                  disabled
                  className="w-full border rounded-md p-2 bg-gray-100 text-gray-500"
                />
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                />
                <label>Available</label>
              </div>

              {/* Buttons */}
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
                  className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
                >
                  {editingBed ? "Update" : "Add Bed"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedManagement;
