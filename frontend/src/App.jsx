import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
// import ResetPassword from "./pages/ResetPassword";
import OTPSent from "./pages/OTPSent";



import React from 'react'
import Quiz from './components/Quiz/quiz'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup/>} />
      </Routes>

      <Routes>
        <Route path="/otp-sent" element={<OTPSent/>} />
      </Routes>
      
      {/* <Routes>
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes> */}


      <Routes>
        <Route path="/login" element={<Login/>} />
      </Routes>

      <Routes>
        <Route path="/quiz" element={<Quiz/>} />
      </Routes>
    </Router>
  );
}

export default App;
