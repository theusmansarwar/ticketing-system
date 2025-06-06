import React from "react";
import "./FileMessage.css";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { FaFile } from "react-icons/fa";
import { formatDate } from "../../utils/formatDate";
const baseUrl = "https://plutosec.ca/backend/api";
const FileMessage = ({ type, msg }) => {
  return (
    <div className={`file-message ${type}`}>
      <FaFile />
      <span>{msg?.fileName}</span>
      <a
        href={
          typeof msg?.file === "string"
            ? baseUrl + msg.file
            : URL.createObjectURL(msg.file)
        }
        download={msg?.fileName}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IoCloudDownloadOutline style={{ cursor: "pointer" }} />
      </a>
    </div>
  );
};

export default FileMessage;
