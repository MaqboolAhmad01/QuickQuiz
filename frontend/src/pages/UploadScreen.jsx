import Logo from "../components/logo/Logo";
import "./UploadScreen.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/apiClient";
import Layout from "../components/Layout";

const UploadScreen = () => {
  const [file, setFile] = useState(null);
  const [uiState, setUiState] = useState("idle"); // idle | uploading | generating | error
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Full multi-step flow: Upload → Generate Quiz
  const startQuizFlow = async () => {
    if (!file) return;

    try {
      // STEP 1: Upload
      setUiState("uploading");
      setErrorMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await apiFetch("auth/upload/", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("File upload failed");

      const { id: fileId, name: fileName } = await uploadRes.json();
      localStorage.setItem("file_id", fileId);
      localStorage.setItem("file_name", fileName);
      // STEP 2: Generate Quiz
     

      navigate(`/quiz-setup/`,{state: {
        file_id: fileId
      }
    });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Something went wrong");
      setUiState("error");
    }
  };

  // Render layer based on UI state
  const renderActiveLayer = () => {
    switch (uiState) {
      case "uploading":
        return (
          <div className="spinner-overlay">
            <div className="spinner upload-spinner" />
            <h3>Uploading your file…</h3>
            <p>Hold tight, we are preparing your document.</p>
          </div>
        );

      case "generating":
        return (
          <div className="spinner-overlay">
            <div className="spinner generate-spinner" />
            <h3>Generating Quiz…</h3>
            <p>Creating intelligent questions from your document.</p>
          </div>
        );

      case "error":
        return (
          <div className="upload-overlay">
            <div className="upload-dialog">
              <h3>Error</h3>
              <p>{errorMessage}</p>
              <button
                className="btn-upload"
                onClick={() => setUiState("idle")}
              >
                Retry
              </button>
            </div>
          </div>
        );

      default: // idle
        return (
          <div className="upload-overlay">
            <div className="upload-dialog">
              <h3>Upload File</h3>

              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />

              <p>Supported formats: PDF, Word</p>

              <button
                onClick={startQuizFlow}
                className="btn-upload"
                disabled={!file}
              >
                Quiz it
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="upload-page">
      <Layout />
      {renderActiveLayer()}
    </div>
  );
};

export default UploadScreen;
