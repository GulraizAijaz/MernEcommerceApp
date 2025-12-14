import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { isAuthenticated } from "../auth";

export default function ChatBox({ userId, chatWith }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [socket, setSocket] = useState(null);

  // Initialize socket when component mounts
  useEffect(() => {
    const newSocket = io("http://localhost:8000", {
      transports: ["websocket", "polling"],
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  // Join room after socket is ready
  useEffect(() => {
    if (!socket) return;
    socket.emit("join", userId);

    return () => {
      socket.off("receive_message");
    };
  }, [socket, userId]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, [socket]);

  // Load old messages
  useEffect(() => {
    const token = isAuthenticated()?.token;
    if (!token) return;

    axios
      .get(`http://localhost:8000/api/messages/${userId}/${chatWith}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.log(err));
  }, [userId, chatWith]);

  // Send message
  const sendMessage = () => {
    if (!msg || !socket) return;

    const messageData = { sender: userId, receiver: chatWith, text: msg };
    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setMsg("");
  };

  return (
    <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}>
      <h3>Chat with {chatWith}</h3>
      <div
        style={{
          height: "200px",
          overflowY: "auto",
          border: "1px solid #ddd",
          padding: "5px",
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.sender === userId ? "You" : "Them"}:</b> {m.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
