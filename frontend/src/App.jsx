import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OTPSent from "./pages/OTPSent";
import UploadScreen from "./pages/UploadScreen";
import Quiz from "./pages/Quiz";
import QuizLobby from "./pages/QuizSetup";

import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-sent" element={<OTPSent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/upload" element={<UploadScreen />} />
        <Route path="/quiz-setup" element={<QuizLobby />} />
        <Route path="/reset-password" element={<ResetPassword />} />

      </Routes>
    </Router>
  );
}

export default App;
