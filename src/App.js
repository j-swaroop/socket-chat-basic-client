import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./components/Chat";

const socket = io.connect("https://socket-chat-basic-server.onrender.com/");

function App() {
  const [username, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    } else {
      setErrMsg("Enter name and room");
    }
  };

  return (
    <div className="App">
      <div className="responsive-container">
        {!showChat ? (
          <div className="join-chat-container">
            <h1 className="heading"> Join A Chat</h1>
            <input
              type="text"
              placeholder="Room ID..."
              onChange={(event) => setRoom(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && joinRoom()}
            />
            <input
              type="text"
              placeholder="Name..."
              onChange={(event) => setUserName(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && joinRoom()}
            />
            <button onClick={joinRoom} className="join-room-btn">
              {" "}
              Join A Room{" "}
            </button>
            {errMsg !== "" && <p className="err-msg"> {errMsg}...</p>}
          </div>
        ) : (
          <Chat username={username} room={room} socket={socket} />
        )}
      </div>
    </div>
  );
}

export default App;
