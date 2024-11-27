import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/layout-admin";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/feedbacks"); 
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <AdminLayout>
      <div className="relative bg-gradient-to-r from-customYellow1 to-customYellow2 rounded-bl-3xl shadow-lg px-10 py-16 w-full mt-0 mr-0 ml-6">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-white text-5xl font-bold mb-12">Feedback seluruh user</h1>
        </div>
      </div>

      {/* Feedback List */}
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
              <select className="border rounded-lg p-2 text-gray-600">
                <option>Filter By</option>
              </select>
              <select className="border rounded-lg p-2 text-gray-600">
                <option>Name</option>
              </select>
              <select className="border rounded-lg p-2 text-gray-600">
                <option>Date</option>
              </select>
              <select className="border rounded-lg p-2 text-gray-600">
                <option>Course</option>
              </select>
            </div>
            <button className="text-red-500 font-semibold">
              &#8635; Reset Filter
            </button>
          </div>

          {/* Feedback Content */}
          {feedbacks.length > 0 ? (
            feedbacks.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 py-4 border-b last:border-b-0"
              >
                <img
                  src={`https://i.pravatar.cc/40?img=${index + 1}`} 
                  alt={item.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">{item.feedback}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Tidak ada feedback yang tersedia.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Feedback;
