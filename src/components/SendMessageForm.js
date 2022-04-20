import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react'

function SendMessageForm({ sendMessage }) {
  const [message, setMessage] = useState("");
  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        if(message)
          sendMessage(message);
        setMessage("");
      }}
      sx={{ display: "flex", alignItems: "center" }}
    >
      <TextField
        fullWidth
        label="Nhập tin nhắn"
        variant="outlined"
        
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        value={message}
      />
      <Button sx={{ height: "54px", ml: "5px" }} variant="contained" type="submit">
        Gửi
      </Button>
    </Box>
  );
}

export default SendMessageForm