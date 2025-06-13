import React from "react";
import "./FileMessage.css";
import { FaFileDownload } from "react-icons/fa";
const baseUrl = "https://plutosec.ca/backend/api";
const FileMessage = ({ type, msg }) => {
  const handleClick = () => {
    const fileUrl =
      typeof msg?.file === "string"
        ? baseUrl + msg.file
        : URL.createObjectURL(msg.file);

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = msg?.fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (typeof msg?.file !== "string") {
      URL.revokeObjectURL(fileUrl);
    }
  };

  return (
    <div
      className={`file-message ${type}`}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <FaFileDownload className="icon" />
      <span>{msg?.fileName}</span>
    </div>
  );
};

export default FileMessage;
