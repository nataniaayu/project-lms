import React, { useState, useEffect } from "react";
import Layout from "../layout/layout-user";

const ActivityLog = () => {
    const dummyActivities = [
        { id: 1, category: "Kuis", subject: "Kamu baru saja menyelesaikan Video dan kuis Pembelajaran Multimedia level 1", date: "21 Dec 2024" },
        { id: 2, category: "Catatan", subject: "Catatan kamu berhasil disimpan", date: "15 Dec 2024" },
        { id: 3, category: "Feedback", subject: "Feedback kamu berhasil terkirim", date: "13 Dec 2024" },
        { id: 4, category: "Feedback", subject: "Feedback kamu berhasil terkirim", date: "11 Dec 2024" },
        { id: 5, category: "Feedback", subject: "Feedback kamu berhasil terkirim", date: "10 Dec 2024" },
        { id: 6, category: "Materi", subject: "Kamu baru mendaftar kelas Multimedia 1", date: "8 Dec 2024" },
        { id: 7, category: "Materi", subject: "Kamu baru mendaftar kelas Web 1", date: "8 Dec 2024" }
    ];

    const [activities, setActivities] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({ date: "", category: "" });

    useEffect(() => {
        setActivities(dummyActivities);
    }, []);

    const handleItemsPerPage = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); 
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const filteredActivities = activities.filter((activity) => {
        const matchesDate = filters.date ? activity.date.includes(filters.date) : true;
        const matchesCategory = filters.category ? activity.category === filters.category : true;
        return matchesDate && matchesCategory;
    });

    const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
    const paginatedData = filteredActivities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <Layout>
            <div className="container mx-auto px-6 py-8 max-w-5xl">
                <div className="shadow-lg rounded-lg p-6 bg-white">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 pb-2">Activity Log</h1>

                    {/* Filter Section */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Filter by Date:</label>
                                <input
                                    type="text"
                                    name="date"
                                    value={filters.date}
                                    onChange={handleFilterChange}
                                    className="border rounded p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="e.g., 13 Dec 2024"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Filter by Category:</label>
                                <select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    className="border rounded p-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">All</option>
                                    <option value="Kuis">Kuis</option>
                                    <option value="Catatan">Catatan</option>
                                    <option value="Feedback">Feedback</option>
                                    <option value="Materi">Materi</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="mr-2 font-medium text-gray-700">Tampilkan Isi:</label>
                            <select
                                className="border rounded p-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={itemsPerPage}
                                onChange={handleItemsPerPage}
                            >
                                {[5, 10, 15].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {paginatedData.map((activity) => (
                            <div
                                key={activity.id}
                                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition duration-300"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                                            {activity.category}
                                        </span>
                                        <p className="text-gray-800 font-medium">{activity.subject}</p>
                                    </div>
                                    <p className="text-gray-500 text-sm">{activity.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex items-center justify-center mt-6">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 mr-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-4 py-2 mx-1 rounded ${
                                    currentPage === i + 1
                                        ? "bg-primary text-white"
                                        : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 ml-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ActivityLog;
