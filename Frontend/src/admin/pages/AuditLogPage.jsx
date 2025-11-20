import React, { useEffect, useState } from "react";
import axios from "axios";

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("All");
  const [filterEntity, setFilterEntity] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch logs
  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auditlogs");
      setLogs(res.data);
      setFilteredLogs(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Search + Filters
  useEffect(() => {
    let updated = [...logs];

    if (search.trim() !== "") {
      updated = updated.filter(
        (log) =>
          log.details?.toLowerCase().includes(search.toLowerCase()) ||
          log.action?.toLowerCase().includes(search.toLowerCase()) ||
          log.entityType?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterAction !== "All") {
      updated = updated.filter((log) => log.action === filterAction);
    }

    if (filterEntity !== "All") {
      updated = updated.filter((log) => log.entityType === filterEntity);
    }

    setFilteredLogs(updated);
  }, [search, filterAction, filterEntity, logs]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20 text-xl text-gray-500">
        Loading audit logs...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Audit Logs</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search logs..."
          className="px-4 py-2 border rounded-lg w-64 shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
        >
          <option value="All">All Actions</option>
          <option value="Created">Created</option>
          <option value="Updated">Updated</option>
          <option value="Deleted">Deleted</option>
        </select>

        <select
          className="px-4 py-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          value={filterEntity}
          onChange={(e) => setFilterEntity(e.target.value)}
        >
          <option value="All">All Entities</option>
          <option value="GuestHouse">GuestHouse</option>
          <option value="Room">Room</option>
          <option value="Bed">Bed</option>
          <option value="User">User</option>
          <option value="Booking">Booking</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-800 text-white text-sm uppercase">
              <th className="p-3">Performed By</th>
              <th className="p-3">Action</th>
              <th className="p-3">Entity</th>
              <th className="p-3">Details</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  No audit logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                // ----------------------------------------------
                // NEW & CLEAN PERFORMED-BY LOGIC
                // ----------------------------------------------
                const performedBy = (() => {
                  const getName = (obj) =>
                    obj?.name || obj?.email || "Not Available";

                  const format = (role, obj) =>
                    `${role} – ${getName(obj)}`;

                  // SYSTEM
                  if (log?.userId === "000000000000000000000000") {
                    return "System";
                  }

                  // Case 1: performedBy object exists
                  if (log?.performedBy && typeof log.performedBy === "object") {
                    const role =
                      log.performedBy.role?.toLowerCase() === "admin"
                        ? "Admin"
                        : "User";
                    return format(role, log.performedBy);
                  }

                  // Case 2: performedBy is a simple string
                  if (
                    typeof log?.performedBy === "string" &&
                    log.performedBy.trim() !== ""
                  ) {
                    return log.performedBy;
                  }

                  // Case 3: userId fallback
                  if (log?.userId && typeof log.userId === "object") {
                    const role =
                      log.userId.role?.toLowerCase() === "admin"
                        ? "Admin"
                        : "User";
                    return format(role, log.userId);
                  }

                  return "User – Not Available";
                })();

                return (
                  <tr
                    key={log._id}
                    className="hover:bg-gray-50 transition-all border-b"
                  >
                    <td className="p-3 font-medium">{performedBy}</td>

                    <td
                      className={`p-3 font-bold ${
                        log.action === "Created"
                          ? "text-green-600"
                          : log.action === "Updated"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {log.action}
                    </td>

                    <td className="p-3">{log.entityType}</td>
                    <td className="p-3 max-w-lg truncate">
                      {log.details || "-"}
                    </td>

                    <td className="p-3 text-gray-600">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogPage;  