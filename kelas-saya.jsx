import React, { useState, useEffect } from "react";
import axios from "axios"; 
import Layout from "../layout/layout-user";
import { FaStar, FaClock, FaBookOpen } from "react-icons/fa";
import { BiBookBookmark } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const KelasSaya = () => {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [userName, setUserName] = useState("");
  const [myCourses, setMyCourses] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 
  const [selectedCourse, setSelectedCourse] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUserName(savedUsername);
    }

    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token"); 
        console.log(token);
        const response = await axios.get("http://localhost:8000/my-materials", {
          headers: {
            "token" : token,
        }
        });
        setMyCourses(response.data);
        console.log(myCourses)
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Gagal mengambil data kelas. Silakan coba lagi."); 
      } finally {
        setLoading(false); 
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses =
    selectedCategory === "Semua"
      ? myCourses
      : myCourses.filter((course) => course.kategori === selectedCategory);

  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-20">
          <p className="text-2xl font-bold">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center mt-20">
          <p className="text-red-500 text-2xl font-bold">{error}</p>
        </div>
      </Layout>
    );
  }

  const openModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };
  
  const handleMulai = (id) => {
    localStorage.setItem("material_id", id); 
    navigate(`/course/${id}`); 
  };
  

  return (
    <Layout>
      <div className="bg-gradient-to-r from-customYellow1 to-customYellow2 rounded-bl-3xl shadow-lg px-10 py-16 w-full mt-0 mr-0 ml-6">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-white text-5xl font-bold">Hello {userName || "Guest"}!</h1>
          <div className="flex items-center ml-4">
            <p className="text-white text-3xl font-medium">Kelas Saya</p>
            <BiBookBookmark className="ml-2 text-white text-4xl" />
          </div>
        </div>
      </div>
  
      <div className="flex flex-wrap justify-start mt-8 gap-4 px-6 ml-6">
        {["Semua", "Multimedia", "Copywriter", "Web", "SEO"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`${
              selectedCategory === category
                ? "bg-customYellow1 text-white"
                : "border-2 border-customYellow1 text-customYellow1"
            } px-8 py-3 text-lg rounded-lg font-medium shadow-md hover:bg-customYellow1 hover:text-white transition`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 px-6 py-6 bg-gray-100 min-h-screen ml-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-lg shadow-md overflow-hidden w-full h-[600px] relative"
            >
              <img
                src={course.gambar}
                alt={course.nama_kelas}
                className="w-full h-80 object-cover"
              />
              <div className="p-6 flex flex-col items-center space-y-6 w-full h-full">
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-green-500 text-black text-sm font-bold px-3 py-1 rounded-full">
                    {course.status}
                  </span>
                </div>
                <div className="w-full mb-0 text-center">
                  <h3 className="text-3xl font-bold text-gray-800">{course.nama_kelas}</h3>
                </div>
                <div className="flex justify-center items-center space-x-4 mb-6">
                  {[...Array(course.rating)].map((_, index) => (
                    <FaStar key={index} className="text-yellow-500 text-3xl" />
                  ))}
                  <span className="text-gray-600 text-2xl font-semibold">
                    ({course.rating})
                  </span>
                </div>
                <div className="flex justify-center items-center space-x-8 text-gray-700 text-lg mb-6">
                  <div className="flex items-center space-x-3">
                    <FaClock className="text-2xl" />
                    <span className="text-xl font-semibold">{course.estimasi_selesai}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaBookOpen className="text-2xl" />
                    <span className="text-xl font-semibold">{course.jumlah_latihan} Latihan</span>
                  </div>
                </div>
                <div className="flex justify-center items-center space-x-4 mt-6 w-full">
                  <button
                    onClick={() => openModal(course)}
                    className="border-2 border-customYellow1 text-customYellow1 px-6 py-2 text-lg rounded-lg font-medium hover:bg-customYellow1 hover:text-white transition"
                  >
                    Detail Kelas
                  </button>
                  <button
                    onClick={() => handleMulai(course.id)} 
                    className="bg-customYellow1 text-white px-6 py-2 text-lg rounded-lg font-medium hover:bg-yellow-600 transition"
                  >
                    Mulai Kelas
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
        <div className="text-center col-span-2 mt-10">
          <p className="text-2xl font-bold text-gray-600">
            Anda belum memiliki kelas.
          </p>
        </div>
        )}
      </div>
  
      
      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-3xl font-bold mb-4">{selectedCourse.judul}</h2>
            <p className="text-lg mb-4">{selectedCourse.deskripsi_kelas}</p>
            <button
              onClick={closeModal}
              className="bg-customYellow1 text-white px-6 py-3 text-lg rounded-lg font-medium hover:bg-yellow-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
  
};

export default KelasSaya;
