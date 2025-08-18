import React from "react";
import "./FileMessage.css";
import { FaFileDownload } from "react-icons/fa";

const baseUrl = "https://plutosec.ca/backend/api";

const FileMessage = ({ type, msg }) => {
  // Handle both API files ({fileName, filePath}) and local File objects
  const fileName = msg?.fileName || msg?.name || "No file name";

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
    if (typeof msg?.filePath === "string") {
      // API file (string path)
      const fileUrl = baseUrl + msg.filePath;
      window.open(fileUrl, "_blank");
    } else if (msg?.filePath instanceof File) {
      // Local File object
      const fileUrl = URL.createObjectURL(msg.filePath);
      window.open(fileUrl, "_blank");

      // revoke after delay
      setTimeout(() => URL.revokeObjectURL(fileUrl), 2000);
    }
  };

  return (
    <div
      className={`file-message ${type}`}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <FaFileDownload className="icon" />
      <span>{formatFileName(fileName)}</span>
    </div>
  );
};

export default FileMessage;
