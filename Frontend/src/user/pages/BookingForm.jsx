import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../user/components/Navbar";
import Footer from "../components/Footer";
import { X } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";

const BookingForm = () => {
  const { state } = useLocation();
  const guestHouseId = state?.guestHouseId;
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [guestHouse, setGuestHouse] = useState(null);
  const [errors, setErrors] = useState({});
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingBeds, setLoadingBeds] = useState(false);

  const [popup, setPopup] = useState({
    visible: false,
    type: "loading",
    message: "",
  });

  const [formData, setFormData] = useState({
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

  // Fetch guesthouse details
  useEffect(() => {
    if (!guestHouseId) return;
    const fetchGuestHouse = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/guesthouses/${guestHouseId}`
        );
        setGuestHouse(res.data);
      } catch (error) {
        console.error("Error fetching guesthouse:", error);
      }
    };
    fetchGuestHouse();
  }, [guestHouseId]);

  // Fetch rooms when dates are selected
  useEffect(() => {
    if (!guestHouseId || !formData.checkIn || !formData.checkOut) {
      setRooms([]);
      return;
    }

    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const res = await axios.get(
          `http://localhost:5000/api/rooms/by-guesthouse?guesthouseId=${guestHouseId}&checkIn=${formData.checkIn}&checkOut=${formData.checkOut}`
        );
        setRooms(res.data || []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, [guestHouseId, formData.checkIn, formData.checkOut]);

  // Fetch beds when room is selected and dates are available
  useEffect(() => {
    if (!formData.room || !formData.checkIn || !formData.checkOut) {
      setBeds([]);
      setFormData((prev) => ({ ...prev, bed: "" }));
      return;
    }

    const fetchBeds = async () => {
      try {
        setLoadingBeds(true);
        const res = await axios.get(
          `http://localhost:5000/api/beds/by-room?roomId=${formData.room}&checkIn=${formData.checkIn}&checkOut=${formData.checkOut}`
        );
        setBeds(res.data || []);
      } catch (error) {
        console.error("Error fetching beds:", error);
        setBeds([]);
      } finally {
        setLoadingBeds(false);
      }
    };
    fetchBeds();
  }, [formData.room, formData.checkIn, formData.checkOut]);

  // Auto fill user info
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

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      // When check-in date changes, update min checkout date and reset room/bed
      if (name === "checkIn") {
        const nextDay = new Date(value);
        nextDay.setDate(nextDay.getDate() + 1);
        const minCheckout = nextDay.toISOString().split("T")[0];

        updated.minCheckOut = minCheckout;
        updated.room = "";
        updated.bed = "";

        if (updated.checkOut && updated.checkOut < minCheckout) {
          updated.checkOut = "";
        }
      }

      // When checkout date changes, reset room/bed if dates are invalid
      if (name === "checkOut") {
        if (updated.checkIn && value <= updated.checkIn) {
          updated.checkOut = "";
        } else {
          updated.room = "";
          updated.bed = "";
        }
      }

      // When room changes, reset bed
      if (name === "room") {
        updated.bed = "";
      }

      return updated;
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate current step
  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      // Step 1: Dates, Room, and Bed
      if (!formData.checkIn) {
        newErrors.checkIn = "Please select check-in date.";
      }
      if (!formData.checkOut) {
        newErrors.checkOut = "Please select check-out date.";
      }
      if (formData.checkIn && formData.checkOut && formData.checkOut <= formData.checkIn) {
        newErrors.checkOut = "Check-out date must be after check-in date.";
      }
      if (!formData.room) {
        newErrors.room = "Please select a room.";
      }
      if (!formData.bed) {
        newErrors.bed = "Please select a bed.";
      }
    } else if (step === 2) {
      // Step 2: Personal details (already auto-filled, but validate)
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required.";
      }
      if (!formData.email) {
        newErrors.email = "Email is required.";
      }
      if (!formData.phone) {
        newErrors.phone = "Phone number is required.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (e) => {
    e?.preventDefault(); // Prevent form submission
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const prevStep = (e) => {
    e?.preventDefault(); // Prevent form submission
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const closePopup = () => {
    setPopup({
      visible: false,
      type: "loading",
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Make sure we're on step 2 before submitting
    if (step !== 2) {
      // If not on step 2, go to step 2 instead
      if (validateStep()) {
        setStep(2);
      }
      return;
    }
    
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
        localStorage.setItem("newBookingCreated", Date.now());
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
      const errorMessage =
        error.response?.data?.message ||
        "Error submitting booking. Please try again.";
      setPopup({
        visible: true,
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <>
      <Navbar />

      {/* POPUP */}
      {popup.visible && (
        <div 
          className="fixed inset-0 bg-black/40 flex justify-center items-start pt-10 z-50"
          onClick={(e) => {
            // Close popup when clicking outside (but not on loading)
            if (e.target === e.currentTarget && popup.type !== "loading") {
              closePopup();
            }
          }}
        >
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center animate-fadeInDown relative">
            {/* Close button - show for error and success, hide for loading */}
            {(popup.type === "error" || popup.type === "success") && (
              <button
                onClick={closePopup}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            )}

            {popup.type === "loading" && (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-medium text-blue-700">
                  {popup.message}
                </p>
              </div>
            )}

            {popup.type === "success" && (
              <div>
                <p className="text-green-600 font-semibold text-lg pr-6">
                  {popup.message}
                </p>
              </div>
            )}

            {popup.type === "error" && (
              <div>
                <p className="text-red-600 font-semibold text-lg pr-6">
                  {popup.message}
                </p>
                <button
                  onClick={closePopup}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAGE */}
      <div className="min-h-screen flex justify-center items-start bg-gradient-to-br from-[#F5F5F5] via-[#D5DBDB] to-[#E5E7EB] p-4 md:p-6">
        <div className="relative bg-white w-full max-w-4xl p-6 rounded-2xl shadow-xl border border-blue-200 flex flex-col mt-20">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 text-blue-700 hover:text-red-600 transition"
          >
            <X size={26} />
          </button>

          <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
            Guest-House Booking Form
          </h2>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              // Only submit if we're on step 2
              if (step === 2) {
                handleSubmit(e);
              } else {
                // If on step 1, just go to next step
                nextStep(e);
              }
            }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* ========== STEP 1: Booking Details ========== */}
            {step === 1 && (
              <section className="space-y-4 animate-fadeIn">
                {/* Guest House Name & Location Display */}
                {guestHouse && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-800 mb-1">
                      {guestHouse.guestHouseName}
                    </h3>
                    {guestHouse.location && (
                      <div className="flex items-center text-gray-700">
                        <FaMapMarkerAlt className="mr-2 text-red-500" />
                        <span className="text-base">
                          {guestHouse.location.city && guestHouse.location.state
                            ? `${guestHouse.location.city}, ${guestHouse.location.state}`
                            : guestHouse.location.city || guestHouse.location.state || "Location not specified"}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <h3 className="text-lg font-semibold text-blue-700 text-center">
                  Booking Details
                </h3>

                <div className="grid md:grid-cols-2 gap-3">
                  {/* Check-In */}
                  <div>
                    <label className="block mb-1 text-black text-xs font-semibold">
                      Check-In <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-3 border border-blue-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.checkIn && (
                      <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>
                    )}
                  </div>

                  {/* Check-Out */}
                  <div>
                    <label className="block mb-1 text-black text-xs font-semibold">
                      Check-Out <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      min={formData.minCheckOut || formData.checkIn}
                      onChange={handleChange}
                      className="w-full p-3 border border-blue-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.checkOut && (
                      <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>
                    )}
                  </div>

                  {/* Room */}
                  <div>
                    <label className="block mb-1 text-black text-xs font-semibold">
                      Room <span className="text-red-500">*</span>
                    </label>
                    {!formData.checkIn || !formData.checkOut ? (
                      <div className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 text-sm">
                        Select dates first
                      </div>
                    ) : loadingRooms ? (
                      <div className="w-full p-3 border border-blue-200 rounded-lg text-center text-sm">
                        <div className="inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-blue-700">Loading rooms...</span>
                      </div>
                    ) : (
                      <select
                        name="room"
                        value={formData.room}
                        onChange={handleChange}
                        className="w-full p-3 border border-blue-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a room</option>
                        {rooms.length === 0 ? (
                          <option value="" disabled>
                            No rooms available for selected dates
                          </option>
                        ) : (
                          rooms.map((room) => (
                            <option key={room._id} value={room._id}>
                              Room {room.roomNumber} • {room.roomType} • {room.roomCapacity} guests
                              {!room.isAvailable && " (Unavailable)"}
                            </option>
                          ))
                        )}
                      </select>
                    )}
                    {errors.room && (
                      <p className="text-red-500 text-xs mt-1">{errors.room}</p>
                    )}
                  </div>

                  {/* Bed */}
                  <div>
                    <label className="block mb-1 text-black text-xs font-semibold">
                      Bed <span className="text-red-500">*</span>
                    </label>
                    {!formData.room ? (
                      <div className="w-full p-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 text-sm">
                        Select a room first
                      </div>
                    ) : loadingBeds ? (
                      <div className="w-full p-3 border border-blue-200 rounded-lg text-center text-sm">
                        <div className="inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2 text-blue-700">Loading beds...</span>
                      </div>
                    ) : (
                      <select
                        name="bed"
                        value={formData.bed}
                        onChange={handleChange}
                        className="w-full p-3 border border-blue-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a bed</option>
                        {beds.length === 0 ? (
                          <option value="" disabled>
                            No beds available for selected dates
                          </option>
                        ) : (
                          beds.map((bed) => (
                            <option key={bed._id} value={bed._id}>
                              Bed {bed.bednumber} • {bed.bedType}
                              {!bed.isAvailable && " (Unavailable)"}
                            </option>
                          ))
                        )}
                      </select>
                    )}
                    {errors.bed && (
                      <p className="text-red-500 text-xs mt-1">{errors.bed}</p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ========== STEP 2: Personal Details ========== */}
            {step === 2 && (
              <section className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-semibold text-blue-700 text-center">
                  Personal Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-black text-xs font-semibold">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      readOnly
                      className="w-full p-3 border border-blue-300 rounded-lg bg-gray-100 text-sm"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 text-black text-xs font-semibold">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full p-3 border border-blue-300 rounded-lg bg-gray-100 text-sm"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 text-black text-xs font-semibold">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      readOnly
                      className="w-full p-3 border border-blue-300 rounded-lg bg-gray-100 text-sm"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-black text-xs font-semibold">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="requests"
                    value={formData.requests}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Any special requests or notes..."
                    className="w-full p-3 border border-blue-300 rounded-lg resize-none text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </section>
            )}

            {/* BUTTONS */}
            <div className="flex justify-between items-center mt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  ← Previous
                </button>
              ) : (
                <div></div>
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                >
                  Submit Booking
                </button>
              )}
            </div>

            {/* STEP PROGRESS */}
            <div className="mt-6">
              <div className="flex justify-center items-center mb-3 relative">
                <div className="absolute w-1/2 h-[2px] bg-blue-200 top-1/2 -translate-y-1/2"></div>
                {["1", "2"].map((num, index) => (
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

              <div className="flex justify-center text-sm text-gray-600 font-medium space-x-20">
                <span
                  className={step >= 1 ? "text-blue-700 font-semibold" : ""}
                >
                  Booking Details
                </span>
                <span
                  className={step >= 2 ? "text-blue-700 font-semibold" : ""}
                >
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
