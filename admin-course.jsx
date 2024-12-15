import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronDown } from 'react-icons/fa';
import { FaCloudUploadAlt, FaTrash, FaArrowUp, FaUsers, FaCoins,  } from "react-icons/fa";
import AdminLayout from "../layout/layout-admin";
import { toast } from 'react-toastify'; 

const UploadCourse = () => {
  const [link, setLink] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("Pilih Course");
  const [selectedQuizNumber, setSelectedQuizNumber] = useState(null);
  const [isQuizNumberDropdownOpen, setIsQuizNumberDropdownOpen] = useState(false);
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);
  const [judulVideo, setJudulVideo] = useState("");
  const [materials, setMaterials] = useState([]);
  const [materialsId, setMaterialsId] = useState("");
  const [namaKelas, setNamaKelas] = useState('');
  const [deskripsiKelas, setDeskripsiKelas] = useState('');
  const [estimasiSelesai, setEstimasiSelesai] = useState('');
  const [jumlahLatihan, setJumlahLatihan] = useState('');
  const [rating, setRating] = useState('');
  const [kategori, setKategori] = useState('');
  const [gambar, setGambar] = useState('');
  const [totalLevels, setTotalLevels] = useState('');
  const token = localStorage.getItem("token");

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
  
    const materialData = {
      nama_kelas: namaKelas || '',
      deskripsi_kelas: deskripsiKelas || '',
      estimasi_selesai: estimasiSelesai || 0,
      jumlah_latihan: jumlahLatihan || 0,
      rating: rating || 0,
      kategori: kategori || '',
      gambar: gambar || '',
    };
  
    console.log("Payload to send:", materialData);
  
    try {
      const response = await fetch("http://localhost:8000/admin/materials", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token, 
        },
        body: JSON.stringify(materialData),
      });
  
      if (!response.ok) {
        const errorResult = await response.text();
        console.error("Raw response error:", errorResult);
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Material uploaded:', result);
  
      if (result.message) {
        toast.success(result.message); 
      } else {
        toast.success('Material uploaded successfully!');
      }
  
      setNamaKelas('');
      setDeskripsiKelas('');
      setEstimasiSelesai(0);
      setJumlahLatihan(0);
      setRating(0);
      setKategori('');
      setGambar('');
    } catch (error) {
      console.error('Error uploading material:', error.message);
  
      toast.error(`Failed to upload material: ${error.message}`);
    }
  };
  
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const token = localStorage.getItem("token");
  
        const response = await axios.get('http://localhost:8000/admin/materials', {
          headers: {
            "token": token,
          },
        });
  
        setMaterials(response.data); 
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };
  
    fetchMaterials();
  }, []);
  
  const handleMaterialSelect = (e) => {
    setMaterialsId(e.target.value); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Selected Material ID:', materialsId);
    console.log('Video Title:', judulVideo);
    console.log('Link:', link);

    if (!materialsId || !judulVideo || !link) {
      toast.error('Please select a material, provide a video title, and enter a video link.');
      console.error('Validation Error:', { materialsId, judulVideo, link });
      return;
    }
    const formData = new FormData();
    formData.append('judul_video', judulVideo);
    formData.append('jalur_file', link);

    console.log('Form Data Content:', Array.from(formData.entries()));

    try {
      const token = localStorage.getItem("token");
      console.log('Token:', token);

      const response = await axios.post(
        `http://localhost:8000/admin/materials/${materialsId}/video`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            "token": token,
          },
        }
      );

      console.log('Server Response:', response);

      if (response.status === 200 || response.status === 201) {
        const message = response.data.message || 'Video uploaded successfully!';
        toast.success(message);
      } else {
        toast.warn('There was an unexpected response from the server.');
        console.warn('Unexpected Response Status:', response.status);
      }
    } catch (error) {
      if (error.response) {
        console.error('Server Response Error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        const errorMessage = error.response.data.message || 'Error uploading the video.';
        toast.error(errorMessage);
      } else if (error.request) {
        console.error('No Response Received:', error.request);
        toast.error('No response from server. Please try again.');
      } else {
        console.error('Error Setting Up Request:', error.message);
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const addNewNumber = () => {
    const nextNumber = numbers.length + 1; 
    if (!numbers.includes(nextNumber)) { 
      setNumbers((prevNumbers) => [...prevNumbers, nextNumber]); 
      setSelectedQuizNumber(`No. ${nextNumber}`); 
    }
  };

  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  const handleAnswerChange = (index, e) => {
    const updateOptions = [...quizOptions];
    updateOptions[index][e.target.name] = e.target.value;
    setQuizOptions(updateOptions);
  
    console.log("Updated quizOptions:", updateOptions);
  };
  

  const handleSelectedQuizCourse= (e) => {
    setMaterialsId(e.target.value); 
  };
  
  const toggleQuizNumberDropdown = () => {
    setIsQuizNumberDropdownOpen(!isQuizNumberDropdownOpen);
  };

  const handleQuizNumberSelect = (number) => {
    setSelectedQuizNumber(number);
    setIsQuizNumberDropdownOpen(false);
  };

  const handleQuizSubmit = async () => {
    console.log("Form data:", {
      quizQuestion,
      quizOptions,
      materialsId,
    });
  
    if (!quizQuestion || quizOptions.length < 2 || !materialsId) {
      console.log("Missing required fields:", { quizQuestion, quizOptions, materialsId });
      alert("Silakan isi semua kolom.");
      return;
    }
  
    const quizData = {
      pertanyaan: quizQuestion,
      options: quizOptions.map((option) => ({
        text: option.text,
        is_correct: option.isCorrect,
      })),
    };
  
    console.log("Quiz data to be sent:", quizData);
  
    try {
      const response = await axios.post(
        `http://localhost:8000/admin/materials/${materialsId}/quiz`,
        quizData,
        {
          headers: {
            "Content-Type": "application/json",
            "token": token,
          },
        }
      );
  
      console.log("Response from backend:", response);
  
      if (response.status === 201) {
        const { message } = response.data; 
        toast.success(message, {
          position: "top-right",
          autoClose: 3000, 
        });
  
        setQuizQuestion("");
        setQuizOptions([
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ]);
        setMaterialsId(null);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Terjadi kesalahan saat mengirim quiz.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    axios
      .get("http://localhost:8000/admin/materials/user-count", {
        headers: {
          token: token, 
        },
      })
      .then((response) => {
        setMaterials(response.data);
      })
      .catch((error) => {
        console.error("Error fetching material data:", error);
      });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "User Count per Class",
      },
    },
  };

  return (
    <AdminLayout>
    <div className="relative bg-gradient-to-r from-customYellow1 to-customYellow2 rounded-bl-3xl shadow-lg px-10 py-16 w-full mt-0 mr-0 ml-6">
      <div className="flex flex-col items-start space-y-4">
        <h1 className="text-white text-5xl font-bold mb-12">Ayo upload course untuk siswa</h1>
      </div>

      <div className="absolute left-10 right-10 top-[80%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transform -translate-y-1/6">
      {materials.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-md rounded-lg p-6 relative transform hover:scale-105 transition-transform duration-300"
          style={{ zIndex: 1 }}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-700">{item.nama_kelas}</h3>
            <div className="flex items-center space-x-4"> 
              <div className="bg-red-100 p-2 rounded-md">
                <FaArrowUp className="text-red-500 text-xl" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <span className="text-4xl font-bold text-blue-600">{item.users_count}</span>
            <FaUsers className="text-gray-600 text-xl" />
          </div>
        </div>
      ))}
    </div>
    </div>
      <div className="pt-40 px-8">
        <h1 className="text-center text-4xl font-bold mb-8">UPLOAD COURSE</h1>
        <div className="mt-12 max-w-4xl mx-auto bg-white p-10 shadow-lg rounded-xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Upload Material</h2>
          <form onSubmit={handleUploadMaterial} className="space-y-8">

            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Informasi Umum</h3>

              <div className="mb-4">
                <label htmlFor="namaKelas" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kelas
                </label>
                <input
                  id="namaKelas"
                  type="text"
                  placeholder="Masukkan nama kelas"
                  value={namaKelas}
                  onChange={(e) => setNamaKelas(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="deskripsiKelas" className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Kelas
                </label>
                <textarea
                  id="deskripsiKelas"
                  placeholder="Masukkan deskripsi kelas"
                  value={deskripsiKelas}
                  onChange={(e) => setDeskripsiKelas(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Detail Kelas</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="estimasiSelesai" className="block text-sm font-medium text-gray-700 mb-2">
                    Estimasi Selesai (jam)
                  </label>
                  <input
                    id="estimasiSelesai"
                    type="number"
                    placeholder="Masukkan estimasi selesai dalam jam"
                    value={estimasiSelesai}
                    onChange={(e) => setEstimasiSelesai(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="jumlahLatihan" className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Latihan
                  </label>
                  <input
                    id="jumlahLatihan"
                    type="number"
                    placeholder="Masukkan jumlah latihan"
                    value={jumlahLatihan}
                    onChange={(e) => setJumlahLatihan(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                    Rating (0-5)
                  </label>
                  <input
                    id="rating"
                    type="number"
                    placeholder="Masukkan rating (opsional)"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="totalLevels" className="block text-sm font-medium text-gray-700 mb-2">
                    Total Levels
                  </label>
                  <input
                    id="totalLevels"
                    type="number"
                    placeholder="Masukkan total levels"
                    value={totalLevels}
                    onChange={(e) => setTotalLevels(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Tambahan</h3>

              <div>
                <div className="mb-4">
                  <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    id="kategori"
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)} 
                    className="w-full border-2 border-gray-300 rounded-lg p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {materials.map((material) => (
                      <option key={material.id} value={material.kategori}>
                        {material.kategori}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-sm mt-2">Selected Kategori: {kategori}</p>
              </div>
              <div>
                <label htmlFor="gambar" className="block text-sm font-medium text-gray-700 mb-2">
                  URL Gambar
                </label>
                <input
                  id="gambar"
                  type="url"
                  placeholder="Masukkan URL gambar"
                  value={gambar}
                  onChange={(e) => setGambar(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary"
                  
                />
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                type="submit"
                className="mt-12 px-8 py-3 bg-white text-customYellow2 text-lg rounded-md border-2 border-customYellow1 hover:bg-customYellow1 hover:text-white transition duration-300 mx-auto block"
              >
                Submit Material
              </button>
            </div>
          </form>
        </div>
        <div className="pt-16 px-8">
          <div className="mt-12 max-w-4xl mx-auto bg-white p-10 shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Upload Video</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Informasi Video</h3>

                <div className="mb-4">
                  <label htmlFor="materialSelect" className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Course
                  </label>
                  <select
                    id="materialSelect"
                    value={materialsId}
                    onChange={handleMaterialSelect}
                    className="w-full border-2 border-gray-300 rounded-lg p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Pilih Course</option>
                    {materials.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.nama_kelas}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="videoTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Video
                  </label>
                  <input
                    type="text"
                    id="videoTitle"
                    value={judulVideo}
                    onChange={(e) => setJudulVideo(e.target.value)}
                    placeholder="Masukkan Judul Video"
                    className="w-full border-2 border-gray-300 rounded-lg p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="videoLink" className="block text-sm font-medium text-gray-700 mb-2">
                    Link Video
                  </label>
                  <input
                    type="text"
                    id="videoLink"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Masukkan Tautan Video"
                    className="w-full border-2 border-gray-300 rounded-lg p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="mt-12 px-8 py-3 bg-white text-customYellow2 text-lg rounded-md border-2 border-customYellow1 hover:bg-customYellow1 hover:text-white transition duration-300 mx-auto block"
                >
                  Upload Video
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="pt-20 px-8">
          <div className="max-w-4xl mx-auto bg-white p-10 shadow-lg rounded-xl">
            <form onSubmit={handleQuizSubmit}>
              <h2 className="text-2xl font-bold text-center mb-8">UPLOAD QUIZ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-customYellow2">Pertanyaan</h3>
                  <textarea
                    id="quizQuestion"
                    placeholder="Masukkan pertanyaan"
                    value={quizQuestion}
                    onChange={(e) => setQuizQuestion(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-4 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  ></textarea>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-customYellow2">Jawaban</h3>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="isCorrect"
                          value={quizOptions.isCorrect}
                          required
                        />
                        <input
                          type="text"
                          name="text"
                          value={quizOptions.text}
                          onChange={(e) => handleAnswerChange(index, e)}
                          placeholder="Masukkan jawaban"
                          className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="relative">
                  <label
                    htmlFor="materialSelect"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Pilih Course
                  </label>
                  <div className="relative">
                    <select
                      id="materialSelect"
                      value={selectedCourse}
                      onChange={handleSelectedQuizCourse}
                      className="w-full bg-white border-2 border-gray-300 rounded-lg p-4 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none pr-10"
                    >
                      <option value="">Pilih Course</option>
                      {materials.map((material) => (
                        <option key={material.id} value={material.id}>
                          {material.nama_kelas}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-700 pointer-events-none" />
                  </div>
                </div>
                
                <div className="relative">
                  <label
                    htmlFor="numberDropdown"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Pilih Nomor
                  </label>
                  <button
                    id="numberDropdown"
                    type="button"
                    className="w-full bg-white border-2 border-gray-300 rounded-lg p-4 text-base text-gray-700 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    onClick={toggleQuizNumberDropdown}
                  >
                    {selectedQuizNumber || "Pilih Nomor"}
                    <FaChevronDown className="ml-2 text-lg text-gray-700" />
                  </button>
                  {isQuizNumberDropdownOpen && (
                    <div className="absolute mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg w-full z-10">
                      {numbers.map((number, index) => (
                        <div
                          key={index}
                          className="p-4 text-base text-center cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                          onClick={() => handleQuizNumberSelect(`No. ${number}`)}
                        >
                          No. {number}
                        </div>
                      ))}
                      <div
                        className="p-4 text-base text-center cursor-pointer hover:bg-gray-100 text-customYellow2 font-bold"
                        onClick={addNewNumber}
                      >
                        Tambah Nomor
                      </div>
                    </div>
                  )}
                </div>
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
