import React from "react";
import logo from "../../assets/images/logo.svg";
import "../../assets/styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar flex items-center justify-between bg-gray-900 p-4">
      <div className="flex items-center">
        <a
          href="/"
          className="flex items-center rounded-xl hover:text-yellow-400 font-bold text-white"
        >
          <img src={logo} alt="logo" className="h-8 mr-2" />
          ideal-dollop&nbsp;&nbsp;
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
