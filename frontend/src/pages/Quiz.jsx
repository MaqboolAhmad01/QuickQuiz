import { useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../components/logo/Logo"; 

const Quiz = () => {
  const location = useLocation();
  const quiz = location.state?.quiz;
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
      setIndex(index + 1);
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-gradient-to-r from-[#2EBA9F] to-[#6A1B5B] rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-semibold text-center mb-6">
          Quick Quiz
        </h1>

        {showScore ? (
          <div className="text-center">
            <h2 className="text-xl  mb-4">
              You scored <span className="font-bold">{score}</span> out of{" "}
              {data.length}
            </h2>
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-[#6A1B5B] text-white rounded-lg "
            >
              Restart Quiz
            </button>
          </div>
        ) : (
          <>
            {/* Progress */}
            <p className="text-sm  mb-2">
              Question {index + 1} of {data.length}
            </p>

            <h2 className="text-lg font-medium mb-6">
              {question.question}
            </h2>

            <ul className="space-y-4">
              {question.options.map((option, i) => {
                let base =
                  "w-full px-4 py-3 border rounded-lg cursor-pointer transition";

                if (selected) {
                  if (option === selected) {
                    base += " bg-[#6A1B5B] text-white border-green-500";
                  }
                } else {
                  base += " hover:bg-[#6A1B5B] hover:text-gray-100";
                }

                return (
                  <li
                    key={i}
                    onClick={() => handleOptionClick(option)}
                    className={base}
                  >
                    {option}
                  </li>
                );
              })}
            </ul>

            <button
              onClick={nextQuestion}
              className="mt-6 w-full py-3 bg-[#6A1B5B] text-white rounded-lg"
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
