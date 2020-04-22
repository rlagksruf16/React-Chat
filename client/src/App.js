import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import './App.css';

const App = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('/');

    socketRef.current.on("your id", id => {
      setYourID(id);
    })
    socketRef.current.on("message", (message) => {
      receivedMessage(message);
    })
  }, []);

  function receivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message]);
  }

  function sendMessage(e) {
    e.preventDefault();
    const messageObject = {
      body: message,
      id: yourID,
    };
    setMessage("");

    socketRef.current.emit("send message", messageObject);
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }
  return (
    <div className="App">
      <div className="Container">
        {messages.map((message, index) => {
          if( message.id === yourID) {
            return(
              <div key={index} className="mine">
                <div className="myMess">
                  {message.body}
                </div>
              </div>
            )
          }
          return (
            <div key={index} className="your">
              <div className="yourMess">
                {message.body}
              </div>
            </div>
          )
        })}
      </div>
      <form onSubmit={sendMessage}>
        <textarea value={message} onChange={handleChange} placeholder="메시지를 입력하세요 :)"/>
        <input type='submit' className='btn' value="전송"/>
      </form>
    </div>
  );
};

export default App;