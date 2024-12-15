import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseLayout from "../layout/layout-course";
import { useNavigate } from "react-router-dom";

const QuizPage = () => {
    const [quiz, setQuiz] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);

    const materialsId = localStorage.getItem("material_id");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/materials/${materialsId}/quiz`,
                    {
                        headers: {
                            token: token,
                        },
                    }
                );
                setQuiz(response.data);
                setLoading(false);
    
                // Store the quiz ID in localStorage
                localStorage.setItem('quiz_id', response.data.id);  // Store quiz ID
            } catch (err) {
                console.error("Error fetching quiz:", err);
                setError("Failed to load quiz data");
                setLoading(false);
            }
        };
    
        if (materialsId) fetchQuizData();
        else setError("Material ID not found");
    }, [materialsId, token]);
    

    const handleOptionChange = (optionId) => {
        setSelectedAnswer(optionId);
    };

    const handleNextQuestion = () => {
        setUserAnswers((prevAnswers) => [
            ...prevAnswers,
            selectedAnswer,
        ]);

        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null); // Reset selected answer for the next question
        }
    };

    const handleQuizSubmit = () => {
        let calculatedScore = 0;
        // Compare each user's answer with the correct answer
        quiz.forEach((question, index) => {
            if (userAnswers[index] === question.correct_answer) {
                calculatedScore++;
            }
        });

        // Calculate the final score as a percentage
        const finalScore = (calculatedScore / quiz.length) * 100;
        setScore(finalScore);
        navigate("/quiz-success", { state: { score: finalScore } });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const currentQuestion = quiz[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.length - 1;
    const isAnswerSelected = selectedAnswer !== null;

    return (
        <CourseLayout>
            <div className="container mx-auto mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bagian Pertanyaan */}
                    <div className="border border-yellow-500 p-6 rounded shadow-md">
                        <h2 className="text-center text-xl font-bold text-yellow-500 underline">
                            Pertanyaan
                        </h2>
                        <div className="mt-4 p-4 border border-yellow-400 rounded-md shadow">
                            <p className="text-black text-2xl font-semibold">
                                {currentQuestion.pertanyaan || "Loading question..."}
                            </p>
                        </div>
                    </div>

                    {/* Bagian Jawaban */}
                    <div className="border border-yellow-500 p-6 rounded shadow-md">
                        <h2 className="text-center text-xl font-bold text-yellow-500 underline">
                            Jawaban
                        </h2>
                        <div className="mt-4 p-4 border border-yellow-400 rounded-md shadow">
                            {currentQuestion.options?.map((option) => (
                                <div
                                    key={option.id}
                                    className="border-b border-gray-300 py-2"
                                >
                                    <label
                                        htmlFor={`option-${option.id}`}
                                        className="flex items-center text-left cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="answer"
                                            value={option.id}
                                            id={`option-${option.id}`}
                                            checked={selectedAnswer === option.id}
                                            onChange={() =>
                                                handleOptionChange(option.id)
                                            }
                                            className="mr-2"
                                        />
                                        <span className="text-black">
                                            {option.teks_jawaban}
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tombol Navigasi */}
                <div className="mt-6 text-right">
                    {isLastQuestion ? (
                        <button
                            onClick={handleQuizSubmit}
                            className={`bg-yellow-500 text-black font-bold px-6 py-2 rounded shadow hover:bg-yellow-600 ${
                                !isAnswerSelected &&
                                "opacity-50 cursor-not-allowed"
                            }`}
                            disabled={!isAnswerSelected}
                        >
                            Submit Quiz
                        </button>
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            className={`bg-yellow-500 text-black px-6 py-2 rounded shadow hover:bg-yellow-600 ${
                                !isAnswerSelected &&
                                "opacity-50 cursor-not-allowed"
                            }`}
                            disabled={!isAnswerSelected}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </CourseLayout>
    );
};

export default QuizPage;


