import { Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { MessageBuild, MyMessageBuild } from "./MessageBuild";

function MessagesList({ messages, uid }) {

  const messageRef = useRef();

  useEffect(() => {
    console.log("change");
    if (messageRef && messageRef.current) {
      const { scrollHeight, clientHeight } = messageRef.current;
      messageRef.current.scrollTo({
        left: 0,
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <Box
      ref={messageRef}
      sx={{ width: "100%", height: "550px", overflow: "auto" }}
    >
      {messages.map((message, index) => {
        return (
          <div key={index} className="chat-item">
            <div>
              {message.uid === "server" ? (
                <div className="server-message">{message.title}</div>
              ) : (
                <div>
                  {uid === message.uid ? (
                    <MyMessageBuild message={message} />
                  ) : (
                    <MessageBuild message={message} />
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </Box>
  );
}

export default MessagesList;
