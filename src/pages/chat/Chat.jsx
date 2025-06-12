import { useEffect, useRef, useState } from "react";
import "./Chat.css";
import { MdClose } from "react-icons/md";
import FileMessage from "../../components/file/FileMessage";
import { useParams } from "react-router-dom";
import { fetchTicket } from "../../DAL/fetch";
import { formatDate } from "../../utils/formatDate";
import { createMessage } from "../../DAL/create";
import logo from "../../Accets/logo4.png";
import { FaArrowUp, FaArrowDown  } from "react-icons/fa6";
const Chat = () => {
  const { ticket_id } = useParams();
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
    const topRef = useRef(null);
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

  const userEmail = ticketData?.clientemail;
  const receiverEmail = ticketData?.receiveremail;
  const receivername = ticketData?.receivername;
  const sendername = ticketData?.clientname;

  useEffect(() => {
    loadTicket();
  }, [ticket_id]);

  useEffect(() => {
  scrollToBottom();
  }, [messages, ticketData]);


    const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
  const firstSenderIndex = [
    ...(ticketData?.chats || []),
    ...messages,
  ].findIndex((msg) => msg.senderemail === ticketData?.clientemail);

  return (
    <>
    <div className="chat-container">

      <div className="chat-header-area">
           <div ref={topRef} />
        <p className="Heading">Ticket Information</p>
        <div className="chat-header">
          <img src={logo} />
          <div className="header-left">
            <strong>#{ticketData?.ticketNO}</strong>
          </div>
          <div className="header-right">
            <p>
              <span>Contact: </span>
              {ticketData?.receivername}
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
      </div>
      <div className="chat-area">
     
        <p className="Heading">Add reply to this ticket</p>
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
            msg.senderemail === ticketData?.clientemail ||
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

              <p className="time">
                {" "}
                {isSender && index === firstSenderIndex
                  ? "Sent: "
                  : "Replied :"}{" "}
                {formatDate(msg?.createdAt)}
              </p>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>
    </div>
    <div className="navigationbtn">
    <div className="top-btn" onClick={scrollToTop}><FaArrowUp/></div>
    <div className="bottom-btn" onClick={scrollToBottom}><FaArrowDown /></div>
    </div>
     <div className="footer">Copyright © 2021-2025 Plutosec.ca All right reserved</div>
     </>
  );
};

export default Chat;
