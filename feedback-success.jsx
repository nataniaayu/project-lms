import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; // Import the check circle icon from React Icons
import CourseLayout from "../layout/layout-course";

const FeedbackSuccessPage = ({ materialId }) => {  // Receive materialId as a prop
  const navigate = useNavigate();

  const handleCertificate = () => {
    navigate(`/certificate/${materialId}`);  // Use materialId to navigate
  };

  return (
    <CourseLayout>
      <div className="h-screen flex flex-col items-center justify-start bg-secondary-light px-6 pt-12">
        {/* Outer container for centering */}
        <div className="bg-white shadow-lg rounded-lg py-12 px-8 text-center max-w-3xl w-full">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-secondary-dark mb-4">
            Thank you for your feedback
          </h2>

          {/* Check icon using React Icons */}
          <div className="flex justify-center mb-8">
            <div className="bg-yellow-100 rounded-full p-8">
              <FaCheckCircle className="text-yellow-500 text-5xl" />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-lg text-secondary-dark mb-8">
            Your feedback has been submitted successfully
          </p>

          {/* Return to Course Button */}
          <button
            onClick={handleCertificate}
            className="bg-customYellow1 text-black font-bold text-lg px-8 py-3 rounded-lg hover:bg-customYellow2 transition duration-300"
          >
            Back to Course
          </button>
        </div>
      </div>
    </CourseLayout>
  );
};

export default FeedbackSuccessPage;
