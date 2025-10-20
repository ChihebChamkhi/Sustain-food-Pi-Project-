import React, { useState } from "react";
import axios from "axios"; // You'll need to install axios: npm install axios
import { useEffect } from "react"; // Import useEffect
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: ""
  });

  // Ajoutez ce useEffect ici
  useEffect(() => {
    if (submitStatus.message) {
      const timer = setTimeout(() => {
        setSubmitStatus({ success: false, message: "" });
      }, 3000); // 3 secondes

      return () => clearTimeout(timer);
    }
  }, [submitStatus.message]); // Se déclenche quand le message change

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: "" });

    try {
      // Replace with your actual backend endpoint
      const response = await axios.post("http://localhost:5000/api/contact", formData);
      
      if (response.data.success) {
        setSubmitStatus({
          success: true,
          message: "Message sent successfully!"
        });
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          message: ""
        });
      } else {
        setSubmitStatus({
          success: false,
          message: response.data.message || "Failed to send message."
        });
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error.response?.data?.message || "An error occurred. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Contact Us</h1>
        
        {submitStatus.message && (
          <div className={`mb-4 p-3 rounded ${submitStatus.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {submitStatus.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
              placeholder="Your name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
              placeholder="Your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
              placeholder="Your message"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brightColor ${
              isSubmitting ? "bg-gray-400" : "bg-brightColor hover:bg-brightColorDark"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;