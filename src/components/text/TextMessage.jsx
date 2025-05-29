import React from "react";
import "./TextMessage.css";

const TextMessage = ({type, message}) => {
  return (
    <div className={`text-message ${type}`}>
      <p>
        {message}
      </p>
      <p className="time">12:03 PM</p>
    </div>
  );
};

export default TextMessage;
