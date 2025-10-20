import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api_auth";
import { passwordSchema } from '../validators/validationSchemas';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Vérifier la validité du mot de passe avec Zod
    const validationResult = passwordSchema.safeParse(password);
    if (!validationResult.success) {
        setError(validationResult.error.errors[0].message); // Affiche le premier message d'erreur de Zod
        return;
    }
    

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await resetPassword(token, password); 

      console.log("Réinitialisation du mot de passe avec :", { token, password });

      setMessage("Votre mot de passe a été modifié avec succès !");
      setError("");
    } catch (err) {
      setError(err.message || "Échec de la réinitialisation du mot de passe.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
  <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded shadow-md">
    <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
    <form className="mt-4" onSubmit={handleSubmit}>
      {message && <p className="text-center text-green-500">{message}</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <label className="block mb-2 text-sm text-gray-700">New Password</label>
      <input
        type="password"
        placeholder="Enter new password"

        className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="block mt-3 mb-2 text-sm text-gray-700">Confirm Password</label>
      <input
        type="password"
        placeholder="Confirm new password"

        className="w-full p-3 border rounded focus:outline-none focus:ring-1 focus:ring-brightColor"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        
      />

      <button type="submit" className="w-full py-2 mt-4 text-white rounded bg-brightColor hover:bg-orange-600">
        Reset Password
      </button>
    </form>
  </div>
</div>

  );
};

export default ResetPassword;
