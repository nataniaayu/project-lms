import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.jpg";
import logoImage from "../assets/logo.png";

const Splash = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12 p-12 sm:p-14 md:p-16 lg:p-20 animate-fadeIn"
      >
        <div className="text-center">
          <img
            src={logoImage}
            alt="Deus Code Logo"
            className="h-12 mx-auto mb-6 animate-fadeIn"
          />
          <h1 className="text-4xl font-bold text-black mb-6 animate-fadeIn animate-delay-500">
            Selamat datang di E-Learning
          </h1>
          <p className="text-xl text-secondary-dark mb-6 animate-fadeIn animate-delay-1000">
            Pilih salah{" "}
            <span className="underline text-primary">
              satu tombol
            </span>{" "}
            di bawah ini untuk masuk
          </p>
        </div>

        <div className="flex justify-center space-x-12 mt-8 animate-fadeIn animate-delay-1500">
          <Link to="/login-admin">
            <button className="bg-primary text-black font-semibold px-12 py-4 rounded-md hover:bg-primary-hover transition-all duration-300">
              Admin
            </button>
          </Link>
          <Link to="/login-user">
            <button className="bg-primary text-black font-semibold px-12 py-4 rounded-md hover:bg-primary-hover transition-all duration-300">
              User
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Splash;
