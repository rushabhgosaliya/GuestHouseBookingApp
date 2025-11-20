import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../user/components/Navbar";
import { Footer } from "../components/Footer";
import { X } from "lucide-react";

const BookingForm = () => {
  const { state } = useLocation();
  const guestHouseId = state?.guestHouseId;
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [guestHouseName, setGuestHouseName] = useState("");
  const [errors, setErrors] = useState({});

  const [popup, setPopup] = useState({
    visible: false,
    type: "loading",
    message: "",
  });

  const [formData, setFormData] = useState({
    guestHouse: "",
    room: "",
    bed: "",
    checkIn: "",
    checkOut: "",
    minCheckOut: "",
    fullName: "",
    email: "",
    phone: "",
    requests: "",
  });

  // Fetch guesthouse
  useEffect(() => {
    if (!guestHouseId) return;
    const fetchGuestHouse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/guesthouses/${guestHouseId}`
        );
        setGuestHouseName(res.data.guestHouseName);
        setFormData((prev) => ({
          ...prev,
          guestHouse: res.data.guestHouseName,
        }));
      } catch (error) {
        console.error("Error fetching guesthouse:", error);
      }
    };
    fetchGuestHouse();
  }, [guestHouseId]);

  // Fetch rooms
  useEffect(() => {
    if (!guestHouseId) return;
    const fetchRooms = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/rooms/by-guesthouse?guesthouseId=${guestHouseId}`
        );
        setRooms(res.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, [guestHouseId]);

  // Fetch beds
  useEffect(() => {
    if (!formData.room) return;
    const fetchBeds = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/beds/by-room?roomId=${formData.room}`
        );
        setBeds(res.data);
      } catch (error) {
        console.error("Error fetching beds:", error);
      }
    };
    fetchBeds();
  }, [formData.room]);

  // Auto user info
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData((prev) => ({
        ...prev,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email || "",
        phone: user.phoneNo || "",
      }));
    }
  }, []);

  // ⭐ UPDATED — RESTRICT CHECKOUT DATE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "checkIn") {
        const nextDay = new Date(value);
        nextDay.setDate(nextDay.getDate() + 1);
        const minCheckout = nextDay.toISOString().split("T")[0];

        updated.minCheckOut = minCheckout;

        if (updated.checkOut && updated.checkOut < minCheckout) {
          updated.checkOut = "";
        }
      }

      return updated;
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.room) newErrors.room = "Please select a room.";
      if (!formData.bed) newErrors.bed = "Please select a bed.";
    } else if (step === 2) {
      if (!formData.checkIn) newErrors.checkIn = "Please select check-in date.";
      if (!formData.checkOut)
        newErrors.checkOut = "Please select check-out date.";
    } else if (step === 3) {
      if (!formData.fullName) newErrors.fullName = "Full name is required.";
      if (!formData.email) newErrors.email = "Email is required.";
      if (!formData.phone) newErrors.phone = "Phone number is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setPopup({
      visible: true,
      type: "loading",
      message: "Submitting your booking...",
    });

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser._id) {
        setPopup({
          visible: true,
          type: "error",
          message: "Please log in to book a guest house.",
        });
        return;
      }

      const bookingData = {
        userId: storedUser._id,
        guesthouseId: guestHouseId,
        roomId: formData.room,
        bedId: formData.bed,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        status: "Pending",
      };

      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        bookingData
      );

      if (res.status === 201) {

        // ⭐ NEW: Signal to the admin page that a new booking has been created ⭐
        // Setting an item in localStorage fires the 'storage' event in other tabs.
        localStorage.setItem("newBookingCreated", Date.now()); 
        
        // You're already doing this for MyBookings, but this is a separate,
        // dedicated key for the admin panel update.
        localStorage.setItem("bookingUpdated", Date.now());

        setPopup({
          visible: true,
          type: "success",
          message: "Booking submitted successfully!",
        });

        setTimeout(() => navigate("/mybookings"), 1500);
      } else {
        setPopup({
          visible: true,
          type: "error",
          message: "Something went wrong while submitting your booking.",
        });
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setPopup({
        visible: true,
        type: "error",
        message: "Error submitting booking. Please try again.",
      });
    }
  };

  return (
    <>
      <Navbar />

      {/* ⭐ POPUP TOP-CENTER ⭐ */}
      {popup.visible && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start pt-10 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center animate-fadeInDown">
            {popup.type === "loading" && (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-medium text-blue-700">{popup.message}</p>
              </div>
            )}

            {popup.type === "success" && (
              <p className="text-green-600 font-semibold text-lg">{popup.message}</p>
            )}

            {popup.type === "error" && (
              <p className="text-red-600 font-semibold text-lg">{popup.message}</p>
            )}
          </div>
        </div>
      )}

      {/* ===========================
          FORM UI (UNCHANGED)
      ============================ */}
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#F5F5F5] via-[#D5DBDB] to-[#E5E7EB] p-6">
        <div className="relative bg-white w-full max-w-3xl p-10 rounded-2xl shadow-2xl border border-blue-200 overflow-hidden mt-18">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 text-blue-700 hover:text-red-600 transition"
          >
            <X size={26} />
          </button>

          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
            Guest-House Booking Form
          </h2>

          <form onSubmit={handleSubmit}>
            {/* STEP 1 */}
            {step === 1 && (
              <section className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">
                  Accommodation Details
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block mb-2 text-black text-sm">
                      Guest House
                    </label>
                    <input
                      type="text"
                      name="guestHouse"
                      value={formData.guestHouse}
                      readOnly
                      className="w-full p-3 border border-blue-400 rounded-lg bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-black text-sm">Room</label>
                    <select
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      className="w-full p-3 border border-blue-400 rounded-lg"
                    >
                      <option value="">Select room</option>
                      {rooms.map((room) => (
                        <option key={room._id} value={room._id}>
                          Room No:- {room.roomNumber || room.roomId}
                        </option>
                      ))}
                    </select>
                    {errors.room && (
                      <p className="text-red-500 text-sm">{errors.room}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-black text-sm">Bed</label>
                    <select
                      name="bed"
                      value={formData.bed}
                      onChange={handleChange}
                      className="w-full p-3 border border-blue-400 rounded-lg"
                    >
                      <option value="">Select bed</option>
                      {beds.map((bed) => (
                        <option key={bed._id} value={bed._id}>
                          Bed No:- {bed.bednumber || bed.bedId}
                        </option>
                      ))}
                    </select>
                    {errors.bed && (
                      <p className="text-red-500 text-sm">{errors.bed}</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <section className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">
                  Dates
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-black text-sm">
                      Check-In
                    </label>
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      className="w-full p-3 border border-blue-400 rounded-lg"
                    />
                    {errors.checkIn && (
                      <p className="text-red-500 text-sm">{errors.checkIn}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-black text-sm">
                      Check-Out
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      min={formData.minCheckOut} 
                      onChange={handleChange}
                      className="w-full p-3 border border-blue-400 rounded-lg"
                    />
                    {errors.checkOut && (
                      <p className="text-red-500 text-sm">{errors.checkOut}</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <section className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">
                  Personal Information
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block mb-2 text-black text-sm">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      readOnly
                      className="w-full p-3 border border-blue-400 rounded-lg bg-gray-100"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-black text-sm">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full p-3 border border-blue-400 rounded-lg bg-gray-100"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-black text-sm">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      readOnly
                      className="w-full p-3 border border-blue-400 rounded-lg bg-gray-100"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-black text-sm">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="requests"
                    value={formData.requests}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Any special requests..."
                    className="w-full p-3 border border-blue-400 rounded-lg resize-none"
                  ></textarea>
                </div>
              </section>
            )}

            {/* BUTTONS */}
            <div className="flex justify-between items-center mt-10">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  ← Previous
                </button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                >
                  Submit Booking
                </button>
              )}
            </div>

            {/* PROGRESS BAR */}
            <div className="mt-12">
              <div className="flex justify-center items-center mb-3 relative">
                <div className="absolute w-2/3 h-[2px] bg-blue-200 top-1/2 -translate-y-1/2"></div>
                {["1", "2", "3"].map((num, index) => (
                  <div
                    key={index}
                    className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full text-lg font-semibold border-2 ${
                      step === index + 1
                        ? "bg-blue-700 text-white border-blue-700 shadow-lg scale-110"
                        : step > index + 1
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-blue-500 border-blue-300"
                    } mx-6`}
                  >
                    {num}
                  </div>
                ))}
              </div>

              <div className="flex justify-center text-sm text-gray-600 font-medium space-x-16">
                <span className={step >= 1 ? "text-blue-700 font-semibold" : ""}>
                  Accommodation
                </span>
                <span className={step >= 2 ? "text-blue-700 font-semibold" : ""}>
                  Dates
                </span>
                <span className={step >= 3 ? "text-blue-700 font-semibold" : ""}>
                  Personal Info
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BookingForm;

