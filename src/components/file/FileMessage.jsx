import React from "react";
import "./FileMessage.css";
import { FaFileDownload } from "react-icons/fa";
const baseUrl = "https://plutosec.ca/backend/api";
const FileMessage = ({ type, msg }) => {

  const formatFileName = (filename) => {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1) return filename; 

  const name = filename.slice(0, dotIndex);
  const ext = filename.slice(dotIndex);

  if (name.length > 10) {
    return name.slice(0, 10) + "..." + ext;
  }
  return name + ext;
};


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
      <span>{msg?.fileName ? formatFileName(msg.fileName) : "No file name"}</span>
    </div>
  );
};

export default FileMessage;
