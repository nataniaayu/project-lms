import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBars,
  FaTimes,
  FaUserCog,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaUserFriends,
  FaCommentDots,
  FaChevronRight,
} from "react-icons/fa";
import { BsBell } from "react-icons/bs";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoImage from "../assets/logo.png"; // Path logo
import profileImage from "../assets/profile.jpg"; // Path profil image

const AdminLayout = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutClicked, setIsLogoutClicked] = useState(false);
  const [Admin, setAdmin] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Tambahkan token jika diperlukan
          },
        });
        setAdmin(response.data.name); // Asumsi response berisi { name: "Nama Admin" }
      } catch (error) {
        console.error("Gagal mengambil data admin:", error);
        setAdmin("Admin"); // Fallback jika gagal
      }
    };

    fetchAdminData();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    setIsLogoutClicked(true);
    setTimeout(() => {
      localStorage.removeItem("userLoggedIn");
      navigate("/login-admin");
    }, 200); // Delay sedikit agar animasi terlihat
  };

  const menuItems = [
    { id: 1, name: "User", icon: <FaUserFriends />, path: "/user" },
    { id: 2, name: "Courses", icon: <FaChalkboardTeacher />, path: "/course" },
    { id: 3, name: "Settings", icon: <FaUserCog />, path: "/settings" },
    { id: 4, name: "Feedback", icon: <FaCommentDots />, path: "/feedback" },
  ];

  return (
    <div className="flex flex-col">
      {/* Navbar */}
      <div className="flex flex-wrap justify-between items-center px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-4 bg-white shadow-md">
        <div className="flex items-center">
          <img
            src={logoImage}
            alt="Logo"
            className="w-28 sm:w-32 md:w-40 lg:w-44 xl:w-48 2xl:w-52 h-16 object-contain"
          />
        </div>
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 pr-4 sm:pr-6 md:pr-10 lg:pr-12 xl:pr-16">
          <div className="relative mr-4">
            <button className="text-secondary-dark relative">
              <BsBell size={20} />
              <div className="absolute top-0 right-0 bg-red-500 rounded-full w-3 h-3"></div>
            </button>
          </div>
          <div className="relative">
            <button
              className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5"
              onClick={toggleDropdown}
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-8 sm:w-10 md:w-12 lg:w-14 xl:w-16 2xl:w-16 h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16 2xl:h-16 rounded-full border border-primary"
              />
              <div className="hidden sm:flex flex-col items-start ml-2">
                {/* Menampilkan nama pengguna dari state */}
                <span className="text-sm font-medium text-primary-dark">
                  {Admin || "Admin"}
                </span>
                <span className="text-xs text-secondary-dark">Admin</span>
              </div>
            </button>
          </div>
          {/* Hamburger Icon */}
          <div className="sm:hidden">
            <button onClick={toggleSidebar} className="text-secondary-dark">
              {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>
      <div className="border-b-4 border-primary"></div>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-all duration-300 fixed sm:relative w-64 h-full bg-white flex flex-col border-r border-secondary-light shadow-md z-50 sm:translate-x-0`}
        >
          <div className="px-6 py-4">
            <h1 className="text-sm font-semibold text-left text-secondary-dark">
              Dashboard
            </h1>
          </div>
          <nav className="px-4 flex-1">
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg shadow transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-primary text-black"
                        : "bg-white text-secondary-dark"
                    }`}
                  >
                    <div className="flex items-center">
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-lg ${
                          location.pathname === item.path
                            ? "bg-primary hover:text-white"
                            : "bg-secondary-light text-secondary-dark"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="ml-4 text-sm font-medium">
                        {item.name}
                      </span>
                    </div>
                    <FaChevronRight
                      className={`transition-all ${
                        location.pathname === item.path
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                      size={16}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="px-4 py-4 border-t border-secondary-light">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium ${
                isLogoutClicked
                  ? "text-white bg-primary"
                  : "text-secondary-dark bg-gray-100 hover:bg-primary hover:text-white"
              } rounded-lg transition-all duration-200`}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-lg ${
                  isLogoutClicked
                    ? "bg-primary"
                    : "bg-gray-200 hover:bg-primary"
                }`}
              >
                <FaSignOutAlt />
              </span>
              <span className="ml-4">Keluar</span>
            </button>
          </div>
        </aside>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="flex-1 bg-gray-100 pb-10">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
