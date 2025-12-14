// import { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import { isAuthenticated } from "../auth";
// import { getAllUsersPublic } from "./apiCore";

// export default function ChatPage() {
//   const user = isAuthenticated()?.user;
//   const userId = user?._id;
//   const userName = user?.name;

//   const socketRef = useRef(null); // stable ref for socket
//   const [users, setUsers] = useState([]);
//   const [msgs, setMsgs] = useState([]);
//   const [msg, setMsg] = useState("");
//   const [toUserId, setToUserId] = useState("");
  

//   // Load users when auth ready
//   useEffect(() => {
//     if (!userId) return;
//     getAllUsersPublic(userId)
//       .then((u) => {
//          if (Array.isArray(u)) {
//             setUsers(u);
//           } else {
//             // If u is an error object or not an array
//             console.error('API returned error or invalid data', u);
//             setUsers([]);
//           }
//       })
//       .catch(() => setUsers([]));
//   }, [userId]);

//   // Init socket after we have userId
// useEffect(() => {
//   if (!userId || !userName) return;

//   const s = io("http://localhost:8000", { transports: ["websocket", "polling"] });
//   socketRef.current = s;

//   // register once
//   s.emit("register", { userId, username: userName });

//   // --- attach listeners only once ---
//   s.once("connect", () => {
//     s.on("private message", (data) => {
//       setMsgs((prev) => [...prev, data]);
//     });

//     s.on("chat history", (messages) => {
//       setMsgs(messages || []);
//     });
//   });

//   return () => {
//     s.off("private message");
//     s.off("chat history");
//     s.disconnect();
//     socketRef.current = null;
//   };
// }, [userId, userName]);


//   // Send message (emits and also append locally)
// // fixed sendMessage
// const sendMessage = () => {
//   if (!msg || !toUserId || !socketRef.current) return;

//   // emit to server only
//   socketRef.current.emit("private message", { toUserId, message: msg });
//   setMsg(""); // no local append
// };

//   // Select user and request history
//   const openChat = (id) => {
//     setToUserId(id);
//     setMsgs([]);
//     const s = socketRef.current;
//     s?.emit("load chat", { withUserId: id });
//   };

//   const getName = (id) => users.find((u) => u._id === id)?.name || "Unknown";

//   return (
//     <div style={{ padding: 20, fontFamily: "system-ui, Arial" }}>
//       <h2>Chat Page</h2>

//       {userName ? <h3>Your name: {userName}</h3> : <h3>Please sign in</h3>}

//       <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
//         {/* Users list */}
//         <div style={{ width: 220 }}>
//           <h4>Users</h4>
//           <div style={{ border: "1px solid #ddd", borderRadius: 6, padding: 8, maxHeight: 360, overflowY: "auto" }}>
//             {users.length === 0 && <div style={{ color: "#666" }}>No users</div>}
//             {users.length > 0 && users.map((u) => (
//               <div
//                 key={u._id}
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   padding: "6px 8px",
//                   marginBottom: 6,
//                   background: toUserId === u._id ? "#eef" : "#f9f9f9",
//                   borderRadius: 6,
//                 }}
//               >
//                 <div>{u.name}</div>
//                 <button onClick={() => openChat(u._id)}>Chat</button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Chat area */}
//         <div style={{ flex: 1 }}>
//           <h4>{toUserId ? `Chat with ${getName(toUserId)}` : "Select a user to start"}</h4>

//           <div style={{ border: "1px solid #ddd", borderRadius: 6, padding: 10, minHeight: 240, maxHeight: 420, overflowY: "auto" }}>
//             {Array.isArray(msgs) && msgs.length === 0 && <div style={{ color: "#666" }}>No messages</div>}
//             {msgs.map((m, i) => (
//               <div
//                 key={i}
//                 style={{
//                   display: "block",
//                   textAlign: m.fromUserId === userId ? "right" : "left",
//                   margin: "6px 0",
//                 }}
//               >
//                 <div style={{ display: "inline-block", padding: "8px 10px", borderRadius: 8, background: m.fromUserId === userId ? "#d1ffd6" : "#fff", border: "1px solid #eee", maxWidth: "80%" }}>
//                   <div style={{ fontSize: 12, color: "#333", marginBottom: 4 }}>
//                     <strong>{m.fromUserId === userId ? "You" : m.fromUsername}</strong>
//                   </div>
//                   <div>{m.message}</div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* input */}
//           <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
//             <input
//               value={msg}
//               onChange={(e) => setMsg(e.target.value)}
//               placeholder={toUserId ? "Type a message..." : "Select a user first"}
//               style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: "1px solid #ccc" }}
//               disabled={!toUserId}
//               onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
//             />
//             <button onClick={sendMessage} disabled={!toUserId || !msg} style={{ padding: "8px 12px" }}>
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { isAuthenticated } from "../auth";
import { getAllUsersPublic } from "./apiCore";

