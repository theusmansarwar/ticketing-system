import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./pages/chat/Chat.jsx";
import "./App.css";
import Admin from "./pages/chat/Admin.jsx";

const App = () => {
  return (
    <Router>
      <div className="bg-wrapper">
      
        <Routes>
          <Route path="/ticket/:ticket_id" element={<Chat />} />
           <Route path="/ticketviewbyadmin/:ticket_id" element={<Admin />} />
        </Routes>
        
      </div>
      
    </Router>
  );
};

export default App;
