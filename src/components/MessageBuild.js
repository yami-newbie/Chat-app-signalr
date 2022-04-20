import { Avatar } from "@mui/material";

export const MyMessageBuild = ({ message }) => {
  return (
    <div>
      <div className="message-container">
        <div />
        <div className="my-message">{message.title}</div>
      </div>
    </div>
  );
};

export const MessageBuild = ({ message }) => {
  return (
    <div>
      <div className="message-container">
        <div
          style={{
            display: "flex",
          }}
        >
          <Avatar sx={{mr: "10px"}}>{message.user[0].toUpperCase()}</Avatar>
          <div className="message">{message.title}</div>
        </div>
        <div />
      </div>
    </div>
  );
};
