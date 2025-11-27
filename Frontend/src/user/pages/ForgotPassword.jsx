// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Footer from "../components/Footer";
// import LandingNavbar from "../components/LandingNavbar ";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [msg, setMsg] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
//       setMsg("Password reset link sent to your email!");
//     } catch (err) {
//       setMsg("Error sending reset link. Please try again!");
//     }
//   };

//   return (
//     <>
//     <LandingNavbar/>
//     <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#F5F5F5] via-[#D5DBDB] to-[#E5E7EB] p-4">

//       <div className="bg-white w-[60%] max-w-md p-10 rounded-3xl shadow-xl flex flex-col items-center border border-[#D1D5DB]">

//         <h2 className="text-3xl sm:text-4xl font-bold text-[#4C5C68] mb-2 text-center">
//           Forgot Password
//         </h2>

//         <p className="text-center text-[#6B7280] mb-6 text-base">
//           Enter your email to reset your password
//         </p>

//         {msg && <p className="text-center text-green-600 mb-4">{msg}</p>}

//         <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
//           <div className="flex flex-col w-full">
//             <label className="text-[#4C5C68] mb-1 font-medium">Email</label>

//             <input
//               type="email"
//               placeholder="Enter your email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 shadow-sm rounded-lg outline-none text-[#1F2937] border-[#D1D5DB]/40 focus:ring-2 focus:ring-[#3B82F6]"
//             />
//           </div>

//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-800 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
//               >
//             Send Reset Link
//           </button>
//         </form>

//         <p className="text-center text-[#6B7280] mt-6 text-sm w-full">
//           Remembered your password?{" "}
//           <Link to="/login" className="text-[#3B82F6] font-semibold hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//     <Footer/>
//     </>
//   );
// }


import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import LandingNavbar from "../components/LandingNavbar ";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMsg("Password reset link sent to your email!");
    } catch (err) {
      setMsg("Error sending reset link. Please try again!");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <LandingNavbar />

      {/* MAIN CONTAINER */}
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#F5F5F5] via-[#D5DBDB] to-[#E5E7EB] px-4 overflow-x-hidden">

        {/* FORM WRAPPER */}
        <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-xl flex flex-col items-center border border-[#D1D5DB]">

          <h2 className="text-3xl sm:text-4xl font-bold text-[#4C5C68] mb-2 text-center">
            Forgot Password
          </h2>

          <p className="text-center text-[#6B7280] mb-6 text-base">
            Enter your email to reset your password
          </p>

          {msg && <p className="text-center text-green-600 mb-4">{msg}</p>}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col w-full">
              <label className="text-[#4C5C68] mb-1 font-medium">Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 shadow-sm rounded-lg outline-none text-[#1F2937] focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-800 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
            >
              Send Reset Link
            </button>
          </form>

          <p className="text-center text-[#6B7280] mt-6 text-sm w-full">
            Remembered your password?{" "}
            <Link to="/login" className="text-[#3B82F6] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
