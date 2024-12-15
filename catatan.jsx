import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../layout/layout-user";
import { RiFileTextLine } from "react-icons/ri";
import axios from "axios";
import { FaDownload, FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const Catatan = () => {
  const { materialsId } = useParams();
  const [userName, setUserName] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [currentNote, setCurrentNote] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUserName(savedUsername);
    }
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userID");
      const response = await axios.get(
        `http://localhost:8000/materials/note/user/${userId}`,
        {
          headers: {
            token: token,
          },
        }
      );
      setNotes(response.data);
      console.log("Fetched notes:", response.data);
    } catch (error) {
      console.error("Error fetching notes:", error.response?.data || error.message);
      setError("Failed to fetch notes");
      toast.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

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

  const handleEdit = (note) => {
    setCurrentNote(note);
    setShowModal(true);
  };

  const handleUpdateNote = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/materials/${materialsId}/note/${currentNote.id}`,
        { konten: currentNote.konten },
        {
          headers: {
            token: token,
          },
        }
      );
      console.log("Update response:", response.data);
      fetchNotes();
      setShowModal(false);
      toast.success("Note updated successfully!");
    } catch (error) {
      console.error("Error updating note:", error.message);
      toast.error("Failed to update note.");
    }
  };

  const handleDelete = async (noteId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/materials/${materialsId}/note/${noteId}`,
        {
          headers: {
            token: token,
          },
        }
      );
      console.log("Delete response:", response.data);
      fetchNotes();
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error.message);
      toast.error("Failed to delete note.");
    }
  };
  

  return (
    <Layout>
      <ToastContainer />
      <div className="bg-gradient-to-r from-customYellow1 to-customYellow2 rounded-bl-3xl shadow-lg px-10 py-16 w-full mt-0 mr-0 ml-6">
        <div className="flex flex-col items-start space-y-4">
          <h1 className="text-white text-5xl font-bold">Hello {userName || "Guest"}!</h1>
          <div className="flex items-center ml-4">
            <p className="text-white text-3xl font-medium">Catatan</p>
            <RiFileTextLine className="ml-2 text-white text-4xl" />
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-4 mt-8 px-6">
        <div className="bg-white rounded-lg p-6 shadow-lg border-t-4 border-primary">
          <h3 className="font-bold text-lg text-center text-black mb-4">Catatan Tersimpan</h3>
          {loading ? (
            <p>Loading notes...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul className="space-y-6">
              {notes.length > 0 ? (
                notes.map((note, index) => (
                  <li key={note.id} className="bg-gray-100 border border-primary rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-black text-lg">{index + 1}.</span>
                      <p className="text-sm text-secondary-dark mb-1">{note.konten}</p>
                    </div>
                    <div className="flex items-center justify-end gap-4 mt-3">
                      <FaDownload
                        onClick={() => handleDownload(note.id)}
                        className="text-black hover:text-primary-hover cursor-pointer"
                      />
                      <FaEdit
                        onClick={() => handleEdit(note)}
                        className="text-black hover:text-primary-hover cursor-pointer"
                      />
                      <FaTrashAlt
                        onClick={() => handleDelete(note.id)}
                        className="text-black hover:text-primary-hover cursor-pointer"
                      />
                    </div>
                  </li>
                ))
              ) : (
                <p>No notes found.</p>
              )}
            </ul>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Note</h2>
            <textarea
              value={currentNote.konten}
              onChange={(e) => setCurrentNote({ ...currentNote, konten: e.target.value })}
              className="border p-2 w-full h-32 mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={handleUpdateNote}
                className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-hover"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-secondary-light py-2 px-4 rounded hover:bg-secondary-dark hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Catatan;
