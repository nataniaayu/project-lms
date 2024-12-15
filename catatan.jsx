import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../layout/layout-user";
import { RiFileTextLine } from "react-icons/ri";
import axios from "axios";
import { FaDownload, FaEdit, FaTrashAlt } from "react-icons/fa";

const Catatan = () => {
  const { materialsId } = useParams(); // This is the materialsId
  const [userName, setUserName] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState(null);
  const [isEditing, setIsEditing] = useState(null); // Track which note is being edited
  const [currentNote, setCurrentNote] = useState({}); // Track the content of the note being edited

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
      console.log("Fetch Notes Response:", response); // Log response
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error.response?.data || error.message);
      setError("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotes();
    } else {
      console.log("ID or token is missing");
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
      console.log("Download Note Response:", response); // Log response

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `note_${noteId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading note:", error.message);
    }
  };

  const handleEdit = (noteId, currentContent) => {
    setIsEditing(noteId);
    setCurrentNote({ konten: currentContent });
  };

  const handleUpdateNote = async (noteId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/materials/${materialsId}/note/${noteId}`, 
        { konten: currentNote.konten }, 
        {
          headers: {
            token: token,
          },
        }
      );
      console.log("Update Note Response:", response); // Log response
      fetchNotes();
      setIsEditing(null);
      alert("Note updated successfully!");
    } catch (error) {
      console.error("Error updating note:", error.message);
      alert("Failed to update note.");
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/materials/${materialsId}/note/${noteId}`, 
          {
            headers: {
              token: token,
            },
          }
        );
        console.log("Delete Note Response:", response); // Log response
        fetchNotes();
        alert("Note deleted successfully!");
      } catch (error) {
        console.error("Error deleting note:", error.message);
        alert("Failed to delete note.");
      }
    }
  };

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
      <div className="col-span-12 md:col-span-4 mt-4">
        <div className="bg-white rounded-lg p-4 shadow-lg border-t-4 border-primary">
          <h3 className="font-bold text-lg text-center text-black mb-4">Catatan Tersimpan</h3>
          {loading ? (
            <p>Loading notes...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul className="space-y-4">
              {notes.length > 0 ? (
                notes.map((note, index) => (
                  <li
                    key={note.id}
                    className="bg-white border border-primary rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-black text-lg">{index + 1}.</span>
                      <div>
                        {isEditing === note.id ? (
                          <textarea
                            value={currentNote.konten}
                            onChange={(e) =>
                              setCurrentNote({ ...currentNote, konten: e.target.value })
                            }
                            className="border p-2 w-full mb-4"
                          />
                        ) : (
                          <p className="text-sm text-secondary-dark mb-1">{note.konten}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-4 mt-3">
                      {isEditing === note.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateNote(note.id)}
                            className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-hover"
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => setIsEditing(null)}
                            className="bg-secondary-light py-2 px-4 rounded hover:bg-secondary-dark hover:text-white"
                          >
                            Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <FaDownload onClick={() => handleDownload(note.id)} className="text-black hover:text-primary-hover cursor-pointer" />
                          <FaEdit onClick={() => handleEdit(note.id, note.konten)} className="text-black hover:text-primary-hover cursor-pointer" />
                          <FaTrashAlt onClick={() => handleDelete(note.id)} className="text-black hover:text-primary-hover cursor-pointer" />
                        </>
                      )}
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
    </Layout>
  );
};

export default Catatan;
