import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import logoImage from "../assets/logo.png";
import heroImage from "../assets/hero-1.png";
import { AiFillEye, AiFillEyeInvisible, AiOutlineLeft } from "react-icons/ai";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);


  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setError("");
    setStatus("");
  
    if (!username) {
      setError("Username harus diisi.");
      setStatus("error");
      return;
    }
    if (!email) {
      setError("Email harus diisi.");
      setStatus("error");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid.");
      setStatus("error");
      return;
    }
    if (!password) {
      setError("Password harus diisi.");
      setStatus("error");
      return;
    }
    if (password.length < 8) {
      setError("Password harus minimal 8 karakter.");
      setStatus("error");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      setStatus("error");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:8000/register", {
        username,
        email,
        password,
        password_confirmation: confirmPassword,
      });
  
      setError("");
      setStatus("success");
      console.log("Registrasi berhasil:", response.data);
  
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Kesalahan koneksi:", error);
      setError("Terjadi kesalahan pada server.");
      setStatus("error");
    }
  };
  
  const handleGoBack = () => {
    navigate("/"); 
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-white flex flex-col justify-center items-center p-8 relative animate-slideIn">
        <button
          onClick={handleGoBack}
          className="absolute top-8 left-8 p-2 text-black focus:outline-none"
        >
          <AiOutlineLeft size={32} />
        </button>

        <img src={logoImage} alt="Logo" className="mb-6 w-48" />
        <h1 className="text-3xl font-bold text-black mb-4 text-left">
          Buat Akun E-Learning Anda
        </h1>
        <p className="text-secondary-dark mb-8 text-left">
          Daftar untuk membuka kunci furnitur premium dan kursus tanpa batas.
        </p>

        {status === "error" && error && (
          <div className="flex items-center max-w-md w-auto mb-4 p-3 text-sm text-red-700 border-l-4 border-red-600 rounded-lg bg-red-100 animate-fadeIn">
            <p className="flex-1 font-medium">{error}</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center max-w-md w-auto mb-4 p-3 text-sm text-green-700 border-l-4 border-green-600 rounded-lg bg-green-100 animate-fadeIn">
            <p className="flex-1 font-medium">Registrasi sukses! Anda bisa login sekarang.</p>
          </div>
        )}

        <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="block text-secondary-dark font-medium mb-1 text-left">
            Username<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="username"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
          </div>
            <div>
              <label htmlFor="email" className="block text-secondary-dark font-medium mb-1 text-left">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-secondary-dark font-medium mb-1 text-left">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-4 flex items-center text-secondary-dark focus:outline-none"
                >
                  {showPassword ? (
                    <AiFillEye size={24} className="text-secondary-dark" />
                  ) : (
                    <AiFillEyeInvisible size={24} className="text-secondary-dark" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-secondary-dark font-medium mb-1 text-left">
                Konfirmasi Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  placeholder="Masukkan konfirmasi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-4 flex items-center text-secondary-dark focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <AiFillEye size={24} className="text-secondary-dark" />
                  ) : (
                    <AiFillEyeInvisible size={24} className="text-secondary-dark" />
                  )}
                </button>
              </div>
            </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-black font-semibold rounded-lg hover:bg-primary-hover transition duration-300"
          >
            Daftar
          </button>
        </form>
      </div>
      <div className="md:w-1/2 bg-complementary-blue relative flex items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="E-Learning Illustration"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
      </div>
    </div>
  );
};

export default Register;
