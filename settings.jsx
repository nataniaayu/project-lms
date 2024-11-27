import React, { useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/layout-admin";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    phone: "",
    bio: "",
    profileImage: null,
    profileImagePreview: null,
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profileImage: file,
        profileImagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("fullname", formData.fullname);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("bio", formData.bio);
    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }

    try {
      const response = await axios.post("https://example.com/api/update-profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profil berhasil diperbarui: " + response.data.message);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil. Silakan coba lagi.");
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 bg-secondary-light min-h-screen text-left">
        <div className="bg-white shadow rounded-lg">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 w-1/3 ${
                activeTab === "account"
                  ? "font-semibold text-primary border-b-2 border-customYellow1"
                  : "text-secondary-dark"
              }`}
              onClick={() => handleTabChange("account")}
            >
              Setting Akun
            </button>
            <button
              className={`px-6 py-3 w-1/3 ${
                activeTab === "security"
                  ? "font-semibold text-primary border-b-2 border-customYellow1"
                  : "text-secondary-dark"
              }`}
              onClick={() => handleTabChange("security")}
            >
              Login & Keamanan
            </button>
            <button
              className={`px-6 py-3 w-1/3 ${
                activeTab === "notifications"
                  ? "font-semibold text-primary border-b-2 border-customYellow1"
                  : "text-secondary-dark"
              }`}
              onClick={() => handleTabChange("notifications")}
            >
              Notifikasi
            </button>
          </div>
          {activeTab === "account" && (
            <div className="p-6 text-left">
              <form onSubmit={handleSubmit}>
                {/* Upload Foto Profil */}
                <div className="mb-6">
                  <label className="block font-medium mb-2 text-secondary-dark">Foto Profil Anda</label>
                  <label
                    htmlFor="profileImage"
                    className="w-28 h-28 border-2 border-secondary-dark rounded-lg overflow-hidden cursor-pointer flex items-center justify-center relative"
                  >
                    {formData.profileImagePreview ? (
                      <img
                        src={formData.profileImagePreview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-secondary-dark text-sm text-center">
                        Upload Foto Anda
                      </span>
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
                    <label className="block font-medium mb-2 text-secondary-dark">Nama Panjang</label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      className="w-full border border-secondary-light rounded-lg p-2"
                      placeholder="Masukkan nama panjang anda"
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
                      placeholder="Masukkan email anda"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-secondary-dark">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full border border-secondary-light rounded-lg p-2"
                      placeholder="Masukkan username anda"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-secondary-dark">Nomor Telepon</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-secondary-light rounded-lg p-2"
                      placeholder="+62 Masukan Nomor Telephone"
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
                    placeholder="Ketik Bio anda"
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
                        fullname: "",
                        email: "",
                        username: "",
                        phone: "",
                        bio: "",
                        profileImage: null,
                        profileImagePreview: null,
                      })
                    }
                    className="px-4 py-2 font-bold bg-secondary-light text-secondary-dark rounded-lg shadow hover:bg-primary hover:text-white"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          )}
          {activeTab === "security" && (
            <div className="p-6 text-center text-secondary-dark">
              <h2 className="text-xl font-semibold">Login & Keamanan</h2>
              <p className="mt-4 text-secondary-dark">Konten untuk tab Login & Keamanan.</p>
            </div>
          )}
          {activeTab === "notifications" && (
            <div className="p-6 text-center text-secondary-dark">
              <h2 className="text-xl font-semibold">Notifikasi</h2>
              <p className="mt-4 text-secondary-dark">Konten untuk tab Notifikasi.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
