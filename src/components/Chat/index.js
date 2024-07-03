import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import "./index.css";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = (props) => {
  const { username, room, socket } = props;
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messageRef = useRef(null);

  const sendMsg = async () => {
    if (currentMessage !== "") {
      const messageData = {
        id: v4(),
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((messageList) => [...messageList, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.off("receive_message").on("receive_message", (data) => {
      setMessageList((messageList) => [...messageList, data]);
    });
  }, [socket]);

  useEffect(() => {
    messageRef.current?.scrollIntoView();
  }, [messageList]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <p className="live-text"> Live Chat </p>
      </div>
      <div className="chat-body">
        {messageList.map((item) => (
          <div
            key={item.id}
            className="chatt"
            id={item.author !== username ? "Youu" : "Otherr"}
          >
            <div
              className="chat"
              id={item.author !== username ? "You" : "Other"}
            >
              <p
                className={`${item.author !== username ? "msg" : "msg-other"}`}
              >
                {item.message}{" "}
              </p>
            </div>
            <div className="author-time">
              <p
                className={`${
                  item.author !== username ? "time" : "time-other"
                }`}
              >
                {item.time}{" "}
              </p>
              <p
                className={`${
                  item.author !== username ? "author" : "author-other"
                }`}
              >
                {item.author}{" "}
              </p>
            </div>
          </div>
        ))}
        <div ref={messageRef}></div>
      </div>
      <div className="chat-footer">
        <input
          className="input"
          type="text"
          placeholder="Hey..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          value={currentMessage}
          onKeyPress={(event) => event.key === "Enter" && sendMsg()}
        />
        <button onClick={sendMsg} className="send-msg-btn">
          {" "}
          &#9658;{" "}
        </button>
      </div>
    </div>
  );
};

export default Chat;
