import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layout/layout-user";
import { FaThLarge, FaUserFriends, FaClock, FaBookOpen, FaStar } from "react-icons/fa";

const Materi = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Ambil username dari localStorage
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUserName(savedUsername);
    }

    // Fetch course data
    axios
      .get("http://127.0.0.1:8000/api/courses")
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredCourses =
    selectedCategory === "Semua"
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

  return (
    <Layout>
      <div className="bg-gradient-to-r from-customYellow1 to-customYellow2 rounded-bl-3xl shadow-lg px-10 py-16 w-full mt-0 mr-0 ml-6">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-white text-5xl font-bold">Hello {userName || "Guest"}!</h1> 
          <div className="flex items-center ml-4">
            <p className="text-white text-3xl font-medium">List Materi</p>
            <FaThLarge className="ml-2 text-white text-4xl" />
          </div>
        </div>
      </div>

      <div className="flex justify-start mt-8 space-x-8 px-6 ml-6">
        {["Semua", "Multimedia", "Copywriter", "Web", "SEO"].map((category) => (
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

      {loading && <p className="text-center text-lg mt-8">Loading...</p>}
      {error && <p className="text-center text-lg mt-8 text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <div className="flex flex-col space-y-8 px-6 py-6 bg-gray-100 min-h-screen">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-row bg-white rounded-lg shadow-md overflow-hidden w-full max-w-full mx-auto"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-2/5 h-auto object-cover"
              />
              <div className="p-6 flex flex-col w-2/3 relative">
                <h3 className="text-3xl font-bold text-left mb-6">{course.title}</h3>
                <div className="flex items-center mt-2 mb-10 space-x-2">
                  {[...Array(course.rating)].map((_, index) => (
                    <FaStar key={index} className="text-yellow-500 text-2xl" />
                  ))}
                  <span className="text-gray-600 text-lg font-medium">({course.reviews})</span>
                </div>
                <div className="flex items-center space-x-8 text-gray-700 text-xl font-semibold">
                  <div className="flex items-center space-x-2">
                    <FaUserFriends className="text-2xl" />
                    <span>{course.students} Siswa</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-2xl" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaBookOpen className="text-2xl" />
                    <span>{course.exercises} Latihan</span>
                  </div>
                </div>

                <div className="flex-grow"></div>
                <div className="mt-4 flex space-x-4">
                  <button className="border-2 border-customYellow1 text-customYellow1 px-6 py-3 text-lg rounded-lg font-medium hover:bg-customYellow1 hover:text-white transition">
                    Detail Kelas
                  </button>
                  <button className="bg-customYellow1 text-white px-6 py-3 text-lg rounded-lg font-medium hover:bg-yellow-600 transition">
                    Daftar Kelas
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Materi;
