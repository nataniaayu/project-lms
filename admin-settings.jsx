import React, { useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/layout-admin";
import { toast } from "react-toastify"; 

const Settings = () => {
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    password: "",
    bio: "",
    nomor_telepon: "",
    foto: null,
    fotoPreview: null,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        foto: file,
        fotoPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id"); // Corrected: Use 'id' from localStorage

    // Check if userId exists
    if (!userId) {
      toast.error("User ID not found. Please log in again."); // Toast error message
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("nama_lengkap", formData.nama_lengkap);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("bio", formData.bio);
    formDataToSend.append("nomor_telepon", formData.nomor_telepon);

    // Only append the photo if it's provided
    if (formData.foto) {
      formDataToSend.append("foto", formData.foto);
    }

    try {
      // Make the PUT request to the API, including the user ID in the URL
      const response = await axios.put(
        `http://localhost:8000/admin/profile/${userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: token, // Use Authorization header for token
          },
        }
      );

      toast.success("Profil berhasil diperbarui: " + response.data.message); // Toast success message
    } catch (error) {
      console.error("Error updating profile:", error.response ? error.response.data : error);
      toast.error("Gagal memperbarui profil. Silakan coba lagi."); // Toast error message
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 bg-secondary-light min-h-screen text-left">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-secondary-dark mb-6">Setting Akun</h2>
          <form onSubmit={handleSubmit}>
            {/* Upload Foto Profil */}
            <div className="mb-6">
              <label className="block font-medium mb-2 text-secondary-dark">Foto Profil Anda</label>
              <label
                htmlFor="profileImage"
                className="w-28 h-28 border-2 border-secondary-dark rounded-lg overflow-hidden cursor-pointer flex items-center justify-center relative"
              >
                {formData.fotoPreview ? (
                  <img
                    src={formData.fotoPreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-secondary-dark text-sm text-center">Upload Foto Anda</span>
                )}
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2 text-secondary-dark">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleInputChange}
                  className="w-full border border-secondary-light rounded-lg p-2"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-secondary-dark">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-secondary-light rounded-lg p-2"
                  placeholder="Masukkan email Anda"
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-secondary-dark">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-secondary-light rounded-lg p-2"
                  placeholder="Masukkan password Anda"
                />
              </div>
              <div>
                <label className="block font-medium mb-2 text-secondary-dark">Nomor Telepon</label>
                <input
                  type="text"
                  name="nomor_telepon"
                  value={formData.nomor_telepon}
                  onChange={handleInputChange}
                  className="w-full border border-secondary-light rounded-lg p-2"
                  placeholder="+62 Masukkan Nomor Telepon"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-medium mb-2 text-secondary-dark">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full border border-secondary-light rounded-lg p-2"
                rows="4"
                placeholder="Ketik Bio Anda"
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex items-center justify-start gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-black font-bold rounded-lg shadow hover:bg-primary-hover"
              >
                Update Profile
              </button>
              <button
                type="reset"
                onClick={() =>
                  setFormData({
                    nama_lengkap: "",
                    email: "",
                    password: "",
                    bio: "",
                    nomor_telepon: "",
                    foto: null,
                    fotoPreview: null,
                  })
                }
                className="px-4 py-2 font-bold bg-secondary-light text-secondary-dark rounded-lg shadow hover:bg-primary hover:text-white"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
