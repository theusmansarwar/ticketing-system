import { useEffect, useRef, useState } from "react";
import "./Chat.css";
import { MdClose } from "react-icons/md";
import FileMessage from "../../components/file/FileMessage";
import { FaUpload } from "react-icons/fa6";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { fetchTicket } from "../../DAL/fetch";
import { formatDate } from "../../utils/formatDate";
import { closeTicket, createMessage } from "../../DAL/create";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
const Admin = () => {
  const { ticket_id } = useParams();
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const topRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState("");
  const [selectedFiles, setselectedFiles] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [ticketData, setTicketData] = useState(null);
  const [expandedMessages, setExpandedMessages] = useState({});
  const toggleExpand = (key) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const loadTicket = async () => {
    try {
      const res = await fetchTicket(ticket_id);
      setTicketData(res.ticket);
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
    }
  };

  const userEmail = ticketData?.receiveremail;
  const receiverEmail = ticketData?.clientemail;
  const receivername = ticketData?.clientname;

  const sendername = ticketData?.receivername;

  useEffect(() => {
    loadTicket();
  }, [ticket_id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, ticketData]);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    setselectedFiles((prev) => {
      const totalFiles = prev.length + files.length;

      if (totalFiles > 10) {
        alert("You can only upload a maximum of 10 files.");
        return prev; // don’t add extra files
      }

      return [...prev, ...files];
    });

    // reset input so user can select again
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleRemoveFile = (index) => {
    setselectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    setIsSending(true);
    if (messageInput.trim() === "") {
      setError("Please Write Something");
      setIsSending(false);
    } else {
      const formData = new FormData();
      formData.append("TicketId", ticket_id);
      formData.append("senderemail", userEmail);
      formData.append("receiveremail", receiverEmail);
      formData.append("message", messageInput);
      formData.append("receivername", receivername);

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("files", file); // binary
          // Don’t append "fileNames" separately
        });
      }

      try {
        await createMessage(formData);

        const newMessage = {
          id: Date.now(),
          message: messageInput.trim(),
          senderemail: userEmail,
          files: selectedFiles.map((f) => ({
            fileName: f.name,
            filePath: f, // keep the File object in memory
          })),
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessage]);

        // ✅ Clear both text and file
        setMessageInput("");
        setError("");
        setselectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
      } catch (error) {
        alert("ERROR", error);
        console.error("Error sending message:", error);
        setIsSending(false);
      } finally {
        setIsSending(false);
      }
    }
  };
  const handleCloseTicket = async () => {
    const formData = new FormData();
    formData.append("TicketId", ticket_id);

    setIsClosing(true);
    try {
      const response = await closeTicket(formData);
      setIsClosing(false);
      loadTicket();
    } catch (error) {
      alert("ERROR", error);
      console.error("Error Closing Ticket :", error);
      setIsClosing(false);
    } finally {
      setIsClosing(false);
    }
  };
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

  return (
    <>
      <div className="chat-container">
        <div className="chat-header-area">
          <div ref={topRef} />
          <p className="Heading">Ticket Information</p>
          <div className="chat-header">
            {/* <img src={logo}/> */}
            <div className="header-left">
              <strong>Ticket Number #{ticketData?.ticketNO}</strong>
            </div>
            <div className="header-right">
              <p>
                <span>Contact: </span>
                {ticketData?.clientname}
              </p>
              <p>
                <span>Service: </span>
                {ticketData?.subject}
              </p>
              <p>
                <span>Status: </span>
                <span
                  style={{
                    color: "white",
                   background: ticketData?.isclosed ? "	#ff0000ff" : ticketData?.status ? "blue" : "	#FFBF00",
                    padding: "5px",
                    minWidth: "100px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  {ticketData?.isclosed ? "closed" : ticketData?.status ? "Answered" : "Pending"}
                </span>
              </p>

              <p>
                <span>Created On: </span>
                {formatDate(ticketData?.createdAt)}
              </p>

              <span
                className={`close-ticket-btn ${
                  ticketData?.isclosed ? "disabled" : ""
                }`}
                onClick={handleCloseTicket}
              >
                {ticketData?.isclosed ? "Closed" : "Close this ticket"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="chat-area">
          
          <p className="Heading"> {ticketData?.isclosed ? "This Ticket has been closed" : "Add reply to this ticket"}</p>
          <div className={`chat-send-section ${
                  ticketData?.isclosed ? "disabled2" : ""
                }`}>
            <textarea
              placeholder="Type your message here..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <p className="attach">Attachments</p>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="customFile"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                style={{ display: "none" }}
              />
              <label htmlFor="customFile" className="custom-file-label">
                Choose File <FaUpload />
              </label>
            </div>
            <div className="selected-file-area">
              {selectedFiles.length > 0
                ? selectedFiles.map((f, idx) => (
                    <div key={idx} className="file-preview">
                      <p>{formatFileName(f.name)}</p>
                      <div
                        className="cancel-btn"
                        onClick={() => handleRemoveFile(idx)}
                      >
                        <MdClose />
                      </div>
                    </div>
                  ))
                : ""}
            </div>
            <div className="btn-area">
              <div
                className={`send-btn ${isSending ? "disabled" : ""}`}
                onClick={!isSending ? handleSendMessage : undefined}
              >
                {isSending ? "Sending..." : "Send Reply"}
              </div>
            </div>
          </div>

          {[...(ticketData?.chats || []), ...messages].map((msg, index) => {
            const isSender =
              msg.senderemail === ticketData?.receiveremail ||
              msg.email === ticketData?.clientemail;
            const msgType = isSender ? "sender" : "receiver";

            return (
              <div
                className={`message-wrapper ${msgType}`}
                key={msg._id || msg.id || index}
              >
                <div className="message-area">
                  <p className="sender-name">
                    {isSender ? sendername : receivername}
                  </p>
                  <div className="sender-msg">
                    {msg?.message && (
                      <>
                        <p>
                          {expandedMessages[msg._id || msg.id || index]
                            ? msg.message
                            : msg.message.length > 400
                            ? msg.message.slice(0, 400) + "..."
                            : msg.message}
                        </p>
                        {msg?.files &&
                          msg?.files.map((item) => (
                            <FileMessage type={msgType} msg={item} />
                          ))}
                      </>
                    )}
                  </div>
                </div>
                {msg.message.length > 400 && (
                  <div
                    className={`showmore-btn-area ${
                      isSender
                        ? expandedMessages[msg._id || msg.id || index]
                          ? "expanded"
                          : ""
                        : expandedMessages[msg._id || msg.id || index]
                        ? "expanded"
                        : "closed"
                    }`}
                  >
                    <button
                      onClick={() => toggleExpand(msg._id || msg.id || index)}
                      style={{
                        background: "var(--background-color)",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      {expandedMessages[msg._id || msg.id || index] ? (
                        <div className="dropbtn">
                          Show Less <FaChevronUp />
                        </div>
                      ) : (
                        <div className="dropbtn">
                          Show More <FaChevronDown />
                        </div>
                      )}
                    </button>
                  </div>
                )}

                <p className="time">Replied : {formatDate(msg?.createdAt)}</p>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>
      </div>
      <div className="navigationbtn">
        <div className="top-btn" onClick={scrollToTop}>
          <FaArrowUp />
        </div>
        <div className="bottom-btn" onClick={scrollToBottom}>
          <FaArrowDown />
        </div>
      </div>
      <div className="footer">
        Copyright © 2021-2025 Plutosec.ca All right reserved
      </div>
    </>
  );
};

export default Admin;
