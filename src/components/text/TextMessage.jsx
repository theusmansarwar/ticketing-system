import React from "react";
import "./TextMessage.css";
import { formatDate } from "../../utils/formatDate";

const TextMessage = ({type, msg}) => {
  return (
    <div className={`text-message ${type}`}>
      <p>
        {msg?.message}
      </p>
      <p className="time">{formatDate(msg?.createdAt)}</p>
    </div>
  );
};

export default TextMessage;
