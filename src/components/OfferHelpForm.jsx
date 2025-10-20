import React, { useState } from "react";
import axios from "axios";

const HelpOfferModal = ({ needId, onClose }) => {
  const [formData, setFormData] = useState({
    offerQuantity: "",
    message: "",
    contactInfo: "",
    type: "donation",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      await axios.post(
        "/api/help-offers",
        { ...formData, needId, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Your help offer has been submitted!");
      onClose();
    } catch (error) {
      console.error("Error submitting offer:", error);
      alert("Failed to submit offer.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4">Help this Association</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="offerQuantity"
            placeholder="Quantity"
            value={formData.offerQuantity}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <textarea
            name="message"
            placeholder="Message (optional)"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="text"
            name="contactInfo"
            placeholder="Contact Info"
            value={formData.contactInfo}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
          >
            <option value="donation">Donation</option>
            <option value="sale">Sale</option>
          </select>
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default HelpOfferModal;
