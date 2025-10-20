import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaLock } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { BiRestaurant } from "react-icons/bi";
import { loginUser } from "../services/api_auth";
import Button from "../layouts/Button";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useEffect } from 'react';

const LoginSidebar = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me" checkbox
  const [passwordType, setPasswordType] = useState('password');
  const [icon, setIcon] = useState(<FaEyeSlash />);
  const { login } = useContext(AuthContext); // Use login from AuthContext
  const navigate = useNavigate(); 

  const togglePasswordVisibility = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
      setIcon(<FaEye />);
    } else {
      setPasswordType('password');
      setIcon(<FaEyeSlash />);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      await login(email, password, rememberMe); // Use the context login function
      onClose(); // Close the sidebar after login
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setError("Too many login attempts. Please try again in a minute.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    }
  };

  // Handle "Remember Me" checkbox change
  const handleRememberMeChange = () => {
    setRememberMe((prev) => !prev);
  };


  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 transition-opacity backdrop-blur-sm ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar Login */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-8 transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button className="absolute text-gray-600 top-4 right-4" onClick={onClose}>
          <FaTimes size={24} />
        </button>

        <div className="flex justify-center mt-6">
          <BiRestaurant size={32} />
        </div>

        <h2 className="mt-12 mb-6 text-3xl font-semibold text-center">
          Login
        </h2>

        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <label className="text-sm text-gray-700">Email Address <span className="text-red-500">*</span></label>
          <input
            type="email"
            placeholder="Your email address"
            className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

        <div className="relative">
          <label className="text-sm text-gray-700">Password <span className="text-red-500">*</span></label>
          <input
            type={passwordType}
            id="password"
            name="password"
            placeholder="Your password"
            className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute mt-6 transform -translate-y-1/2 right-4"
        >
          {icon}
        </button>
        </div>

          {/* Forgot Password Link */}
          <div>
          <Link to="/forgot-password" className="text-brightColor">
            Forgot Password?
          </Link>
        </div>


          {/* Remember Me Checkbox */}

          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              id="rememberMe"
              className="w-4 h-4"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-700">Remember Me</label>
          </div>

          

          <Button title="Login" type="submit" className="w-full py-2" />
        </form>

        {/* Create Account Button */}
        <div className="mt-4">
          <Link to="/create-account" onClick={onClose}>
            <Button title="Create Account" className="w-full py-2 text-white rounded-full bg-brightColor" />
          </Link>
        </div>

        


        {/* Confidence Messages */}
        <div className="mt-6 text-sm text-lightText">
          <div className="flex items-center gap-2">
            <FaLock />
            <p>No publication without your permission.</p>
          </div>
          <div className="flex items-center gap-2">
            <FaClockRotateLeft /> 
            <p>It's faster that way.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSidebar;
