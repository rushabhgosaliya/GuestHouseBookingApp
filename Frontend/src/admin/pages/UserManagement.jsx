import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    role: "user",
    address: "",
    password: "",
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/users");
      let fetchedUsers = [];

      if (Array.isArray(data)) fetchedUsers = data;
      else if (Array.isArray(data.users)) fetchedUsers = data.users;
      else if (Array.isArray(data.data)) fetchedUsers = data.data;

      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNo: user.phoneNo,
        role: user.role,
        address:
          typeof user.address === "string"
            ? user.address
            : user.address?.line1 || "",
        password: "",
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        role: "user",
        address: "",
        password: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const userData = {
        ...formData,
        address: { line1: formData.address },
      };

      if (editingUser) {
        await axios.put(
          `http://localhost:5000/api/users/${editingUser._id}`,
          userData
        );

        toast.success("User updated successfully! 🎉", {
          position: "top-right",
          autoClose: 1200,
        });
      } else {
        await axios.post("http://localhost:5000/api/users", userData);

        toast.success("User added successfully! 🎉", {
          position: "top-right",
          autoClose: 1200,
        });
      }

      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Something went wrong!", { position: "top-right" });
    }
  };

  // ⭐ Soft Delete (Deactivate User)
  const handleDelete = async (id) => {
    if (window.confirm("Do you want to deactivate this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers();

        toast.success("User deactivated successfully! 🚫", {
          position: "top-right",
          autoClose: 1200,
        });
      } catch (error) {
        console.error("Error deactivating user:", error);
        toast.error("Action failed!", { position: "top-right" });
      }
    }
  };

  // ⭐ Activate User
  const handleActivate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/users/activate/${id}`);

      toast.success("User activated successfully! ✅", {
        position: "top-right",
        autoClose: 1200,
      });

      fetchUsers();
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("Action failed!", { position: "top-right" });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ToastContainer />

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-800 text-white px-7 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg text-base transition-all"
        >
          <PlusCircle size={22} />
          Add User
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-800 border-b border-gray-200">
              <th className="py-3 px-4 font-bold text-sm">#</th>
              <th className="py-3 px-4 font-bold text-sm">Full Name</th>
              <th className="py-3 px-4 font-bold text-sm">Email</th>
              <th className="py-3 px-4 font-bold text-sm">Phone</th>
              <th className="py-3 px-4 font-bold text-sm">Role</th>
              <th className="py-3 px-4 font-bold text-sm">Address</th>
              <th className="py-3 px-4 font-bold text-sm">Status</th>
              <th className="py-3 px-4 font-bold text-sm text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">{index + 1}</td>

                  <td className="py-3 px-4">
                    {user.firstName} {user.lastName}
                  </td>

                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phoneNo}</td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4">{user.address?.line1 || "-"}</td>

                  {/* STATUS */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        user.isActive ? "bg-green-600" : "bg-gray-500"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3 px-4 text-center flex justify-center gap-4">
                    <button
                      onClick={() => openModal(user)}
                      className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold shadow hover:bg-green-700 transition-all"
                    >
                      Edit
                    </button>

                    {user.isActive ? (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold shadow hover:bg-red-700 transition-all"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(user._id)}
                        className="px-5 py-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold shadow hover:bg-yellow-600 transition-all"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>

          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {editingUser ? "Edit User" : "Add New User"}
              </h3>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />

                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />

                <input
                  type="text"
                  name="phoneNo"
                  placeholder="Phone Number"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />

                {!editingUser && (
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                )}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-blue-800 text-white rounded-md shadow hover:bg-blue-700"
                >
                  {editingUser ? "Update User" : "Add User"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;
