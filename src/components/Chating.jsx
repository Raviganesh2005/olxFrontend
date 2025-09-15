import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../statics/Chating.css";

function Chating() {
  const location = useLocation();
  const sellerId = location.state;
  const userId = localStorage.getItem("userId");

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch old chat
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await fetch(
          `https://olxbackend-0mmr.onrender.com/message/${userId}/${sellerId}`,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const messages = await res.json();

        if (res.ok) {
          setChat(
            messages.map((m) => ({
              from: m.sender === userId ? "You" : sellerId,
              msg: m.msg,
              imageUrl: m.imageUrl || null,
            }))
          );
        }
      } catch (error) {
        setError({ error: "Something went wrong" });
      }
    };

    fetchChat();
  }, [userId, sellerId]);

  // Setup socket
  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      path: "/chat",
      auth: { token: localStorage.getItem("token") },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected");
    });

    newSocket.on("privateMessage", ({ from, msg, imageUrl }) => {
      setChat((prev) => [...prev, { from, msg, imageUrl }]);
    });

    return () => newSocket.disconnect();
  }, []);

  // Send message / image
  const handleSend = async (event) => {
    event.preventDefault();

    // Text message
    if (message.trim()) {
      socket.emit("privateMessage", {
        receiver: sellerId,
        msg: message,
        imageUrl: null,
      });

      setChat((prev) => [...prev, { from: "You", msg: message }]);
      setMessage("");
    }

    // Image message
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const res = await fetch("https://olxbackend-0mmr.onrender.com/message/imageUpload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      const response = await res.json(); 
      console.log(response);
      
      const imageUrl = `https://olxbackend-0mmr.onrender.com/productSell/image/${response.imageId}`;

      socket.emit("privateMessage", { receiver: sellerId, msg: "", imageUrl });

      setChat((prev) => [...prev, { from: "You", imageUrl }]);
      setSelectedImage(null);
    }
  };

  return (
    <div className="chat-container container mt-4">
      <div className="card chat-card shadow-lg">
        <div className="card-header bg-primary text-white">
          Chat with <strong>{sellerId}</strong>
        </div>

        <div className="card-body chat-body">
          {chat.length === 0 && (
            <p className="text-muted text-center">No messages yet...</p>
          )}
          {chat.map((c, i) => (
            <div
              key={i}
              className={`message ${c.from === "You" ? "sent" : "received"}`}
            >
              <div className="msg-text">
                <strong>{c.from}: </strong>
                {c.msg && <span>{c.msg}</span>}
                {c.imageUrl && (
                  <div>
                    <img src={c.imageUrl} alt="chat-img" className="chat-img" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="card-footer">
          <form className="d-flex" onSubmit={handleSend}>
            <input
              type="text"
              className="form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <input
              type="file"
              className="form-control ms-2"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
            <button className="btn btn-primary ms-2" type="submit">
              Send
            </button>
          </form>
          {error && <p className="text-danger mt-2">{error.error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Chating;
