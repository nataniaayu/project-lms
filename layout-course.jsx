import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import logoImage from "../assets/logo.png"; 
import profileImage from "../assets/profile.jpg"; 

const CourseLayout = ({ children }) => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUserName(savedUsername);
    }
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-between items-center px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-4 bg-white shadow-md">
      <div className="flex items-center gap-6 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16">
        <button
          className="text-secondary-dark flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100"
          onClick={() => navigate("/kelas-saya")}
        >
          <FaChevronLeft size={24} />
        </button>
        <img
          src={logoImage}
          alt="Logo"
          className="w-32 sm:w-36 md:w-44 lg:w-48 xl:w-52 h-16 object-contain"
        />
      </div>
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 pr-4 sm:pr-6 md:pr-10 lg:pr-12 xl:pr-16">
          {/* User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={profileImage}
              alt="Profile"
              className="w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 2xl:w-16 h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 2xl:h-16 rounded-full border border-primary"
            />
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-primary-dark">{userName || "Guest"}</span>
              <span className="text-xs text-secondary-dark">User</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b-4 border-primary"></div>

      <main className="flex-1 bg-gray-100 py-10 px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20">
        {children}
      </main>

      <footer className="bg-secondary.light text-secondary.dark">
            <div className="container mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <img src={logoImage} alt="Logo Deus Code" className="w-15 h-15" />
                </div>
                <p className="text-lg font-semibold mt-2 text-black">Agensi Digital Marketing Andalan</p>
                <p className="text-lg font-semibold text-black">Bisnis Anda</p>
                <div className="flex justify-center space-x-4 mt-4">
                  <a href="#" className="text-complementary.blue hover:text-complementary.lightBlue">
                    <FaFacebook size={24} />
                  </a>
                  <a href="#" className="text-complementary.blue hover:text-complementary.lightBlue">
                    <FaInstagram size={24} />
                  </a>
                  <a href="#" className="text-complementary.blue hover:text-complementary.lightBlue">
                    <FaLinkedin size={24} />
                  </a>
                  <a href="#" className="text-complementary.blue hover:text-complementary.lightBlue">
                    <FaYoutube size={24} />
                  </a>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold mb-4 text-black">Kursus Kami</h3>
                <ul className="space-y-2 text-base text-secondary.dark">
                  <li>Multimedia</li>
                  <li>Copywriter</li>
                  <li>Web Developer</li>
                  <li>SEO</li>
                </ul>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold mb-4 text-black">Kontak Kami</h3>
                <div className="text-base text-secondary.dark">
                  <p className="mb-4">
                    <span className="block font-medium text-lg">Butuh Bantuan?</span>
                    <a href="tel:085174205789" className="flex items-center justify-center text-base">
                      <FaPhoneAlt className="mr-2" size={18} /> 0851 7420 5789
                    </a>
                  </p>
                  <p>
                    <span className="block font-medium text-lg">Butuh Dukungan?</span>
                    <a href="mailto:info@deuscode.co.id" className="flex items-center justify-center text-base">
                      <FaEnvelope className="mr-2" size={18} /> info@deuscode.co.id
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 text-center py-4 text-base text-black">
              © PT. Deus Digital Transformasi Universal.
            </div>
          </footer>
    </div>
  );
};

export default CourseLayout;