export default function ChatPage() {
  const user = isAuthenticated()?.user;
  const tokenAuth = isAuthenticated()?.token;
  const userId = user?._id;
  const userName = user?.name;

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

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
        Array.isArray(data) ? setUsers(data) : setUsers([])
        setErrors(prev => ({
          ...prev,
          usersError: false
        }));
      })
      .catch(() =>{ 
        setUsers([])
      });
  }, [userId]);

  // INIT SOCKET
  useEffect(() => {
    if (!userId || !userName) return;

    const socket = io("http://localhost:8000", {
      auth: { token: tokenAuth },
      transports: ["websocket", "polling"]
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("register", { userId, username: userName });

      // FIX: If a chat was already opened, reload it immediately
      if (toUserId) {
        socket.emit("load chat", { withUserId: toUserId });
      }
    });

    // ===== PRIVATE MESSAGE FIXED =====
    socket.on("private message", (data) => {
      const sender = data.fromUserId;

      // If chat is open with that sender → append to messages
      if (toUserId && sender === toUserId) {
        setMsgs((prev) => [...prev, data]);
        scrollToBottom();
      } 
      // If we sent the message (sender = our ID)
      else if (sender === userId) {
        setMsgs((prev) => [...prev, data]);
        scrollToBottom();
      }
      else {
        // Message from someone else not currently opened → increase unread
        setUnreadCount((prev) => ({
          ...prev,
          [sender]: (prev[sender] || 0) + 1
        }));
      }
    });

    // ===== LOAD CHAT HISTORY FIXED =====
    socket.on("chat history", (messages) => {
      setMsgs(messages || []);
      scrollToBottom();
    });

    // ===== ONLINE USERS =====
    socket.on("online users", (list) => {
      setOnlineUsers(new Set(list));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, userName, toUserId]);


  // SEND MESSAGE FIXED
  const sendMessage = () => {
    if (!msg || !toUserId || !socketRef.current) return;

    socketRef.current.emit("private message", {
      toUserId,
      message: msg
    });

    // message appears instantly (backend also echoes it)
    setMsg("");
  };


  // OPEN CHAT FIXED
  const openChat = (id) => {
    setToUserId(id);
    setMsgs([]);
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

  // Dummy edit + delete
  const editMessage = (index) => {
    const newText = prompt("Edit your message:", msgs[index]?.message);
    if (!newText) return;
    setMsgs((prev) => {
      const updated = [...prev];
      updated[index].message = newText;
      updated[index].edited = true;
      return updated;
    });
  };

  const deleteMessage = (index) => {
    setMsgs((prev) => {
      const updated = [...prev];
      updated[index].deleted = true;
      return updated;
    });
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
          {errors.usersError ?
            <h2>
              Users not found
            </h2>
            : 
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
                    <span style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: onlineUsers.has(u._id) ? "rgba(46, 252, 49, 1)" : "#e6e6e6ff"
                    }}></span>
                    {u.name}
                  </div>

                  {unread > 0 && (
                    <span style={{
                      background: "red",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: "50%",
                      fontSize: 12
                    }}>
                      {unread}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          }
        </div>

        {/* Chat panel */}
        <div style={{ flex: 1 }}>
          <h4>{toUserId ? `Chat with ${getName(toUserId)}` : "Select a user"}</h4>

          {toUserId && <button onClick={closeChat}>Close</button>}

          <div style={{ border: "1px solid #ddd", borderRadius: 6, padding: 10, minHeight: 260, maxHeight: 420, overflowY: "auto" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ textAlign: m.fromUserId === userId ? "right" : "left", marginBottom: 8 }}>
                <div style={{
                  display: "inline-block",
                  background: m.fromUserId === userId ? "#d1ffd6" : "#fff",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #eee"
                }}>
                  <strong>{m.fromUserId === userId ? "You" : m.fromUsername}</strong>
                  <br />
                  {m.deleted ? (
                    <i style={{ color: "#999" }}>This message was deleted</i>
                  ) : (
                    m.message
                  )}

                  {m.fromUserId === userId && !m.deleted && (
                    <div style={{ marginTop: 4, fontSize: 12 }}>
                      <span onClick={() => editMessage(i)} style={{ color: "blue", cursor: "pointer", marginRight: 6 }}>
                        Edit
                      </span>
                      <span onClick={() => deleteMessage(i)} style={{ color: "red", cursor: "pointer" }}>
                        Delete
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef}></div>
          </div>

          {toUserId && (
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <input
                value={msg}
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
