import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseLayout from "../layout/layout-course";
import { FaCheckCircle, FaEdit, FaTrashAlt, FaDownload, FaPlayCircle, FaLock, FaClipboardList } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const CoursePage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [clickedVideos, setClickedVideos] = useState([]);
  const [quizEnabled, setQuizEnabled] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [className, setClassName] = useState(""); 
  const [level, setLevel] = useState("");
  const token = localStorage.getItem("token");
  const materialId = localStorage.getItem("material_id");
  const { materialsId } = useParams();
  

  useEffect(() => {
    if (!materialId) {
      console.error("Material ID is missing from localStorage!");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) {
          throw new Error("Token is missing.");
        }

        const response = await axios.get(`/materials/${materialId}/video`, {
          headers: {
            "token": token,
          },
        });

        const responseData = response.data;

        setVideos(responseData.video);
        setClassName(responseData.nama_kelas); 
        setLevel(responseData.level); 

      } catch (error) {
        setError("Error fetching videos: " + (error.response?.data || error.message));
      } finally {
        setLoading(false);
      }
    };

    if (materialId && token) {
      fetchData();
    }
  }, [materialId, token]);

  const fetchNotes = async () => {
    try {
      if (!materialId) {
        console.error("Material ID is missing!");
        return;
      }

      const response = await axios.get(`/materials/${materialId}/note`, {
        headers: {
          token: token,
        },
      });
      setNotes(response.data);
      console.log("Notes fetched from API:", response.data);
    } catch (error) {
      console.error("Error fetching notes:", error.response?.data || error.message);
    }
  };

  const handleNoteSubmit = async () => {
    if (!newNote.trim()) {
      console.error("Note content is empty!");
      return;
    }
  
    if (!materialId) {
      console.error("Material ID is missing!");
      return;
    }
  
    try {
      const response = await axios.post( `/materials/${materialId}/note`,
        { konten: newNote },
        {
          headers: {
            token: token,
          },
        }
      );
  
      console.log('Note submitted successfully:', response.data);
      fetchNotes(); 
  
      setNewNote(""); 
  
    } catch (error) {
      console.error('Error submitting note:', error.response?.data || error.message);
    }
  };
  

  const handleDeleteNote = async (noteId) => {
    try {
      const materialId = localStorage.getItem("material_id");
      if (!materialId) {
        console.error("Material ID is missing!");
        return;
      }

      const response = await axios.delete(`/materials/${materialId}/note/${noteId}`, {
        headers: {
          token: token, 
        },
      });
  
      setNotes(notes.filter((note) => note.id !== noteId));
      console.log(response.data.message);
    } catch (error) {
      console.error("Error deleting note:", error.response?.data || error.message);
    }
  };

  const handleUpdateNote = async (note) => {
    try {
      const materialId = localStorage.getItem("material_id");
      if (!materialId) {
        console.error("Material ID is missing!");
        return;
      }
  
      const response = await axios.put(
        `/materials/${materialId}/note/${note.id}`,  
        { konten: note.konten },
        {
          headers: {
            token: token,  
          },
        }
      );
      console.log("Updated note:", response.data);
  
      setNotes((prevNotes) => {
        const updatedNotes = prevNotes.map((n) =>
          n.id === note.id ? { ...n, konten: response.data.konten } : n
        );
        return updatedNotes;
      });
  
      setIsEditing(false);
      fetchNotes(); 
    } catch (error) {
      console.error("Error updating note:", error.response?.data || error.message);
    }
  };
  
  const handleEditClick = (note) => {
    setIsEditing(true);
    setCurrentNote(note);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video); 
    if (!clickedVideos.includes(video.id)) {
      setClickedVideos([...clickedVideos, video.id]); 
    }
  };

  const handleQuiz = (materialsId) => {
    if (quizEnabled) {
        navigate(`/quiz/${materialsId}`); 
    }
  };

  const handleDownload = async (noteId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/materials/${materialsId}/note/${noteId}/download/pdf`,
        {
          headers: {
            token: token,
          },
          responseType: "blob",
        }
      );
      console.log("Download response:", response);

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `note_${noteId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Note downloaded successfully!");
    } catch (error) {
      console.error("Error downloading note:", error.message);
      toast.error("Failed to download note");
    }
  };


  useEffect(() => {
    if (materialId && token) {
      fetchNotes(); 
    }
  }, [materialId, token]); 

  useEffect(() => {
    if (videos && videos.length > 0) {
      setSelectedVideo(videos[0]);
    }
  }, [videos]);

  useEffect(() => {
    if (clickedVideos.length === videos.length) {
      setQuizEnabled(true);
    } else {
      setQuizEnabled(false);
    }
  }, [clickedVideos, videos.length]);
  
  return (
    <CourseLayout>
      <div className="grid grid-cols-12 gap-6 px-8 py-6 mx-auto max-w-screen-xl">
        <div className="col-span-12 md:col-span-4 flex flex-col h-full">
          <div className="rounded-lg shadow-md bg-white p-4 flex flex-col h-full">
            <div className="rounded-t-lg p-3 bg-primary flex items-center gap-2 text-secondary-dark min-h-[70px]">
              <FaClipboardList size={24} />
              <div>
                <h2 className="font-bold text-lg">{className}</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mt-4">
              {videos && videos.length > 0 ? (
                <ul className="space-y-3"> {/* Menambahkan space-y-3 untuk jarak antar elemen */}
                  {videos.map((video) => (
                    <li
                      key={video.id}
                      className="flex items-center justify-between p-3 min-h-[80px] rounded-md border border-primary bg-white hover:shadow-lg"
                    >
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => handleVideoClick(video)}
                      >
                        <FaPlayCircle className="text-secondary-dark" size={20} />
                        <span className="text-secondary-dark font-medium">{video.judul_video}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {clickedVideos.includes(video.id) ? (
                          <FaCheckCircle className="text-complementary-blue" />
                        ) : (
                          <FaLock className="text-gray-500" />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-secondary-dark text-center">No videos available.</p>
              )}
            </div>
            <div className="flex-none flex flex-row mt-auto gap-3">
              <button
                onClick={() => handleQuiz(materialId)}
                className={`w-1/2 py-3 font-semibold text-white rounded-md hover:bg-primary-hover ${
                  quizEnabled ? "" : "cursor-not-allowed opacity-50"
                }`}
                style={{ backgroundColor: "#FFB500" }}
                disabled={!quizEnabled}
              >
                Quiz
              </button>
              <button
                className="w-1/2 py-3 bg-secondary-light text-black font-bold rounded-md cursor-not-allowed flex items-center justify-center"
                disabled
              >
                Level
                <FaLock className="ml-2 text-black" />
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 flex flex-col min-h-[450px]">
          <div className="bg-white rounded-lg shadow-md overflow-hidden flex-1">
            {selectedVideo && selectedVideo.jalur_file ? (
              <iframe
                width="100%"
                height="100%"
                src={
                  selectedVideo.jalur_file.includes("youtu.be")
                    ? `https://www.youtube.com/embed/${selectedVideo.jalur_file.split('/').pop().split('?')[0]}`
                    : selectedVideo.jalur_file
                }
                title="Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <p className="text-center text-gray-500">Video tidak tersedia.</p>
            )}
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 mt-4">
          <div className="bg-white rounded-lg p-4 shadow-lg border-t-4 border-primary">
            <h3 className="font-bold text-lg text-center text-black mb-4">Catatan Tersimpan</h3>
            <ul className="space-y-4">
              {notes.map((note, index) => (
                <li
                  key={note.id}
                  className="bg-white border border-primary rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-black text-lg">{index + 1}.</span>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-semibold text-sm text-black mb-1 text-center">{note.title}</h4>
                      <p className="text-sm text-secondary-dark mb-1 text-justify">{note.konten}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-4 mt-3">
                     <FaDownload
                        onClick={() => handleDownload(note.id)}
                        className="text-black hover:text-primary-hover cursor-pointer"
                      />
                    <FaEdit
                      onClick={() => handleEditClick(note)}
                      className="text-black hover:text-primary-hover cursor-pointer"
                    />
                    <FaTrashAlt
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-black hover:text-primary-hover cursor-pointer"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {isEditing && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-xl mb-4 text-black">Edit Catatan</h2>
              <textarea
                value={currentNote.konten}
                onChange={(e) => setCurrentNote({ ...currentNote, konten: e.target.value })}
                className="border p-2 w-full mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateNote(currentNote)}
                  className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-hover"
                >
                  Simpan
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-secondary-light py-2 px-4 rounded hover:bg-secondary-dark hover:text-white"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="col-span-12 md:col-span-8 mt-4">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FaEdit className="text-customYellow1 text-2xl" />
              <span className="font-semibold text-lg text-black">Catatan</span>
            </div>

            <div className="w-full h-0.5 bg-primary"></div>

            <textarea
              className="w-full p-4 border border-primary rounded-md focus:outline-none placeholder-gray-500"
              placeholder="Masukkan Catatan anda disini"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={5}
            ></textarea>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleNoteSubmit}
                className="py-2 px-6 bg-primary text-black  font-bold rounded-md hover:bg-primary-hover transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </CourseLayout>
  );
};

export default CoursePage;
