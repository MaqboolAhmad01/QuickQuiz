import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import React from 'react'
import Quiz from './components/Quiz/quiz'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup/>} />
      </Routes>
      <Routes>
        <Route path="/login" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;
