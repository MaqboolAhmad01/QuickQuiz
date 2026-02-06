import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Logo from "../components/logo/Logo";

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const name = localStorage.getItem("file_name")
  const filesList = [
    { name: name || "Document 1" },
   
  ];
  const quiz = location.state?.quiz;

  // ✅ guard against refresh / direct access
  if (!quiz || !quiz.quiz) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white text-lg">
            Quiz data not found. Please start the quiz again.
          </p>
        </div>
      </Layout>
    );
  }

  const data = quiz.quiz;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const question = data[index];

  const handleOptionClick = (option) => {
    if (selected) return;

    setSelected(option);
    if (option === question.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (!selected) return;

    if (index === data.length - 1) {
      setShowScore(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const resetQuiz = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setShowScore(false);
  };

  return (
    
    <Layout files={filesList}>  
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-2xl bg-[#FFFFFFB3] rounded-xl shadow-lg p-8">

          <h1 className="text-4xl text-black font-semibold text-center mb-6">
            Quick Quiz
          </h1>
          

          {showScore ? (
            <div className="text-center">
              <h2 className="text-xl mb-4">
                You scored <span className="font-bold">{score}</span> out of {data.length}
              </h2>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-black/30 rounded-lg"
              >
                Restart Quiz
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm mb-2 text-black ">
                Question {index + 1} of {data.length}
              </p>

              <h2 className="text-lg  text-black font-medium mb-6"> 
                {question.question}
              </h2>

              <ul className="space-y-4">
                {question.options.map((option, i) => (
                    <li
                      key={i}
                      onClick={() => handleOptionClick(option)}
                      className={`w-full   px-4 py-3 border border-black rounded-lg cursor-pointer transition 
                        ${
                          selected
                            ? option === selected   
                              ? "bg-[#6A1B5B] text-white"
                              : "opacity-50"
                            : "  hover:text-white hover:bg-[#6A1B5B]"
                        }
                      `} 
                    >
                      {option}
                    </li>
                ))}
              </ul>

              <button
                onClick={nextQuestion}
                className="mt-6 w-full py-3 bg-[#6A1B5B] rounded-lg disabled:opacity-50 text-white font-medium"
                disabled={!selected}
              >
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Quiz;
