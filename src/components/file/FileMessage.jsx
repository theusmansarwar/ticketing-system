import React from "react";
import "./FileMessage.css";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { FaFile} from "react-icons/fa";
const baseUrl = "https://plutosec.ca/backend/api"
const FileMessage = ({ type, file,filename }) => {
  return (
    <div className={`file-message ${type}`}>
      <div className="content">
        <FaFile />
        <span>{filename}</span>
         <a
          href={baseUrl + file} 
          download={file}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IoCloudDownloadOutline style={{cursor:"pointer"}} />
        </a>
        
      </div>
      <p className="time">12:03 PM</p>
    </div>
    
  );
};

export default FileMessage;
