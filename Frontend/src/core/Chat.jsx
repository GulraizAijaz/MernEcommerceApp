import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { isAuthenticated } from "../auth";
import { getAllUsersPublic } from "./apiCore";

export default function ChatPage() {
  const user = isAuthenticated()?.user;
  const userId = user?._id;
  const userName = user?.name;
  const token = isAuthenticated()?.token; // JWT token

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [msg, setMsg] = useState("");
  const [toUserId, setToUserId] = useState(null);
  const [unreadCount, setUnreadCount] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!userId) return;
    getAllUsersPublic(userId)
      .then((data) => {
        Array.isArray(data) ? setUsers(data) : setUsers([]);
        setErrors(prev => ({ ...prev, usersError: false }));
      })
      .catch(() => setUsers([]));
  }, [userId]);

  // INIT SOCKET
  useEffect(() => {
    if (!userId || !userName || !token) return;
    const socket = io(process.env.REACT_APP_API_URL2, {
      auth: { token },
      transports: ["websocket", "polling"]
    });

    socketRef.current = socket;

    socket.on("connect", () => {

      // If a chat is already opened, reload it immediately
      if (toUserId) {
        socket.emit("load chat", { withUserId: toUserId });
      }
    });
    
    socket.on("private message", (data) => {
      const sender = data.fromUserId;
      const recipient = data.toUserId;

      // If message is in currently opened chat
      if (toUserId && (sender === toUserId || recipient === toUserId)) {
        setMsgs((prev) => [...prev, data]);
        scrollToBottom();
        setUnreadCount((prev) => ({ ...prev, [sender]: 0 }));
      } 
      // Message sent by me
      else if (sender === userId) {
        setMsgs((prev) => [...prev, data]);
        scrollToBottom();
      } 
      // Message from other users → increment unread
      else {
        setUnreadCount((prev) => ({ ...prev, [sender]: (prev[sender] || 0) + 1 }));
      }
    });


    // ===== LOAD CHAT HISTORY =====
    socket.on("chat history", (messages) => {
      setMsgs(messages || []);
      scrollToBottom();
      focusInput()
    });

    // ===== ONLINE USERS =====
    socket.on("online users", (list) => {
      setOnlineUsers(new Set(list));
    });

    // ===== UNREAD COUNTS =====
    socket.on("unread counts", (counts) => {
      if (!counts) return;

      // Keep 0 for currently open chat
      if (toUserId) counts[toUserId] = 0;

      setUnreadCount(counts);
    });


    // ===== MESSAGE EDITED =====
    socket.on("message edited", (data) => {
      setMsgs((prev) => prev.map((m) => (m._id === data._id ? data : m)));
    });

    // ===== MESSAGE DELETED =====
    socket.on("message deleted", (data) => {
      setMsgs((prev) => prev.map((m) => (m._id === data._id ? data : m)));
    });

    // return () => {
    //   socket.disconnect();
    //   socketRef.current = null;
    // };
    return () => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
      }
      socketRef.current = null;
    };
  }, [userId, userName, token, toUserId]);

  // SEND MESSAGE
  const sendMessage = () => {
    if (!msg || !toUserId || !socketRef.current) return;

    socketRef.current.emit("private message", {
      toUserId,
      message: msg // use msg state
    });

    setMsg("");
  };

  // OPEN CHAT FIXED
  const openChat = (id) => {
    setToUserId(id);
    setMsgs([]);
    // Reset unread count immediately when opening chat
    setUnreadCount((prev) => ({ ...prev, [id]: 0 }));

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("load chat", { withUserId: id });
    }
  };


  const closeChat = () => {
    setToUserId(null);
    setMsgs([]);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // EDIT MESSAGE
  const editMessage = (index) => {
    const message = msgs[index];
    if (!message) return;

    // Frontend check: only allow editing your own messages
    if (message.fromUserId !== userId) {
      alert("You can edit only your own message");
      return;
    }

    const newText = prompt("Edit your message:", message.message);
    if (!newText) return;

    // Emit edit request to backend
    if (socketRef.current && toUserId) {
      socketRef.current.emit("message edited", {
        messageId: message._id,
        toUserId,
        newText
      });
    }
  };


  // DELETE MESSAGE
  const deleteMessage = (index) => {
    const message = msgs[index];
    if (!message) return;

    // Frontend check: only allow deleting your own messages
    if (message.fromUserId !== userId) {
      alert("You can delete only your own message");
      return;
    }

    // Emit delete request to backend
    if (socketRef.current && toUserId) {
      socketRef.current.emit("message deleted", {
        messageId: message._id,
        toUserId
      });
    }
  };


  const getName = (id) => users.find((u) => u._id === id)?.name || "Unknown";

  const sortedUsers = [...users].sort((a, b) => {
    const aOnline = onlineUsers.has(a._id) ? 1 : 0;
    const bOnline = onlineUsers.has(b._id) ? 1 : 0;
    return bOnline - aOnline;
  });

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat Page</h2>
      <h2>Your Name: {userName}</h2>

      <div style={{ display: "flex", gap: 20 }}>
        {/* Users List */}
        <div style={{ width: 220 }}>
          <h4>Users</h4>
          {errors.usersError ? (
            <h2>Users not found</h2>
          ) : (
            <div style={{ border: "1px solid #ddd", borderRadius: 6, padding: 10, maxHeight: 360, overflowY: "auto" }}>
              {sortedUsers.map((u) => {
                const unread = unreadCount[u._id] || 0;
                return (
                  <div
                    key={u._id}
                    onClick={() => openChat(u._id)}
                    style={{
                      padding: 8,
                      marginBottom: 6,
                      borderRadius: 6,
                      background: toUserId === u._id ? "#eef" : "#fafafa",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: onlineUsers.has(u._id) ? "rgba(46, 252, 49, 1)" : "#e6e6e6ff"
                        }}
                      ></span>
                      {u.name}
                    </div>

                    {unread > 0 && (
                      <span style={{ background: "red", color: "#fff", padding: "2px 6px", borderRadius: "50%", fontSize: 12 }}>
                        {unread}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat panel */}
        <div style={{ flex: 1 }}>
          <h4>{toUserId ? `Chat with ${getName(toUserId)}` : "Select a user"}</h4>

          {toUserId && <button onClick={closeChat}>Close</button>}

          <div style={{ border: "1px solid #ddd", borderRadius: 6, padding: 10, minHeight: 260, maxHeight: 420, overflowY: "auto" }}>
            {msgs.map((m, i) => {
            
              const time = new Date(m.createdAt).toLocaleString('en-US', {
                                          year: '2-digit',
                                          month: 'numeric',
                                          day: 'numeric',
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true
                                        });
              const timeUpdated = new Date(m.updatedAt).toLocaleString('en-US', {
                                          year: '2-digit',
                                          month: 'numeric',
                                          day: 'numeric',
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true
                                        });


            return (  
              <div key={i} style={{ textAlign: m.fromUserId === userId ? "right" : "left", marginBottom: 8 }}>
                <div style={{ display: "inline-block", background: m.fromUserId === userId ? "#d1ffd6" : "#fff", padding: "8px 10px", borderRadius: 6, border: "1px solid #eee" }}>
                  <strong>{m.fromUserId === userId ? "You" : m.fromUsername}</strong>
                  <br />
                  {
                  m.deleted 
                  ? 
                  <i style={{ color: "#999" }}>This message was deleted</i>
                  :
                   m.message
                   }

                  {
                  m.fromUserId === userId && 
                  !m.deleted && (
                    <div style={{ marginTop: 4, fontSize: 12 }}>
                      <span onClick={() => editMessage(i)} style={{ color: "blue", cursor: "pointer", marginRight: 6 }}>
                        Edit
                      </span>
                      <span onClick={() => deleteMessage(i)} style={{ color: "red", cursor: "pointer" }}>
                        Delete
                      </span>
                    </div>
                  )}
                  {/* edited tag / time etc */}
                    <div style={{ marginTop: 4, fontSize: 12,display:'flex' }}>
                    {m.edited &&
                    (
                      <span style={{ color: "#5d5d5d", cursor: "pointer" }}>
                        Edited : {timeUpdated}
                      </span>
                    )
                    }
                    {
                      m.createdAt &&
                      (
                      <span style={{display:'flex',marginLeft:'auto'}}>
                        {time}
                      </span>
                      )
                    }
                    
                    </div>
                  
                </div>
              </div>
            )
            })}

            <div ref={messagesEndRef}></div>
          </div>

          {toUserId && (
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <input
                value={msg}
                ref={inputRef}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
              />
              <button onClick={sendMessage} disabled={!msg} style={{ padding: "8px 12px" }}>
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 