// import React, { useState } from "react";

// const BookingForm = () => {
//   const [formData, setFormData] = useState({
//     guestHouse: "",
//     room: "",
//     bed: "",
//     checkIn: "",
//     checkOut: "",
//     guests: 1,
//     fullName: "",
//     email: "",
//     phone: "",
//     requests: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Booking submitted successfully!");
//   };

//   return (
//     <div className="min-h-screen w-screen flex justify-center items-center bg-gradient-to-br from-[#F5F5F5] via-[#D5DBDB] to-[#E5E7EB] py-12 px-4">
//       {/* 🔹 Centered Booking Form - 80% width */}
//       <div className="bg-white shadow-2xl rounded-2xl w-[50%] border border-blue-200 p-10 flex flex-col justify-center">
//         <h2 className="text-3xl font-bold text-black mb-10 text-center tracking-wide">
//           🏨 Guest House Booking Form
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-10 w-full">
//           {/* 🔸 Accommodation Details */}
//           <section className="p-6 border-2 border-blue-300 rounded-xl bg-blue-50/40 w-full">
//             <h3 className="text-lg font-semibold mb-4 text-black">
//               Accommodation Details
//             </h3>
//             <div className="grid md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-black">
//                   Guest House
//                 </label>
//                 <select
//                   name="guestHouse"
//                   value={formData.guestHouse}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//                   required
//                 >
//                   <option value="">Select guest house</option>
//                   <option value="GH1">Sunrise Guest House</option>
//                   <option value="GH2">BlueMoon Guest House</option>
//                   <option value="GH3">HillView Guest House</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-black">
//                   Room
//                 </label>
//                 <select
//                   name="room"
//                   value={formData.room}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//                   required
//                 >
//                   <option value="">Select room</option>
//                   <option value="Room1">Room 101</option>
//                   <option value="Room2">Room 102</option>
//                   <option value="Room3">Room 103</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-black">
//                   Bed
//                 </label>
//                 <select
//                   name="bed"
//                   value={formData.bed}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//                   required
//                 >
//                   <option value="">Select bed</option>
//                   <option value="BedA">Bed A</option>
//                   <option value="BedB">Bed B</option>
//                   <option value="BedC">Bed C</option>
//                 </select>
//               </div>
//             </div>
//           </section>

//           {/* 🔸 Dates & Guests */}
//           <section className="p-6 border-2 border-blue-300 rounded-xl bg-blue-50/40 w-full">
//             <h3 className="text-lg font-semibold mb-4 text-black">
//               Dates & Guests
//             </h3>
//             <div className="grid md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-black">
//                   Check-In Date
//                 </label>
//                 <input
//                   type="date"
//                   name="checkIn"
//                   value={formData.checkIn}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-black">
//                   Check-Out Date
//                 </label>
//                 <input
//                   type="date"
//                   name="checkOut"
//                   value={formData.checkOut}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-black">
//                   Number of Guests
//                 </label>
//                 <input
//                   type="number"
//                   name="guests"
//                   value={formData.guests}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//                   min="1"
//                   max="5"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* 🔸 Personal Info */}
//           <section className="p-6 border-2 border-blue-300 rounded-xl bg-blue-50/40 w-full">
//             <h3 className="text-lg font-semibold mb-4 text-black">
//               Personal Information
//             </h3>
//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-black">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-black">
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//                   required
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium mb-2 text-black">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="+1 (555) 123-4567"
//                   className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//                   required
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium mb-2 text-black">
//                   Special Requests (Optional)
//                 </label>
//                 <textarea
//                   name="requests"
//                   value={formData.requests}
//                   onChange={handleChange}
//                   rows="3"
//                   placeholder="Any special requests or requirements..."
//                   className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
//                 ></textarea>
//               </div>
//             </div>
//           </section>

