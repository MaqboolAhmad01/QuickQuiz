import { useState } from "react";
import Logo from "../components/logo/Logo";

const uploadedFilesMock = [
  { id: 1, name: "Python Basics.pdf" },
  { id: 2, name: "Asyncio Deep Dive.docx" },
  { id: 3, name: "PostgreSQL Indexing.pdf" },
];

const topicsMock = ["Python", "Asyncio", "Databases", "APIs"];

const QuizLobby = () => {
  const [quizType, setQuizType] = useState(null);
  const [topic, setTopic] = useState("");

  return (
    <div className="h-screen  flex overflow-hidden">

      {/* Side Panel */}
      <aside className="w-80 bg-black/30 backdrop-blur-md text-white flex flex-col">

        {/* Logo */}
        <div className="py-20  ">
          <Logo />
        </div>

        {/* Files */}
        <div className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-sm uppercase tracking-wide text-white/70 mb-4">
            Indexed Files
          </h2>

          <ul className="space-y-3">
            {uploadedFilesMock.map((file) => (
              <li
                key={file.id}
                className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                📄 {file.name}
              </li>
            ))}
          </ul>
        </div>

      </aside>

      {/* Main Area */}
      <main className="flex-1 flex items-center justify-center">

        {/* Modal */}
        <div className="w-full max-w-xl bg-slate-400 rounded-2xl shadow-2xl p-8">

          <h1 className="text-3xl font-semibold text-center mb-6">
            Choose Quiz Type
          </h1>

          {/* Quiz Cards */}
          <div className="space-y-4 mb-6">

            <div
              onClick={() => {
                setQuizType("random");
                setTopic("");
              }}
              className={`p-5 border rounded-xl cursor-pointer transition ${
                quizType === "random"
                  ? "border-[#6A1B5B] bg-[#6A1B5B]/10"
                  : "hover:border-gray-400"
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
                  : "hover:border-gray-400"
              }`}
            >
              <h3 className="text-lg font-semibold">📚 Topic-Based Quiz</h3>
              <p className="text-sm text-gray-600">
                Focused questions by topic
              </p>
            </div>

          </div>

          {/* Topic Selector (natural flow, no hacks) */}
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
                {topicsMock.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CTA */}
          <button
            disabled={!quizType || (quizType === "topic" && !topic)}
            className="w-full py-3 bg-[#6A1B5B] text-white rounded-xl font-semibold disabled:opacity-50"
          >
            Start Quiz
          </button>

        </div>
      </main>
    </div>
  );
};

export default QuizLobby;
