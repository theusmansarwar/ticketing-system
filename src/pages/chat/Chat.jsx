import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import { MdClose, MdSend } from "react-icons/md";
import TextMessage from "../../components/text/TextMessage";
import FileMessage from "../../components/file/FileMessage";
import { IoMdAdd } from "react-icons/io";
import { useParams } from "react-router-dom";
import { fetchTicket } from "../../DAL/fetch";
import { formatDate } from "../../utils/formatDate";
import { createMessage } from "../../DAL/create";

const Chat = () => {
  const { ticket_id } = useParams();
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

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

  const userEmail = ticketData?.clientemail;
  const receiverEmail = ticketData?.receiveremail;

  useEffect(() => {
    loadTicket();
  }, [ticket_id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, ticketData]);

  const handleAddClick = () => {
    fileInputRef.current.click();
  };

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
    if (messageInput.trim() === "") return;

    const formData = new FormData();
    formData.append("TicketId", ticket_id);
    formData.append("senderemail", userEmail);
    formData.append("receiveremail", receiverEmail);
    formData.append("message", messageInput.trim());

    try {
      await createMessage(formData);

      const newMessage = {
        id: Date.now(),
        message: messageInput.trim(),
        senderemail: userEmail,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSendFile = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("TicketId", ticket_id);
    formData.append("senderemail", userEmail);
    formData.append("receiveremail", receiverEmail);
    formData.append("file", selectedFile);
    formData.append("fileName", selectedFile.name);

    try {
      await createMessage(formData);

      const newMessage = {
        id: Date.now(),
        file: selectedFile,
        fileName: selectedFile.name,
        senderemail: userEmail,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setSelectedFile(null);
      fileInputRef.current.value = null;
    } catch (error) {
      console.error("Error sending file:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <strong>Ticket#{ticketData?.ticketNO}</strong>
        </div>
        <div className="header-right">
          <p>
            <span>Name: </span>
            {ticketData?.receivername}
          </p>
          <p>
            <span>Subject: </span>
            {ticketData?.subject}
          </p>
          <p>
            <span>Created At: </span>
            {formatDate(ticketData?.createdAt)}
          </p>
        </div>
      </div>

      {selectedFile && (
        <div className="file-modal-overlay">
          <div className="file-modal">
            <MdClose className="close-icon" onClick={handleRemoveFile} />
            <p>Are you sure you want to send this file?</p>
            <p className="file-name">{selectedFile.name}</p>
            <button className="send-btn" onClick={handleSendFile}>
              Send
            </button>
          </div>
        </div>
      )}

      <div className="chat-mid">
        {[...(ticketData?.chats || []), ...messages].map((msg, index) => {
          const isSender =
            msg.senderemail === ticketData?.clientemail ||
            msg.email === ticketData?.clientemail;
          const msgType = isSender ? "sender" : "receiver";

          return (
            <div
              className={`message-wrapper ${msgType}`}
              key={msg._id || msg.id || index}
            >
              {msg.file ? (
                <FileMessage type={msgType} msg={msg} />
              ) : (
                <TextMessage type={msgType} msg={msg} />
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-footer">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <div className="footer-left" onClick={handleAddClick}>
          <IoMdAdd />
        </div>
        <input
          type="text"
          placeholder="Type your message here..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <div className="footer-right" onClick={handleSendMessage}>
          <MdSend />
        </div>
      </div>
    </div>
  );
};

export default Chat;
