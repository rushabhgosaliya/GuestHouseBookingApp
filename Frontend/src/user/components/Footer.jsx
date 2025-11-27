import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 py-5 text-center shadow-inner border-t border-blue-900 w-full overflow-x-hidden">
      <p className="text-white font-medium whitespace-normal">
        © {new Date().getFullYear()} Rishabh's Guest-House. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
