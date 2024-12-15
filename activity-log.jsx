import React, { useState, useEffect } from "react";
import Layout from "../layout/layout-user";
import axios from "axios";

const ActivityLog = () => {
    const token = localStorage.getItem("token");
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get("http://localhost:8000/activity-log", {
                    headers: {
                        token: token,
                    },
                });
                setActivities(response.data.activities);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch activities.");
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [token]);

    return (
        <Layout>
            <div className="container mx-auto p-4 max-w-4xl">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-3xl font-bold text-center mb-4">Activity Log</h1>
                    <hr className="border-yellow-500 mb-8" />

                    {loading ? (
                        <p className="text-center text-gray-500">Loading activities...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : activities.length === 0 ? (
                        <p className="text-center text-gray-500">No activities found.</p>
                    ) : (
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2 text-left">#</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Activity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((activity, index) => (
                                    <tr key={activity.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                        <td className="border border-gray-300 px-4 py-2">{new Date(activity.date).toLocaleString()}</td>
                                        <td className="border border-gray-300 px-4 py-2">{activity.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ActivityLog;
