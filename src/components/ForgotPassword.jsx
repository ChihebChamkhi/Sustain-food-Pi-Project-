import { useState } from "react";

import { forgotPassword } from "../services/api_auth";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaValue) {
      setError("Please verify that you are not a robot.");
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const response = await forgotPassword(email, recaptchaValue);
      setMessage(response.message);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    }
  };


  const isButtonDisabled = !email || !recaptchaValue;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        {message && <p className="text-center text-green-500">{message}</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email"

            className="w-full p-3 rounded bborder focus:outline-none focus:ring-1 focus:ring-brightColor"

            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <ReCAPTCHA
          sitekey="6LfgB-4qAAAAAEE3xd-ZPqwtRNaat-vNjrlcCakD" // Replace with your actual Site Key
          onChange={(value) => setRecaptchaValue(value)}
        />
        <button type="submit"  className={`w-full mt-4 py-2 rounded text-white ${
            !isButtonDisabled ? 'bg-brightColor hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'}`} 
          disabled={isButtonDisabled}>
          Send Reset Link
        </button>
      </form>
    </div>
    </div>
  );
};

export default ForgotPassword;
