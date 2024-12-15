import React, { useState, useEffect } from "react";
import Layout from "../layout/layout-user";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const HelpPage = () => {
    const token = localStorage.getItem("token");
    const [userName, setUserName] = useState("");
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        no_hp: "",
        course_name: "",
        deskripsi_masalah: "",
        termsAccepted: false,
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const savedUsername = localStorage.getItem("username");
        if (savedUsername) {
            setUserName(savedUsername);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.termsAccepted) {
            setMessage("You must accept the terms of Service & Privacy Policy.");
            toast.error("You must accept the terms of Service & Privacy Policy.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/help`, formData, {
                headers: {
                    token: token,
                },
            });
            setMessage(response.data.message);
            toast.success("Form submitted successfully!");
            setFormData({
                full_name: "",
                email: "",
                no_hp: "",
                course_name: "",
                deskripsi_masalah: "",
                termsAccepted: false,
            });
        } catch (error) {
            setMessage(
                error.response?.data?.message || "An error occurred. Please try again."
            );
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <Layout>
            <div className="bg-gradient-to-r from-customYellow1 to-customYellow2 rounded-bl-3xl shadow-lg px-10 py-16 w-full mt-0 mr-0 ml-6">
                <div className="flex flex-col items-start space-y-4">
                    <h1 className="text-white text-5xl font-bold">Hello {userName || "Guest"}!</h1>
                    <div className="flex items-center ml-4">
                        <p className="text-white text-3xl font-medium">Bantuan</p>
                        <AiOutlineExclamationCircle className="ml-2 text-white text-4xl" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-4 max-w-4xl">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-3xl font-bold text-center mb-4">Help Form</h1>
                    <hr className="border-yellow-500 mb-8" /> 
                    <p className="text-left mb-6 text-gray-600">
                        You can submit your questions or report any issues you encounter on our
                        website through this help form.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-yellow-300"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-yellow-300"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    name="no_hp"
                                    value={formData.no_hp}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-yellow-300"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                                    Course Name
                                </label>
                                <input
                                    type="text"
                                    name="course_name"
                                    value={formData.course_name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-yellow-300"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2 text-left">
                                Question or Issue Description
                            </label>
                            <textarea
                                name="deskripsi_masalah"
                                value={formData.deskripsi_masalah}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-yellow-300"
                                rows="5"
                                required
                            ></textarea>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleChange}
                                    className="mr-2 focus:ring-yellow-300"
                                />
                                <span className="text-sm text-gray-700">
                                    I have read and accept the
                                    <a href="#" className="text-blue-500 hover:underline ml-1">
                                        Terms of Service & Privacy Policy
                                    </a>
                                </span>
                            </label>
                            <button
                                type="submit"
                                className="bg-primary hover:bg-primary-hover text-black font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-yellow-300"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </Layout>
    );
};

export default HelpPage;
