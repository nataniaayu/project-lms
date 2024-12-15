import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/layout-admin";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [filters, setFilters] = useState({
    userId: "",
    date: "",
    relevansi: "",
  });

  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 5; 

  const fetchFeedbacks = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Anda harus login terlebih dahulu.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/admin/feedback", {
        headers: {
          token: token,
        },
      });
      setFeedbacks(response.data);
    } catch (err) {
      setError("Gagal mengambil data feedback.");
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
    setFilters({ userId: "", date: "", relevansi: "" });
    setCurrentPage(1); 
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const userIdMatch = !filters.userId || feedback.users_id.toString().includes(filters.userId);
    const relevansiMatch = !filters.relevansi || feedback.relevansi.toLowerCase().includes(filters.relevansi.toLowerCase());
    const dateMatch = !filters.date || feedback.created_at.includes(filters.date);
    return userIdMatch && relevansiMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <AdminLayout>
      <div className="relative bg-gradient-to-r from-customYellow1 to-customYellow2 rounded-bl-3xl shadow-lg px-10 py-16 w-full mt-0 mr-0 ml-6">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-white text-5xl font-bold mb-12">Feedback Seluruh User</h1>
        </div>
      </div>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="bg-white shadow rounded-lg p-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                placeholder="Filter by User ID"
                className="border rounded-lg p-2 text-gray-600"
              />
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="border rounded-lg p-2 text-gray-600"
              />
              <input
                type="text"
                name="relevansi"
                value={filters.relevansi}
                onChange={handleFilterChange}
                placeholder="Filter by Relevansi"
                className="border rounded-lg p-2 text-gray-600"
              />
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
          ) : currentFeedbacks.length > 0 ? (
            <div className="space-y-4">
              {currentFeedbacks.map((feedback, index) => (
                <div key={feedback.id} className="bg-white shadow-md rounded-lg p-6">
                  <div className="text-left">
                    <span className="font-medium text-gray-700">Relevansi: </span>
                    <span>{feedback.relevansi || "Tidak ada relevansi"}</span>
                  </div>

                  <div className="mt-4 text-left">
                    <p className="text-sm text-gray-600">
                      Saran & Kritik : {feedback.saran_kritik}
                    </p>
                  </div>

                  {index !== currentFeedbacks.length - 1 && <hr className="my-4" />}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Tidak ada feedback yang tersedia.</p>
          )}
          <div className="flex items-center justify-center mt-6 space-x-2">
            <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
                Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
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
                onClick={() => setCurrentPage(currentPage + 1)}
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

export default Feedback;
