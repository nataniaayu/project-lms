import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../layout/layout-user";
import { FaThLarge, FaUserFriends, FaClock, FaBookOpen, FaStar } from "react-icons/fa";

const Materi = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    console.log(accessToken);
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUserName(savedUsername);
    }

    if (!accessToken) {
      toast.error("Access token is missing or invalid");
      setError("Access token is missing or invalid");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8000/materials`, {
        headers: {
          "token": accessToken,
        },
      })
      .then((response) => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Terjadi kesalahan saat mengambil data");
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log(courses)
  })

  const filteredCourses =
    selectedCategory === "Semua"
      ? courses
      : courses.filter((course) => course.kategori === selectedCategory);

  const openModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };
  
  const handleRegister = (id) => {
    const token = localStorage.getItem("token"); 
    
    axios
      .post(`http://localhost:8000/materials/${id}/register`, {}, {
        headers: {
          "token": token,
        },
      })
      .then((response) => {
        toast.success("Pendaftaran berhasil!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(error.response.data.message, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          } else if (error.response.status === 401) {
            toast.error("Token tidak valid atau Anda tidak diizinkan.", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          } else {
            toast.error(
              `Terjadi kesalahan: ${
                error.response.data.message || "Kesalahan tidak diketahui."
              }`,
              {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );
          }
        } else {
          toast.error("Terjadi kesalahan jaringan atau server tidak merespons.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      });
  };

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

      <div className="flex flex-wrap justify-start mt-8 gap-4 px-6 ml-6"> {/* Fixed padding and responsive gap */}
        {["Semua", "Multimedia", "Copywriter", "Web", "SEO"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`${
              selectedCategory === category
                ? "bg-customYellow1 text-white"
                : "border-2 border-customYellow1 text-customYellow1"
            } px-8 py-3 text-lg rounded-lg font-medium shadow-md hover:bg-customYellow1 hover:text-white transition`} // Consistent padding and responsive hover effects
          >
            {category}
          </button>
        ))}
      </div>
      
      {loading && <p className="text-center text-lg mt-8">Loading...</p>}
      {error && <p className="text-center text-lg mt-8 text-red-600">Error: {error}</p>}

      {/* Courses Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-6 bg-gray-100 ml-6">
        {filteredCourses.map((course) => (
          <div 
            key={course.id}
            className="bg-white rounded-lg shadow-md overflow-hidden w-full"
          >
            {/* Gambar Card */}
            <img
              src={course.gambar}
              alt={course.nama_kelas}
              className="w-full h-80 object-cover" 
            />
            <div className="p-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                {course.nama_kelas}
              </h3>
      
              <div className="flex justify-center items-center space-x-4 mb-8 px-4">
                {[...Array(course.rating)].map((_, index) => (
                  <FaStar key={index} className="text-yellow-500 text-3xl" />
                ))}
                <span className="text-gray-600 text-2xl font-semibold">
                  ({course.rating})
                </span>
              </div>
      
              <div className="flex justify-center items-center space-x-8 text-gray-700 text-lg mb-8 px-4">
                <div className="flex items-center space-x-3">
                  <FaUserFriends className="text-2xl" />
                  <span className="text-xl font-semibold">
                    {course.pengguna_terdaftar} Siswa
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaClock className="text-2xl" />
                  <span className="text-xl font-semibold">
                    {course.estimasi_selesai}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaBookOpen className="text-2xl" />
                  <span className="text-xl font-semibold">
                    {course.jumlah_latihan} Latihan
                  </span>
                </div>
              </div>
      
              <div className="flex justify-center items-center space-x-4 mt-6">
                <button
                  onClick={() => openModal(course)}
                  className="border-2 border-customYellow1 text-customYellow1 px-6 py-3 text-base rounded-lg hover:bg-customYellow1 hover:text-white transition font-medium"
                >
                  Detail Kelas
                </button>
                <button
                  onClick={() => handleRegister(course.id)}
                  className="bg-customYellow1 text-white px-6 py-3 text-base rounded-lg hover:bg-yellow-600 transition font-medium"
                >
                  Daftar Kelas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
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

export default Materi;

