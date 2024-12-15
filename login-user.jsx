import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero-1.png";
import logoImage from "../assets/logo.png";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email dan password harus diisi.");
      setStatus("error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const { token, username, id } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("userID", id);

        setStatus("success");
        setError("");
        console.log("Login berhasil:", response.data);

        navigate("/materi");
      } else {
        setError("Login gagal. Silakan coba lagi.");
        setStatus("error");
      }
    } catch (err) {
      console.error("Kesalahan koneksi:", err);
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Terjadi kesalahan saat menghubungi server.");
      }
      setStatus("error");
    }
  };

  const handleNavigateRegister = () => {
    navigate("/register-user");
  };

  const handleForgotPasswordClick = () => {
    navigate("/forgot-pw"); 
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center">
      <div className="md:w-1/2 bg-white flex flex-col justify-center items-center p-8 relative animate-slideIn min-h-screen">
        <img src={logoImage} alt="Deus Code Logo" className="mb-6 w-48 md:w-56" />

        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 text-center">
          Selamat Datang di E-Learning
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Masuk untuk mengakses kursus Anda dan belajar tanpa batas.
        </p>

        {status === "error" && (
          <div className="flex items-center max-w-md w-auto mb-4 p-3 text-sm text-red-700 border-l-4 border-red-600 rounded-lg bg-red-100">
            <p className="flex-1 font-medium">{error}</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center max-w-md w-auto mb-4 p-3 text-sm text-green-700 border-l-4 border-green-600 rounded-lg bg-green-100">
            <p className="flex-1 font-medium">
              Login sukses! Anda akan segera diarahkan.
            </p>
          </div>
        )}

        <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1 text-left"
            >
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
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1 text-left"
            >
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
                className="absolute inset-y-0 right-4 flex items-center text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <AiFillEye size={24} className="text-gray-600" />
                ) : (
                  <AiFillEyeInvisible size={24} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="text-right">
              <button
              onClick={handleForgotPasswordClick} 
              className="text-primary text-sm hover:underline bg-transparent border-none"
            >
              Lupa Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-black font-semibold rounded-lg hover:bg-primary-hover transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Belum memiliki akun?{" "}
          <button
            onClick={handleNavigateRegister}
            className="text-primary font-medium hover:underline"
          >
            Daftar di sini
          </button>
        </p>
      </div>

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

export default LoginPage;
