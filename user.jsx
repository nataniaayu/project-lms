import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { FaArrowUp, FaUsers, FaEdit, FaTrash, FaUnlock, FaLock, FaPlus } from "react-icons/fa";
import AdminLayout from "../layout/layout-admin";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const User = () => {
  const [setProgress] = useState(0); 
  const [courseData, setCourseData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Capaian Pembelajaran",
        data: [],
        backgroundColor: "#f59e0b",
      },
    ],
  });

  const progressBarColors = {
    Multimedia: "bg-red-500",
    Copywriter: "bg-yellow-500",
    Web: "bg-green-500",
    SEO: "bg-blue-500", 
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

    // Fetch progress data for chart
    axios.get("http://localhost:5000/api/progress") // Replace with your backend API endpoint
      .then((response) => {
        const data = response.data;
        // Assuming response contains the data for the chart
        setChartData({
          labels: data.map((item) => item.name), // For example, using 'name' for labels
          datasets: [
            {
              label: "Capaian Pembelajaran",
              data: data.map((item) => item.progress), // Assuming 'progress' is the value for the chart
              backgroundColor: "#f59e0b",
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching progress data for chart:", error);
      });

    // Fetch progress data for progress bars every 2 seconds
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

  const [employeeData, setEmployeeData] = useState([]);

    useEffect(() => {
      // Fetch employee data from the backend
      axios.get("http://localhost:5000/api/employees") // Ganti URL dengan endpoint backend Anda
        .then((response) => {
          setEmployeeData(response.data); // Asumsikan respons berisi array data karyawan
        })
        .catch((error) => {
          console.error("Error fetching employee data:", error);
        });
    }, []);

    const handleEdit = (id) => {
      console.log("Editing employee with ID:", id);
      // Tambahkan logika untuk mengedit karyawan
    };
    
    const handleDelete = (id) => {
      console.log("Deleting employee with ID:", id);
      // Tambahkan logika untuk menghapus karyawan
    };
    
    const [courses, setCourses] = useState([]);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Unlock a specific level
  const unlockLevel = async (course, name, level) => {
    try {
      const response = await axios.put("http://localhost:5000/api/unlock-level", {
        course,
        name,
        level,
      });
      if (response.status === 200) {
        alert(`Successfully unlocked ${level} for ${name} in ${course}`);
        fetchCourses(); // Refresh data
      }
    } catch (error) {
      console.error("Error unlocking level:", error);
    }
  };

  // Update status
  const updateStatus = async (course, name, newStatus) => {
    try {
      const response = await axios.put("http://localhost:5000/api/update-status", {
        course,
        name,
        status: newStatus,
      });
      if (response.status === 200) {
        alert(`Status updated to "${newStatus}" for ${name} in ${course}`);
        fetchCourses(); // Refresh data
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    role: "",
    email: "",
  });
  const [file, setFile] = useState(null); // Untuk menyimpan file gambar
  const [message, setMessage] = useState(""); // State untuk pesan notifikasi
  const [isError, setIsError] = useState(false); // State untuk status error

  // Fetch data karyawan dari backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:5000/api/employees")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
        setMessage("Gagal memuat data karyawan.");
        setIsError(true);
      });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Tambahkan karyawan baru
  const handleAddEmployee = () => {
    const formData = new FormData();
    formData.append("name", newEmployee.name);
    formData.append("role", newEmployee.role);
    formData.append("email", newEmployee.email);
    formData.append("image", file); // Tambahkan file gambar ke FormData

    axios
      .post("http://localhost:5000/api/employees", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Update state employees dengan data baru tanpa perlu refresh
        setEmployees((prevEmployees) => [...prevEmployees, response.data]);

        // Reset form
        setNewEmployee({ name: "", role: "", email: "" });
        setFile(null);

        // Tutup modal
        document.getElementById("addEmployeeModal").close();

        // Tampilkan pesan berhasil
        setMessage("Karyawan berhasil ditambahkan!");
        setIsError(false);
      })
      .catch((error) => {
        console.error("Error adding employee:", error);

        // Tampilkan pesan error
        setMessage("Gagal menambahkan karyawan. Silakan coba lagi.");
        setIsError(true);
      });
  };

  return (
    <AdminLayout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-customYellow1 to-customYellow2 rounded-bl-3xl shadow-lg px-10 py-16 w-full mt-0 mr-0 ml-6">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-white text-5xl font-bold mb-12">Hello Admin!</h1>
        </div>

        {/* Overlapping Cards */}
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

      {/* Chart Section */}
      <div className="mt-24 bg-white shadow rounded-lg p-6 mx-6">
        <h2 className="text-lg font-semibold mb-4">Capaian Pembelajaran Karyawan</h2>
        <Bar data={chartData} options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }} />
      </div>

      {/* List Karyawan Section */}
      <div className="mt-12 bg-white shadow rounded-lg p-6 mx-6">
        <h2 className="text-lg font-semibold mb-4">List Karyawan</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Start</th>
                <th className="border border-gray-300 px-4 py-2">Course</th>
                <th className="border border-gray-300 px-4 py-2">Level</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((employee, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{employee.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.startDate}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.course}</td>
                  <td className="border border-gray-300 px-4 py-2">{employee.level}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-sm ${
                        employee.status === "Completed" ? "bg-green-500" : "bg-blue-500"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleEdit(employee.id)}
                    >
                      <FaEdit className="inline-block text-xl" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(employee.id)}
                    >
                      <FaTrash className="inline-block text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>`
          </table>
        </div>
        
        <div className="p-4">
          {courses.map((course, courseIndex) => (
            <div key={courseIndex} className="mb-6">
              {/* Title for Each Course */}
              <h2 className="font-bold text-lg text-orange-600 mb-4">
                {course.course}
              </h2>
              <div className="bg-white rounded-lg shadow-md">
                <table className="table-auto w-full border border-gray-300">
                  <thead className="bg-orange-100">
                    <tr>
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Level 1</th>
                      <th className="border px-4 py-2">Level 2</th>
                      <th className="border px-4 py-2">Level 3</th>
                      <th className="border px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.students.map((student, studentIndex) => (
                      <tr key={studentIndex}>
                        <td className="border px-4 py-2">{student.name}</td>
                        <td className="border px-4 py-2 text-center">
                          {student.level1 ? (
                            <FaUnlock className="text-green-500 inline" />
                          ) : (
                            <button
                              className="text-blue-500 hover:underline"
                              onClick={() =>
                                unlockLevel(course.course, student.name, "level1")
                              }
                            >
                              <FaLock className="inline" />
                            </button>
                          )}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {student.level2 ? (
                            <FaUnlock className="text-green-500 inline" />
                          ) : (
                            <button
                              className="text-blue-500 hover:underline"
                              onClick={() =>
                                unlockLevel(course.course, student.name, "level2")
                              }
                            >
                              <FaLock className="inline" />
                            </button>
                          )}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {student.level3 ? (
                            <FaUnlock className="text-green-500 inline" />
                          ) : (
                            <button
                              className="text-blue-500 hover:underline"
                              onClick={() =>
                                unlockLevel(course.course, student.name, "level3")
                              }
                            >
                              <FaLock className="inline" />
                            </button>
                          )}
                        </td>
                        <td className="border px-4 py-2">
                          <span
                            className={`px-3 py-1 rounded text-white ${
                              student.status === "Processing"
                                ? "bg-purple-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                            onClick={() =>
                              updateStatus(course.course, student.name, "Processing")
                            }
                          >
                            Processing
                          </button>
                          <button
                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                            onClick={() =>
                              updateStatus(course.course, student.name, "Waiting")
                            }
                          >
                            Waiting
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        </div>
        <div className="mt-12 bg-white shadow rounded-lg p-6 mx-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Team</h1>
            <button
              onClick={() => document.getElementById("addEmployeeModal").showModal()}
              className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Tambahkan Team
            </button>
          </div>

          {/* Pesan Notifikasi */}
          {message && (
            <div
              className={`p-4 mb-6 rounded ${
                isError ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* List karyawan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center"
              >
                <img
                  src={`http://localhost:5000/uploads/${employee.image}`} // URL gambar dari backend
                  alt={employee.name}
                  className="w-20 h-20 rounded-full mb-4"
                />
                <h2 className="text-lg font-semibold">{employee.name}</h2>
                <p className="text-sm text-gray-500">{employee.role}</p>
                <p className="text-sm text-gray-400">{employee.email}</p>
              </div>
            ))}
          </div>

          {/* Modal tambah karyawan */}
          <dialog id="addEmployeeModal" className="rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Tambahkan Karyawan</h3>
            <input
              type="text"
              name="name"
              placeholder="Nama"
              value={newEmployee.name}
              onChange={handleInputChange}
              className="w-full mb-2 px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={newEmployee.role}
              onChange={handleInputChange}
              className="w-full mb-2 px-4 py-2 border rounded-lg"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={handleInputChange}
              className="w-full mb-2 px-4 py-2 border rounded-lg"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mb-2 px-4 py-2 border rounded-lg"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddEmployee}
                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
              >
                Tambah
              </button>
              <button
                onClick={() => document.getElementById("addEmployeeModal").close()}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Batal
              </button>
            </div>
          </dialog>
      </div>
    </AdminLayout>
  );
};

export default User;
