import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCloudUploadAlt, FaTrash, FaArrowUp, FaUsers } from "react-icons/fa";
import AdminLayout from "../layout/layout-admin";

const UploadCourse = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [link, setLink] = useState("");
  const [isLinkInputVisible, setIsLinkInputVisible] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("Pilih Course");
  const [selectedLevel, setSelectedLevel] = useState("Pilih Level");
  const [levels, setLevels] = useState(["Level 1", "Level 2", "Level 3"]);
  const [selectedQuizCourse, setSelectedQuizCourse] = useState(null);
  const [isQuizCourseDropdownOpen, setIsQuizCourseDropdownOpen] = useState(false);
  const [selectedQuizNumber, setSelectedQuizNumber] = useState(null);
  const [isQuizNumberDropdownOpen, setIsQuizNumberDropdownOpen] = useState(false);
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);
  const [setProgress] = useState(0); 
  const [courseData, setCourseData] = useState([]); 

  const handleFileUpload = (e) => setSelectedFile(e.target.files[0]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  const handleFileRemove = () => setSelectedFile(null);

  const toggleCourseDropdown = () => setIsCourseDropdownOpen((prev) => !prev);
  const toggleLevelDropdown = () => setIsLevelDropdownOpen((prev) => !prev);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setIsCourseDropdownOpen(false);
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setIsLevelDropdownOpen(false); 
  };

  const handleAddLevel = () => {
    const newLevelNumber = levels.length + 1;
    const newLevel = `Level ${newLevelNumber}`;

    setLevels([...levels, newLevel]);
    setSelectedLevel(newLevel);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !selectedLevel || !(selectedFile || link)) {
      alert("Silakan pilih Course, Level, dan unggah file atau masukkan link.");
      return;
    }

    const formData = new FormData();
    formData.append("course", selectedCourse);
    formData.append("level", selectedLevel);

    // If there's a selected file, append it
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    // If there's a link, append it
    if (link) {
      formData.append("link", link);
    }

    try {
      // Send data to the backend using Axios
      const response = await axios.post("/api/upload-course", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert(`Course "${selectedCourse}" dengan "${selectedLevel}" berhasil diunggah!`);
      } else {
        alert("Terjadi kesalahan saat mengunggah course.");
      }
    } catch (error) {
      alert("Terjadi kesalahan, coba lagi.");
      console.error("Error submitting form:", error);
    }
  };

  const handleRemoveLink = () => {
    setLink(""); 
  };

  const toggleQuizCourseDropdown = () => {
    setIsQuizCourseDropdownOpen(!isQuizCourseDropdownOpen);
  };

  const handleQuizCourseSelect = (course) => {
    setSelectedQuizCourse(course);
    setIsQuizCourseDropdownOpen(false); // Close the dropdown
  };

  const toggleQuizNumberDropdown = () => {
    setIsQuizNumberDropdownOpen(!isQuizNumberDropdownOpen);
  };

  const handleQuizNumberSelect = (number) => {
    setSelectedQuizNumber(number);
    setIsQuizNumberDropdownOpen(false); // Close the dropdown
  };

  const addNewNumber = () => {
    const nextNumber = numbers.length + 1; // Tentukan nomor berikutnya
    if (!numbers.includes(nextNumber)) { // Cegah duplikasi nomor
      setNumbers((prevNumbers) => [...prevNumbers, nextNumber]); // Tambahkan angka murni
      setSelectedQuizNumber(`No. ${nextNumber}`); // Pilih nomor baru dengan format
    }
  };

  const handleQuizSubmit = async () => {
    if (!selectedQuizCourse || !selectedQuizNumber) {
      alert("Silakan pilih course dan nomor quiz.");
      return;
    }

    try {
      const response = await axios.post("/api/quiz-submit", {
        course: selectedQuizCourse,
        quizNumber: selectedQuizNumber,
      });

      if (response.status === 200) {
        alert("Quiz submitted successfully!");
      } else {
        alert("Terjadi kesalahan saat mengirim quiz.");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim quiz.");
      console.error("Error submitting quiz:", error);
    }
  };

  const progressBarColors = {
    Multimedia: "bg-red-500",
    Copywriter: "bg-yellow-500",
    Web: "bg-green-500",
    SEO: "bg-blue-500", // Changed to a unique color for SEO
  };

  useEffect(() => {
    // Fetch course data from the backend when the component mounts
    axios.get("http://localhost:5000/api/courses") // Replace with your backend API endpoint
      .then((response) => {
        setCourseData(response.data); // Assuming response contains an array of course objects
      })
      .catch((error) => {
        console.error("Error fetching course data:", error);
      });

    // Fetch progress data from the backend every 2 seconds (for example)
    const interval = setInterval(() => {
      axios.get("http://localhost:5000/api/progress") 
        .then((response) => {
          setProgress(response.data.progress); // Assuming the response has a 'progress' field
        })
        .catch((error) => {
          console.error("Error fetching progress data:", error);
        });
    }, 2000);

    // Clear the interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout>
      <div className="relative bg-gradient-to-r from-customYellow1 to-customYellow2 rounded-bl-3xl shadow-lg px-10 py-16 w-full mt-0 mr-0 ml-6">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-white text-5xl font-bold mb-12">Ayo upload course untuk siswa</h1>
        </div>
        <div className="absolute left-10 right-10 -bottom-20 grid grid-cols-4 gap-6">
          {courseData.map((course, index) => (
            <div key={index} className="p-4 bg-white shadow rounded-lg flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium text-gray-700">Course {course.name}</h3>
                <FaArrowUp className="text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-bold">{course.enrolled}</p> {/* Number of students enrolled */}
                <FaUsers className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">{course.progress}%</p> {/* Progress Percentage */}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${progressBarColors[course.name]}`}
                  style={{ width: `${course.progress}%` }} // Dynamic width based on progress
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-28 px-8">
        <h1 className="text-center text-4xl font-bold mb-12">UPLOAD COURSE</h1>
        <div className="max-w-4xl mx-auto bg-white p-10 shadow-lg rounded-xl">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold text-center mb-8">UPLOAD FILE</h2>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center relative ${dragOver ? "border-blue-500 bg-blue-100" : "border-gray-300"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FaCloudUploadAlt className="text-5xl text-gray-500 mb-4 mx-auto" />
              <p className="text-gray-500 mb-6">Drag and Drop here</p>
              <div className="flex justify-center gap-6">
                <label htmlFor="fileInput" className="px-8 py-3 bg-customYellow2 text-white rounded-lg shadow-lg cursor-pointer hover:bg-yellow-600 transition duration-300">
                  Select File
                </label>
                <button
                  type="button"
                  className="px-8 py-3 bg-customYellow2 text-white rounded-lg shadow-lg hover:bg-orange-600 transition duration-300"
                  onClick={() => setIsLinkInputVisible(true)}
                >
                  Insert Link
                </button>
              </div>
              <input id="fileInput" type="file" onChange={handleFileUpload} className="hidden" />
            </div>
            {selectedFile && (
              <div className="flex items-center justify-between mt-6 p-6 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-700">
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
                <button type="button" onClick={handleFileRemove} className="text-red-500">
                  <FaTrash />
                </button>
              </div>
            )}
            {isLinkInputVisible && (
              <div className="mt-8 relative">
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Masukkan URL Course (Optional)"
                  className="w-full border border-gray-300 rounded-lg p-4 text-sm"
                />
                {link && (
                  <button
                    type="button"
                    onClick={handleRemoveLink}
                    className="absolute top-6 right-6 text-red-500"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            )}
            <div className="mt-8">
              <input
                type="text"
                placeholder="Masukkan Judul Course"
                className="w-full border-2 border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm rounded-lg p-4"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6 justify-items-center">
              {/* Course Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="w-64 bg-white border border-black rounded-md p-4 text-lg flex justify-between items-center cursor-pointer"
                  onClick={toggleCourseDropdown}
                >
                  {selectedCourse || "Courses"} <span className="ml-2 text-lg">▼</span>
                </button>
                {isCourseDropdownOpen && (
                  <div className="absolute mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-64 z-10">
                    {["Multimedia", "Copywriter", "Web", "SEO"].map((course, index) => (
                      <div
                        key={index}
                        className="p-4 text-lg text-center cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                        onClick={() => handleCourseSelect(course)}
                      >
                        {course}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Level Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="w-64 bg-white border border-black rounded-md p-4 text-lg flex justify-between items-center cursor-pointer"
                  onClick={toggleLevelDropdown}
                >
                  {selectedLevel || "Level"} <span className="ml-2 text-lg">▼</span>
                </button>
                {isLevelDropdownOpen && (
                  <div className="absolute mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-64 z-10">
                    {levels.map((level, index) => (
                      <div
                        key={index}
                        className="p-4 text-lg text-center cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                        onClick={() => handleLevelSelect(level)}
                      >
                        {level}
                      </div>
                    ))}
                    <div
                      className="p-4 text-lg text-center cursor-pointer hover:bg-gray-100 text-customYellow2 font-bold"
                      onClick={handleAddLevel}
                    >
                      Add Level
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              type="submit"
                className="mt-12 px-8 py-3 bg-white text-customYellow2 text-lg rounded-md border-2 border-customYellow1 hover:bg-customYellow1 hover:text-white transition duration-300 mx-auto block"
              >
                Submit
            </button>
            </form>
            </div>
            <div className="pt-32 px-8">
              <div className="max-w-4xl mx-auto bg-white p-10 shadow-lg rounded-xl">
                <form onSubmit={handleQuizSubmit}>
                  <h2 className="text-2xl font-semibold text-center mb-8">UPLOAD QUIZ</h2>
                    <div className="grid grid-cols-2 gap-6">
                      {/* Question Section */}
                        <div>
                          <h3 className="text-xl font-bold mb-4 text-customYellow2">Pertanyaan</h3>
                            <textarea
                              placeholder="Masukkan pertanyaan"
                              className="w-full border border-gray-300 rounded-lg p-4 text-sm h-32 resize-none"
                              required
                            ></textarea>
                        </div>
                        {/* Answer Section */}
                        <div>
                          <h3 className="text-xl font-bold mb-4 text-customYellow2">Jawaban</h3>
                          <div className="space-y-3">
                          {[1, 2, 3, 4].map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                          <input type="radio" name="answer" value={`Option ${option}`} required />
                            <input
                              type="text"
                              placeholder="Masukkan jawaban"
                              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                <div className="grid grid-cols-2 gap-6 mt-6 justify-items-center">
                {/* Course Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    className="w-64 bg-white border border-black rounded-md p-4 text-lg flex justify-between items-center cursor-pointer"
                    onClick={toggleQuizCourseDropdown}
                  >
                    {selectedQuizCourse || "Courses"} <span className="ml-2 text-lg">▼</span>
                  </button>
                  {isQuizCourseDropdownOpen && (
                    <div className="absolute mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-64 z-10">
                      {["Multimedia", "Copywriter", "Web", "SEO"].map((course, index) => (
                        <div
                          key={index}
                          className="p-4 text-lg text-center cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                          onClick={() => handleQuizCourseSelect(course)}
                        >
                          {course}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Number Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    className="w-64 bg-white border border-black rounded-md p-4 text-lg flex justify-between items-center cursor-pointer"
                    onClick={toggleQuizNumberDropdown}
                  >
                    {selectedQuizNumber || "Nomor"} <span className="ml-2 text-lg">▼</span>
                  </button>
                  {isQuizNumberDropdownOpen && (
                    <div className="absolute mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-64 z-10">
                      {numbers.map((number, index) => (
                        <div
                          key={index}
                          className="p-4 text-lg text-center cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                          onClick={() => handleQuizNumberSelect(`No. ${number}`)}
                        >
                          No. {number}
                        </div>
                      ))}
                      <div
                        className="p-4 text-lg text-center cursor-pointer hover:bg-gray-100 text-customYellow2 font-bold"
                        onClick={addNewNumber}
                      >
                        Tambah Nomor
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="col-span-2">
                  <button
                    type="button"
                    className="mt-12 px-8 py-3 bg-white text-customYellow2 text-lg rounded-md border-2 border-customYellow1 hover:bg-customYellow1 hover:text-white transition duration-300 mx-auto block"
                    onClick={handleQuizSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default UploadCourse;
