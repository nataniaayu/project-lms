import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/layout-admin";

const GetHelp = () => {
  const [helpForms, setHelpForms] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fullName: "",
    date: "",
    course: "",
  });

  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 5; 
  const fetchHelpForms = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");
    console.log("Token yang diambil:", token);

    if (!token) {
      console.log("Token tidak ditemukan. Pengguna belum login atau token telah kadaluarsa.");
      setError("Anda harus login terlebih dahulu.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/admin/help", {
        headers: {
          token: token,
        },
      });
      console.log("Data berhasil diambil:", response.data);
      setHelpForms(response.data);
    } catch (err) {
      console.error("Error fetching help forms:", err);

      if (err.response && err.response.status === 401) {
        setError("Token tidak valid.");
      } else {
        setError("Gagal mengambil data help form.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1); 
  };

  const resetFilters = () => {
    setFilters({ fullName: "", date: "", course: "" });
    setCurrentPage(1); 
  };

  useEffect(() => {
    fetchHelpForms();
  }, []);

  const uniqueFullNames = [...new Set(helpForms.map(form => form.full_name))];

  const uniqueCourses = [...new Set(helpForms.map(form => form.course_name))];

  const filteredHelpForms = (helpForms || []).filter((form) => {
    const fullNameMatch = !filters.fullName || form.full_name.toLowerCase().includes(filters.fullName.toLowerCase());
    const courseMatch = !filters.course || form.course_name.toLowerCase().includes(filters.course.toLowerCase());
    const dateMatch = !filters.date || (form.created_at && form.created_at.includes(filters.date));
    return fullNameMatch && courseMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredHelpForms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHelpForms = filteredHelpForms.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <AdminLayout>
      <div className="relative bg-gradient-to-r from-customYellow1 to-customYellow2 rounded-bl-3xl shadow-lg px-10 py-16 w-full mt-0 mr-0 ml-6">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-white text-5xl font-bold mb-12">Daftar Bantuan Pengguna</h1>
        </div>
      </div>

      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="bg-white shadow rounded-lg p-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
              <select
                name="fullName"
                value={filters.fullName}
                onChange={handleFilterChange}
                className="border rounded-lg p-2 text-gray-600"
              >
                <option value="">Filter by Full Name</option>
                {uniqueFullNames.map((fullName, index) => (
                  <option key={index} value={fullName}>
                    {fullName}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="border rounded-lg p-2 text-gray-600"
              />
              <select
                name="course"
                value={filters.course}
                onChange={handleFilterChange}
                className="border rounded-lg p-2 text-gray-600"
              >
                <option value="">Select Course</option>
                {uniqueCourses.map((course, index) => (
                  <option key={index} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={resetFilters}
              className="text-red-500 font-semibold"
            >
              &#8635; Reset Filter
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Sedang memuat data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : currentHelpForms.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-white shadow-md rounded-lg p-6 mx-auto">
                {currentHelpForms.map((form, index) => (
                  <div key={index} className="pb-4">
                    <h3 className="text-lg font-semibold text-gray-800 text-left">{form.full_name}</h3>
                    <p className="text-sm text-gray-600 text-left">{form.deskripsi_masalah}</p>
                    {index !== currentHelpForms.length - 1 && <hr className="my-4" />}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Tidak ada data bantuan yang tersedia.</p>
          )}

          <div className="flex items-center justify-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-primary text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GetHelp;
