import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import Chat from "./pages/chat/Chat.jsx";
import OtpPage from "./pages/OTP/OtpPage.jsx";
import "./App.css";

function ProtectedChat({ isAuthenticated,onLogout }) {
  const { ticket_id } = useParams();

  if (!isAuthenticated) {
    return <Navigate to={`/authentication/${ticket_id}`} replace />;
  }

  return <Chat onLogout={onLogout}/>;
}

const App = ({ isAuthenticated, onLogout, onLoginSuccess }) => {
  return (
    
      <div className="bg-wrapper">
        <Routes>
          {/* protected route */}
          <Route
            path="/ticket/:ticket_id"
            element={<ProtectedChat isAuthenticated={isAuthenticated} onLogout={onLogout}  />}
          />

          {/* OTP auth route */}
          <Route
            path="/authentication/:ticket_id"
            element={<OtpPage onLoginSuccess={onLoginSuccess}  />}
          />
        </Routes>
      </div>
   
  );
};

export default App;
