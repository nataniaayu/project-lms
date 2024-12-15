import React, { useState, useEffect, useRef } from "react";
import { AiOutlineUser,AiOutlinePlus, AiOutlineUpload   } from "react-icons/ai";
import { FaTimes, FaEye, FaEyeSlash  } from 'react-icons/fa';
import { toast } from "react-toastify";
import Layout from "../layout/layout-user";
import axios from "axios";

const ProfilePage = () => {
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); 
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const token = localStorage.getItem("token");

  const [profileData, setProfileData] = useState({
    courseActive: 0,
    completedCourse: 0,
    totalCourse: 0,
    jobPosition: "",
  });

  useEffect(() => {
    if (activeTab === "profile") {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token"); 

                const response = await axios.get("http://localhost:8000/profile/progress", {
                    headers: {
                        token: token,
                    },
                });

                console.log("API Response:", response.data); 
                const { total_courses, completed_courses, active_courses, job_position } = response.data;

                setProfileData({
                    courseActive: active_courses,
                    completedCourse: completed_courses,
                    totalCourse: total_courses,
                    jobPosition: job_position, 
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }
  }, [activeTab]);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUserName(savedUsername);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log(selectedFile);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() !== '') {
        setFormData((prev) => {
            if (!Array.isArray(prev.skills)) {
                console.error("skills is not an array:", prev.skills);
                return { ...prev, skills: [newSkill] }; 
            }

            console.log("Adding new skill to skills array:", prev.skills);
            return {
                ...prev,
                skills: [...prev.skills, newSkill], 
            };
        });
        setNewSkill(''); 
        setShowModal(false); 
    }
  };


  const handleSkillDelete = (skillToDelete) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToDelete)
    }));
  };

  const handleReset = () => {
    setFile(null); 
    setFormData({
      fullName: "",
      username: "",
      gender: "",
      jobPosition: "",
      country: "",
      city: "",
      skills: [],
    });
    setMessage("");
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    gender: "",
    job_position: "",
    country: "",
    city: "",
    skills: [],
  });
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
  
    if (
      !formData.full_name ||
      !formData.gender ||
      !formData.job_position ||
      !formData.country ||
      !formData.city ||
      !formData.skills ||
      formData.skills.length === 0
    ) {
      setErrorMessage("Please fill in all required fields.");
      toast.error("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      setIsLoading(false);
      return;
    }
  
    try {
      const formDataToSend = { ...formData };
  
      const response = await axios.post("http://localhost:8000/profile", formDataToSend, {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
  
      console.log(response)
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      if (error.response) {
        toast.error(`Error: ${JSON.stringify(error.response.data)}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        toast.error("An unexpected error occurred.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="bg-gradient-to-r from-customYellow1 to-customYellow2 rounded-bl-3xl shadow-lg px-10 py-16 w-full mt-0 mr-0 ml-6">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-white text-5xl font-bold">Hello {userName || "Guest"}!</h1>
          <div className="flex items-center ml-4">
            <p className="text-white text-3xl font-medium">Profile & Akun</p>
            <AiOutlineUser className="ml-2 text-white text-4xl" />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 py-6 md:px-0">
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl"> 
          <div className="md:w-1/4 bg-white border-2 border-primary p-6 rounded-lg shadow-lg">
            <div className="relative flex justify-center items-center mb-4">
              <img
                src={file ? URL.createObjectURL(file) : "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-36 h-36 rounded-full border-4 border-yellow-400 object-cover"
                onClick={handleImageClick}
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {!file && (
                <span className="absolute text-white text-sm font-semibold">
                   Upload Profile
                </span>
              )}
            </div>

            <h2 className="text-center text-xl font-semibold mt-4 mb-2">
              {userName || "Loading..."}
            </h2>
            <p className="text-center text-gray-500 text-sm mb-4">
              <i className="fas fa-user text-gray-500 mr-1"></i>
              {profileData.jobPosition || "Loading..."}
            </p>

            <div className="w-full mt-6 mb-4"></div>
              <div className="mt-6 w-full text-center space-y-2 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Course Active</span>
                  <div className="bg-green-500 text-white w-6 h-6 flex items-center justify-center rounded-full">
                    {profileData.courseActive}
                  </div>
                </div>
                 <div className="flex justify-between items-center mb-2">
                   <span>Completed Course</span>
                   <div className="bg-yellow-500 text-white w-6 h-6 flex items-center justify-center rounded-full">
                     {profileData.completedCourse || 0}
                   </div>
                 </div>
                 <div className="flex justify-between items-center">
                   <span>Total Course</span>
                   <div className="bg-gray-500 text-white w-6 h-6 flex items-center justify-center rounded-full">
                     {profileData.totalCourse || 0}
                   </div>
                 </div>
               </div>
             </div>
   
              <div className="w-full md:w-3/4 bg-white shadow-lg rounded-lg p-6">
                <div className="flex border-b mb-4">
                  <button
                    className={`py-2 px-4 ${
                      activeTab === "profile"
                        ? "text-yellow-500 border-b-2 border-yellow-500"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    Profile
                  </button>
                  <button
                    className={`py-2 px-4 ${
                      activeTab === "account"
                        ? "text-yellow-500 border-b-2 border-yellow-500"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab("account")}
                  >
                    Account & Security
                  </button>
                </div>

                <div className="mt-4">
                  {activeTab === "profile" && (
                  <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4" onSubmit={handleSubmit}>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-left">Bio</label>
                    <textarea
                      name="bio"
                      className="w-full border rounded-lg p-2 mt-1"
                      rows="4"
                      placeholder="Write about yourself..."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-left">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2 mt-1"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-left">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={userName}
                      readOnly
                      className="w-full border bg-gray-100 rounded-lg p-2 mt-1"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-left">Select your gender</label>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={formData.gender === 'Male'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Male
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={formData.gender === 'Female'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Female
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-left">Job Position</label>
                    <input
                      type="text"
                      name="job_position"
                      value={formData.job_position}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2 mt-1"
                      placeholder="Enter your job position"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-left">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2 mt-1"
                      placeholder="Enter your country"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-left">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2 mt-1"
                      placeholder="Enter your city"
                    />
                  </div>
             
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-left">Choose your skills</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.skills.length > 0 ? (
                          formData.skills.map((skill, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg"
                            >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleSkillDelete(skill)}
                              className="text-red-500"
                            >
                              <FaTimes />
                          </button>
                        </div>
                      ))
                      ) : (
                        <p className="text-gray-500">No skills added yet.</p>
                      )}
                      <button
                        type="button"
                          onClick={() => setShowModal(true)}
                          className="bg-gray-300 px-3 py-1 rounded-lg flex items-center space-x-2"
                      >
                        <span>Add Skill</span>
                      <AiOutlinePlus />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-lg"
                    >
                      Edit Profile
                    </button>
                  </div>
                </form>
             
                  )}
                  {showModal && (
                    <div className="fixed inset-0 flex justify-center items-center z-50">
                      <div className="bg-white w-1/2 max-w-3xl p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-6">Add New Skill</h2>
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="w-full border rounded-lg p-3 mb-6 text-lg"
                          placeholder="Enter new skill"
                        />
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="bg-gray-500 text-white py-2 px-6 rounded-lg text-lg"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSkillAdd}
                            className="bg-yellow-500 text-white py-2 px-6 rounded-lg text-lg"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "account" && (
                    <div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-left text-gray-700">Phone number</label>
                        <input
                          type="text"
                          placeholder="Masukan No Telp"
                          className="mt-1 block w-full p-2 rounded-lg border border-gray-300 shadow-sm text-sm focus:border-yellow-500 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-left text-gray-700">Email address</label>
                        <input
                          type="email"
                          placeholder="Masukan Email"
                          className="mt-1 block w-full p-2 rounded-lg border border-gray-300 shadow-sm text-sm focus:border-yellow-500 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-left text-gray-700">Password</label>
                        <div className="flex items-center mt-1">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Masukan Password"
                            className="flex-1 p-2 rounded-lg border border-gray-300 shadow-sm text-sm focus:border-yellow-500 focus:ring-yellow-500"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="ml-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                          >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button className="w-auto sm:w-1/3 md:w-1/5 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-semibold py-2 px-4 rounded-lg">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
