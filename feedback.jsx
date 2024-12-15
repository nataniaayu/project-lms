import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CourseLayout from "../layout/layout-course";
import heroImage from "../assets/hero-1.png";
import { toast } from "react-toastify"; 

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState("");
  const [videoRelevance, setVideoRelevance] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const materialsId = localStorage.getItem("material_id");
  const userId = localStorage.getItem("userID");
  const quizId = localStorage.getItem("quizId"); 

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!feedback.trim()) {
      setFeedbackError("Kritik dan saran wajib diisi");
      console.log("Error: Feedback is empty");
      toast.error("Feedback is required!"); 
      return;
    } else {
      setFeedbackError("");
    }
  
    console.log("Materials ID:", materialsId);
    console.log("Quiz ID:", quizId);
    console.log("User ID:", userId);
    console.log("Selected Video Relevance:", videoRelevance);
    console.log("Feedback:", feedback);
  
    if (!videoRelevance) {
      setErrorMessage("Please select a video relevance option.");
      console.log("Error: Video relevance is not selected");
      toast.error("Please select a video relevance option."); 
      return;
    }
  
    if (
      ![
        "tidak",
        "tak relevan dengan materi",
        "ya masih relevan dengan materi",
        "ya namun agak kurang relevan",
      ].includes(videoRelevance)
    ) {
      setErrorMessage("Invalid video relevance option.");
      console.log("Error: Invalid video relevance selected");
      toast.error("Invalid video relevance option."); // Toast for invalid option
      return;
    }
  
    const data = {
      materials_id: materialsId,
      users_id: userId,
      relevansi: videoRelevance,
      saran_kritik: feedback,
    };
  
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      console.log("Sending data to API:", data);
  
      const response = await axios.post("http://localhost:8000/feedback", data, {
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      });
  
      console.log("Feedback submitted:", response.data);
      setSuccessMessage("Feedback submitted successfully!");
      toast.success("Feedback submitted successfully!"); // Toast for successful submission
  
      setTimeout(() => navigate("/feedback-success"), 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "There was an error submitting your feedback."
      );
      toast.error("There was an error submitting your feedback!"); // Toast for failure
    }
  };  
  
  return (
    <CourseLayout>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-1/2 justify-center items-center md:block hidden">
          <img
            src={heroImage}
            alt="Feedback illustration"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 bg-white p-6 md:p-12 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-4 text-secondary-dark mt-4">
            Apakah Video masih relevan dengan materi pada Course ini?
          </h3>
          <p className="text-secondary-dark mb-6">Pilih salah satu dengan jujur!</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3 flex flex-col">
              {/* Radio button options */}
              <label className="flex justify-between items-center gap-3 p-4 border rounded-lg cursor-pointer flex-row-reverse">
                <span className="flex-1 text-left text-secondary-dark">Tidak</span>
                <input
                  type="radio"
                  value="tidak"
                  name="relevance"
                  className="hidden"
                  onChange={() => setVideoRelevance("tidak")}
                />
                <span className="w-6 h-6 flex items-center justify-center border rounded-full">
                  {videoRelevance === "tidak" && (
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                  )}
                </span>
              </label>

              <label className="flex justify-between items-center gap-3 p-4 border rounded-lg cursor-pointer flex-row-reverse">
                <span className="flex-1 text-left text-secondary-dark">
                  Tidak, tidak relevan dengan materi
                </span>
                <input
                  type="radio"
                  value="tidak relevan dengan materi"
                  name="relevance"
                  className="hidden"
                  onChange={() =>
                    setVideoRelevance("tidak relevan dengan materi")
                  }
                />
                <span className="w-6 h-6 flex items-center justify-center border rounded-full">
                  {videoRelevance === "tak relevan dengan materi" && (
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                  )}
                </span>
              </label>

              <label className="flex justify-between items-center gap-3 p-4 border rounded-lg cursor-pointer flex-row-reverse">
                <span className="flex-1 text-left text-secondary-dark">
                  Ya, masih relevan dengan materi
                </span>
                <input
                  type="radio"
                  value="ya masih relevan dengan materi"
                  name="relevance"
                  className="hidden"
                  onChange={() =>
                    setVideoRelevance("ya masih relevan dengan materi")
                  }
                />
                <span className="w-6 h-6 flex items-center justify-center border rounded-full">
                  {videoRelevance === "ya masih relevan dengan materi" && (
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                  )}
                </span>
              </label>

              <label className="flex justify-between items-center gap-3 p-4 border rounded-lg cursor-pointer flex-row-reverse">
                <span className="flex-1 text-left text-secondary-dark">
                  Ya, namun agak kurang relevan
                </span>
                <input
                  type="radio"
                  value="ya namun agak kurang relevan"
                  name="relevance"
                  className="hidden"
                  onChange={() =>
                    setVideoRelevance("ya namun agak kurang relevan")
                  }
                />
                <span className="w-6 h-6 flex items-center justify-center border rounded-full">
                  {videoRelevance === "ya namun agak kurang relevan" && (
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                  )}
                </span>
              </label>
            </div>

            <div className="space-y-3">
              <label className="block text-lg font-semibold text-black text-left">
                Masukan saran dan kritik
              </label>
              <textarea
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Masukan feedback anda disini"
                rows="6"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              {feedbackError && (
                <p className="text-red-500 text-sm mt-2">{feedbackError}</p>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-black font-bold rounded-lg w-full md:w-auto"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </CourseLayout>
  );
};

export default FeedbackPage;
