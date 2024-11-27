import React, { useState, useEffect } from "react";
import Layout from "../layout/layout-user";
import { FaClock, FaBookOpen } from "react-icons/fa";
import { BiBookBookmark } from "react-icons/bi";

import course1 from "../assets/course-1.png";
import course2 from "../assets/course-2.png";
import course3 from "../assets/course-3.png";
import course4 from "../assets/course-4.png";

const myCourses = [
  {
    id: 1,
    category: "Multimedia",
    title: "Multimedia",
    status: "Active",
    duration: "15 menit",
    exercises: 3,
    image: course1,
  },
  {
    id: 2,
    category: "Web",
    title: "Web",
    status: "Active",
    duration: "20 menit",
    exercises: 4,
    image: course3,
  },
];

const KelasSaya = () => {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Ambil username dari localStorage
    const savedUsername = localStorage.getItem("username");
      if (savedUsername) {
        setUserName(savedUsername);
      }
    }, []); 

  const filteredCourses =
    selectedCategory === "Semua"
      ? myCourses
      : myCourses.filter((course) => course.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-customYellow1 to-customYellow2 rounded-bl-3xl shadow-lg px-10 py-16 w-full mt-0 mr-0 ml-6">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-white text-5xl font-bold">Hello {userName || "Guest"}!</h1>
          <div className="flex items-center ml-4">
            <p className="text-white text-3xl font-medium">Kelas Saya</p>
            <BiBookBookmark className="ml-2 text-white text-4xl" />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-start mt-8 space-x-8 px-6 ml-6">
        {["Semua", "Multimedia", "Web"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`${
              selectedCategory === category
                ? "bg-customYellow1 text-white"
                : "border-2 border-customYellow1 text-customYellow1"
            } px-6 py-2 rounded-lg font-medium shadow-md hover:bg-customYellow1 hover:text-white`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Course Cards */}
      <div className="flex flex-col space-y-8 px-6 py-6 bg-gray-100 min-h-screen">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="flex flex-row bg-white rounded-lg shadow-md overflow-hidden w-full max-w-full mx-auto"
          >
            {/* Gambar */}
            <img
              src={course.image}
              alt={course.title}
              className="w-2/5 h-auto object-cover"
            />
            {/* Konten */}
            <div className="p-6 flex flex-col w-2/3 relative">
                {/* Header dengan Judul dan Status */}
                <div className="flex items-center space-x-4 mb-10">
                  <h3 className="text-3xl font-bold text-left">{course.title}</h3>
                  <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {course.status}
                  </span>
                </div>

                {/* Informasi Detail */}
                <div className="flex items-center space-x-8 text-gray-700 text-xl font-semibold mb-6">
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-2xl" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaBookOpen className="text-2xl" />
                    <span>{course.exercises} Latihan</span>
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-grow"></div>

                {/* Tombol */}
                <div className="mt-4 flex space-x-4">
                  <button className="border-2 border-customYellow1 text-customYellow1 px-6 py-3 text-lg rounded-lg font-medium hover:bg-customYellow1 hover:text-white transition">
                    Detail Kelas
                  </button>
                  <button className="bg-customYellow1 text-white px-6 py-3 text-lg rounded-lg font-medium hover:bg-yellow-600 transition">
                    Mulai Kelas
                  </button>
                </div>
              </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default KelasSaya;
