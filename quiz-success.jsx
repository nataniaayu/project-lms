import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; // Import the check circle icon from React Icons
import CourseLayout from "../layout/layout-course";

const QuizSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the score passed via navigate
  const score = location.state?.score || 0;
  
  // Calculate the score on a scale of 100 (if not already done in the previous page)
  const maxScore = location.state?.maxScore || 100;
  const percentageScore = (score / maxScore) * 100;

  const handleFeedbackClick = () => {
    navigate("/feedback");
  };

  return (
    <CourseLayout>
      <div className="h-screen flex flex-col items-center justify-start bg-secondary-light px-6 pt-12">
        {/* Outer container for centering */}
        <div className="bg-white shadow-lg rounded-lg py-12 px-8 text-center max-w-3xl w-full">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-secondary-dark mb-4">
            Thank you for completing the quiz
          </h2>

          {/* Check icon using React Icons */}
          <div className="flex justify-center mb-8">
            <div className="bg-yellow-100 rounded-full p-8">
              {/* Adjust the color to match the original design */}
              <FaCheckCircle className="text-yellow-500 text-5xl" />
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-lg text-secondary-dark mb-8">
            Help us improve our services by providing feedback
          </p>

          {/* Display score */}
          <p className="text-xl font-bold text-green-600 mb-8">
            Your Score: {score} / {maxScore} ({percentageScore.toFixed(2)}%)
          </p>

          {/* Feedback Button */}
          <button
            onClick={handleFeedbackClick}
            className="bg-customYellow1 text-black font-bold text-lg px-8 py-3 rounded-lg hover:bg-customYellow2 transition duration-300"
          >
            Give Feedback
          </button>
        </div>
      </div>
    </CourseLayout>
  );
};

export default QuizSuccess;
