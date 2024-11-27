import React, { useState, useEffect } from "react";
import Layout from '../layout/layout-user';
import { FaClock, FaBookOpen } from "react-icons/fa";
import { RiFileTextLine } from "react-icons/ri";


const Catatan = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Ambil username dari localStorage
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUserName(savedUsername);
    }
  }, []); 

  return (
    <Layout>
      <div className="bg-gradient-to-r from-customYellow1 to-customYellow2 rounded-bl-3xl shadow-lg px-10 py-16 w-full mt-0 mr-0 ml-6">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-white text-5xl font-bold">Hello {userName || "Guest"}!</h1>
          <div className="flex items-center ml-4">
            <p className="text-white text-3xl font-medium">Catatan</p>
            <RiFileTextLine className="ml-2 text-white text-4xl" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Catatan;