//           {/* 🔹 Submit Button */}
//           <div className="text-center">
//             <button
//               type="submit"
//               className="w-full py-3 bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-800 transition-all duration-300"
//             >
//               Submit Booking Request
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default BookingForm;
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

  const [formData, setFormData] = useState({
    guestHouse: "",
    room: "",
    bed: "",
    checkIn: "",
    checkOut: "",
    fullName: "",
    email: "",
    phone: "",
    requests: "",
  });

  // ✅ Fetch Guest House Info
  useEffect(() => {
    if (!guestHouseId) return;
    const fetchGuestHouse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/guesthouses/${guestHouseId}`);
        setGuestHouseName(res.data.guestHouseName);
        setFormData((prev) => ({ ...prev, guestHouse: res.data.guestHouseName }));
      } catch (error) {
        console.error("Error fetching guesthouse:", error);
      }
    };
    fetchGuestHouse();
  }, [guestHouseId]);

  // ✅ Fetch Rooms
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

  // ✅ Fetch Beds
  useEffect(() => {
    if (!formData.room) return;
    const fetchBeds = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/beds/by-room?roomId=${formData.room}`);
        setBeds(res.data);
      } catch (error) {
        console.error("Error fetching beds:", error);
      }
    };
    fetchBeds();
  }, [formData.room]);

  // ✅ Autofill user info
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.room) newErrors.room = "Please select a room.";
      if (!formData.bed) newErrors.bed = "Please select a bed.";
    } else if (step === 2) {
      if (!formData.checkIn) newErrors.checkIn = "Please select check-in date.";
      if (!formData.checkOut) newErrors.checkOut = "Please select check-out date.";
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

    if (
      !formData.guestHouse ||
      !formData.room ||
      !formData.bed ||
      !formData.checkIn ||
      !formData.checkOut ||
      !formData.fullName ||
      !formData.email ||
      !formData.phone
    ) {
      alert("⚠️ Please complete all booking steps before submitting.");
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser._id) {
        alert("⚠️ Please log in to book a guest house.");
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

      const res = await axios.post("http://localhost:5000/api/bookings", bookingData);

      if (res.status === 201) {
        navigate("/mybookings", { state: { bookingData: res.data.booking } });
      } else {
        alert("⚠️ Something went wrong while submitting your booking.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("❌ Error submitting booking. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#F5F5F5] via-[#D5DBDB] to-[#E5E7EB] p-6">
        <div className="relative bg-white w-full max-w-3xl p-10 rounded-2xl shadow-2xl border border-blue-200 overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 text-blue-700 hover:text-red-600 transition"
            title="Close"
          >
            <X size={26} strokeWidth={2.5} />
          </button>

          {/* Page Title */}
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
            Guest-House Booking Form
          </h2>

          {/* ✅ Form Section */}
          <form onSubmit={handleSubmit}>
            {/* STEP 1 */}
            {step === 1 && (
              <section className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">
                  Accommodation Details
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm mb-2 text-black">Guest House</label>
                    <input
                      type="text"
                      name="guestHouse"
                      value={formData.guestHouse}
                      readOnly
                      className="w-full p-3 border border-blue-400 rounded-lg bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-black">Room</label>
                    <select
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      className="w-full p-3 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select room</option>
                      {rooms.map((room) => (
                        <option key={room._id} value={room._id}>
                          Room No:- {room.roomNumber || room.roomId}
                        </option>
                      ))}
                    </select>
                    {errors.room && <p className="text-red-500 text-sm mt-1">{errors.room}</p>}
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-black">Bed</label>
                    <select
                      name="bed"
                      value={formData.bed}
                      onChange={handleChange}
                      className="w-full p-3 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select bed</option>
                      {beds.map((bed) => (
                        <option key={bed._id} value={bed._id}>
                          Bed No:- {bed.bednumber || bed.bedId}
                        </option>
                      ))}
                    </select>
                    {errors.bed && <p className="text-red-500 text-sm mt-1">{errors.bed}</p>}
                  </div>
                </div>
              </section>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <section className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">Dates</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2 text-black">Check-In</label>
                    <input
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      className="w-full p-3 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-black">Check-Out</label>
                    <input
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      className="w-full p-3 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.checkOut && (
                      <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>
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
                    <label className="block text-sm mb-2 text-black">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      readOnly
                      className="w-full p-3 border border-blue-400 rounded-lg bg-gray-100"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-black">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full p-3 border border-blue-400 rounded-lg bg-gray-100"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-black">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      readOnly
                      className="w-full p-3 border border-blue-400 rounded-lg bg-gray-100"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-black">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="requests"
                    value={formData.requests}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Any special requests..."
                    className="w-full p-3 border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  ></textarea>
                </div>
              </section>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-10">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-all"
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
                  className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-all"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-all"
                  onClick={() => {
                    alert(`🎉 Booking for ${formData.guestHouse} submitted successfully!`);
                    navigate("/mybookings", { state: { bookingData: formData } });
                  }}
                >
                  Submit Booking
                </button>
              )}
            </div>

            {/* ✅ Progress Bar Moved to Bottom */}
            <div className="mt-12">
              <div className="flex justify-center items-center mb-3 relative">
                <div className="absolute w-2/3 h-[2px] bg-blue-200 top-1/2 -translate-y-1/2"></div>
                {["1", "2", "3"].map((num, index) => (
                  <div
                    key={index}
                    className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full text-lg font-semibold border-2 transition-all duration-300 ${
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
                <span className={`${step >= 1 ? "text-blue-700 font-semibold" : "text-gray-500"}`}>
                  Accommodation
                </span>
                <span className={`${step >= 2 ? "text-blue-700 font-semibold" : "text-gray-500"}`}>
                  Dates
                </span>
                <span className={`${step >= 3 ? "text-blue-700 font-semibold" : "text-gray-500"}`}>
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
