import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import logoImage from "../assets/logo.png";
import heroImage from "../assets/hero-1.png";
import axios from "axios";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError("Password harus diisi.");
      setStatus("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      setStatus("error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/reset-password", {
        newPassword: newPassword,
      });

      if (response.status === 200) {
        setStatus("success");
        setError("");
        console.log("Password berhasil diperbarui.");
        navigate("/login");
      } else {
        setError("Terjadi kesalahan saat memperbarui password.");
        setStatus("error");
      }
    } catch (err) {
      console.error("Kesalahan koneksi:", err);
      setError("Terjadi kesalahan saat menghubungi server.");
      setStatus("error");
    }
  };


  const handleNavigateBack = () => {
    navigate("/"); // Navigate to the login page
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center">
      {/* Left Section */}
      <div className="md:w-1/2 bg-white flex flex-col justify-center items-center p-8 relative animate-slideIn min-h-screen">
        {/* Back Button */}
        <button
          onClick={handleNavigateBack}
          className="absolute top-8 left-8 text-gray-600 focus:outline-none"
        >
          <FaChevronLeft size={24} />
        </button>

        {/* Logo */}
        <img src={logoImage} alt="Deus Code Logo" className="mb-6 w-48 md:w-56" />

        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 text-center">
          Ganti Password
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Masukkan password baru untuk mengakses akun Anda.
        </p>

        {/* Success/Failure Message */}
        {status === "error" && (
          <div className="flex items-center max-w-md w-auto mb-4 p-3 text-sm text-red-700 border-l-4 border-red-600 rounded-lg bg-red-100">
            <p className="flex-1 font-medium">{error}</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center max-w-md w-auto mb-4 p-3 text-sm text-green-700 border-l-4 border-green-600 rounded-lg bg-green-100">
            <p className="flex-1 font-medium">
              Password berhasil diperbarui! Anda akan segera diarahkan ke halaman login.
            </p>
          </div>
        )}

        {/* Forgot Password Form */}
        <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-gray-700 font-medium mb-1 text-left"
            >
              Password Baru<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="newPassword"
              placeholder="Masukkan password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium mb-1 text-left"
            >
              Konfirmasi Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Konfirmasi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-black font-semibold rounded-lg hover:bg-primary-hover transition duration-300"
          >
            Ganti Password
          </button>
        </form>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 bg-primary relative flex items-center justify-center overflow-hidden min-h-screen">
        <img
          src={heroImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
