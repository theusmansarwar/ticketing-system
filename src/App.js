import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./pages/chat/Chat.jsx";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="bg-wrapper">
        <div className="circle-container">
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
        <Routes>
          <Route path="/ticket/:ticket_id" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
