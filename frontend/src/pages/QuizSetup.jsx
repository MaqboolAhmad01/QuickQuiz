import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { apiFetch } from "../api/apiClient";

const QuizLobby = () => {
  const [quizType, setQuizType] = useState(null);
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState([]); // ✅ store fetched topics
  const [uiState, setUiState] = useState("idle"); // idle | generating | error
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const file_id = localStorage.getItem("file_id");

  if (!file_id) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white text-lg">
            Quiz data not found. Please upload the file again.
          </p>
        </div>
      </Layout>
    );
  }

  // Fetch topics from API
  const fetchTopics = async () => {
    try {
      const topicsRes = await apiFetch(`/auth/topics-list/${file_id}/`, { method: "GET" });

      if (!topicsRes.ok) {
        throw new Error("Fetching topics failed");
      }

      const topicsData = await topicsRes.json();
      setTopics(topicsData.topics || []); // ✅ store in state
    } catch (err) {
      console.error(err);
      // setErrorMessage(err.message || "Something went wrong");
      // setUiState("error");
    }
  };

  // Call fetchTopics once when component mounts
  useEffect(() => {
    fetchTopics();
  }, []);

  const generateQuiz = async () => {
    setUiState("generating");

    try {
      const quizRes = await apiFetch(`/auth/generate-quiz/${file_id}/`, { method: "GET" });

      if (!quizRes.ok) {
        throw new Error("Quiz generation failed");
      }

      const quizData = await quizRes.json();

      navigate("/quiz", { state: { quiz: quizData } });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Something went wrong");
      setUiState("error");
    }
  };

  const renderActiveLayer = () => {
    switch (uiState) {
      case "generating":
        return (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md text-white">
            <div className="animate-spin h-10 w-10 border-4 border-white/30 border-t-white rounded-full mb-4" />
            <h3 className="text-lg font-semibold">Generating Quiz…</h3>
            <p className="text-sm opacity-80">
              Creating intelligent questions from your document.
            </p>
          </div>
        );

      case "error":
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-6 max-w-sm text-center">
              <h3 className="text-lg font-semibold mb-2">Error</h3>
              <p className="text-sm mb-4">{errorMessage}</p>
              <button
                onClick={() => setUiState("idle")}
                className="px-4 py-2 bg-[#6A1B5B] text-white rounded-lg"
              >
                Retry
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-[#FFFFFFB3] rounded-2xl shadow-2xl p-8">

              <h1 className="text-3xl font-semibold text-center mb-6">
                Choose Quiz Type
              </h1>

              <div className="space-y-4 mb-6">
                <div
                  onClick={() => {
                    setQuizType("random");
                    setTopic("");
                  }}
                  className={`p-5 border rounded-xl cursor-pointer transition ${
                    quizType === "random"
                      ? "border-[#6A1B5B] bg-[#6A1B5B]/10"
                      : "hover:bg-[#6A1B5B]/10"
                  }`}
                >
                  <h3 className="text-lg font-semibold">🎲 Random Quiz</h3>
                  <p className="text-sm text-gray-600">
                    Questions from all indexed files
                  </p>
                </div>

                <div
                  onClick={() => setQuizType("topic")}
                  className={`p-5 border rounded-xl cursor-pointer transition ${
                    quizType === "topic"
                      ? "border-[#6A1B5B] bg-[#6A1B5B]/10"
                      : "hover:bg-[#6A1B5B]/10"
                  }`}
                >
                  <h3 className="text-lg font-semibold">📚 Topic-Based Quiz</h3>
                  <p className="text-sm text-gray-600">
                    Focused questions by topic
                  </p>
                </div>
              </div>

              {quizType === "topic" && (
                <div className="mb-6">
                  <label className="block mb-2 font-medium">
                    Select Topic
                  </label>

                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg"
                  >
                    <option value="">-- Choose topic --</option>
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={generateQuiz}
                disabled={!quizType || (quizType === "topic" && !topic)}
                className="w-full py-3 bg-[#6A1B5B] text-white rounded-xl font-semibold disabled:opacity-50"
              >
                Start Quiz
              </button>
            </div>
          </div>
        );
    }
  };
const name = localStorage.getItem("file_name")
const filesList = [
  { name: name || "Document 1" },
 
];
  return <Layout files={filesList}>{renderActiveLayer()}</Layout>;
};

export default QuizLobby;
