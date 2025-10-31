import React, { useState } from "react";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    guestHouse: "",
    room: "",
    bed: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    fullName: "",
    email: "",
    phone: "",
    requests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Booking submitted successfully!");
  };

  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4">
      {/* 🔹 Centered Booking Form - 80% width */}
      <div className="bg-white shadow-2xl rounded-2xl w-[50%] border border-blue-200 p-10 flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-black mb-10 text-center tracking-wide">
          🏨 Guest House Booking Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10 w-full">
          {/* 🔸 Accommodation Details */}
          <section className="p-6 border-2 border-blue-300 rounded-xl bg-blue-50/40 w-full">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Accommodation Details
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Guest House
                </label>
                <select
                  name="guestHouse"
                  value={formData.guestHouse}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                >
                  <option value="">Select guest house</option>
                  <option value="GH1">Sunrise Guest House</option>
                  <option value="GH2">BlueMoon Guest House</option>
                  <option value="GH3">HillView Guest House</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Room
                </label>
                <select
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                >
                  <option value="">Select room</option>
                  <option value="Room1">Room 101</option>
                  <option value="Room2">Room 102</option>
                  <option value="Room3">Room 103</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Bed
                </label>
                <select
                  name="bed"
                  value={formData.bed}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                >
                  <option value="">Select bed</option>
                  <option value="BedA">Bed A</option>
                  <option value="BedB">Bed B</option>
                  <option value="BedC">Bed C</option>
                </select>
              </div>
            </div>
          </section>

          {/* 🔸 Dates & Guests */}
          <section className="p-6 border-2 border-blue-300 rounded-xl bg-blue-50/40 w-full">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Dates & Guests
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Check-In Date
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Check-Out Date
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  min="1"
                  max="5"
                />
              </div>
            </div>
          </section>

          {/* 🔸 Personal Info */}
          <section className="p-6 border-2 border-blue-300 rounded-xl bg-blue-50/40 w-full">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-black">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-black">
                  Special Requests (Optional)
                </label>
                <textarea
                  name="requests"
                  value={formData.requests}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any special requests or requirements..."
                  className="w-full p-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                ></textarea>
              </div>
            </div>
          </section>

          {/* 🔹 Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-800 transition-all duration-300"
            >
              Submit Booking Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
