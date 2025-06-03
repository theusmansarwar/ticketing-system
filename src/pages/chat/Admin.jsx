import { useEffect, useRef, useState } from "react";
import "./Chat.css";
import { MdClose } from "react-icons/md";
import FileMessage from "../../components/file/FileMessage";

import { useParams } from "react-router-dom";
import { fetchTicket } from "../../DAL/fetch";
import { formatDate } from "../../utils/formatDate";
import { createMessage } from "../../DAL/create";
import logo from '../../Accets/logo4.png'
const Admin = () => {
  const { ticket_id } = useParams();
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [ticketData, setTicketData] = useState(null);

  const loadTicket = async () => {
    try {
      const res = await fetchTicket(ticket_id);
      console.log("Ticket Data:", res);
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, ticketData]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    fileInputRef.current.value = null;
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() === "" && !selectedFile) return;
    setIsSending(true);
    const formData = new FormData();
    formData.append("TicketId", ticket_id);
    formData.append("senderemail", userEmail);
    formData.append("receiveremail", receiverEmail);
    formData.append("message", messageInput);
    formData.append("receivername", receivername);

    if (selectedFile) {
      formData.append("file", selectedFile);
      formData.append("fileName", selectedFile.name);
    }

    try {
      await createMessage(formData);

      const newMessage = {
        id: Date.now(),
        message: messageInput.trim(),
        senderemail: userEmail,
        file: selectedFile || null,
        fileName: selectedFile?.name || null,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);

      // ✅ Clear both text and file
      setMessageInput("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsSending(false);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src={logo}/>
        <div className="header-left">
          <strong>Ticket#{ticketData?.ticketNO}</strong>
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
                color: ticketData?.status ? "green" : "orange",
                background: ticketData?.status ? "#d4edda" : "#fff3cd",
                padding: "5px 10px",
                minWidth: "100px",
                borderRadius: "6px",
              }}
            >
              {ticketData?.status ? "Answered" : "Pending"}
            </span>
          </p>
          <p>
            <span>Created On: </span>
            {formatDate(ticketData?.createdAt)}
          </p>
        </div>
      </div>

      <div className="chat-area">
        <div className="chat-send-section">
          <textarea
            placeholder="Type your message here..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <div className="file-input">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} />

            {selectedFile && (
              <div className="cancel-btn" onClick={handleRemoveFile}>
                <MdClose />
              </div>
            )}
          </div>

          <div
            className={`send-btn ${isSending ? "disabled" : ""}`}
            onClick={!isSending ? handleSendMessage : undefined}
          >
            {isSending ? "Sending..." : "Send Reply"}
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
                  {msg?.message && <p>{msg.message}</p>}
                  {msg?.file && <FileMessage type={msgType} msg={msg} />}
                </div>
              </div>

              <p className="time">Replied : {formatDate(msg?.createdAt)}</p>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Admin;
