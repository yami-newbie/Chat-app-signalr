import { Box, Button, Container, Divider, Grid } from "@mui/material";
import MessagesList from "./MessagesList";
import SendMessageForm from "./SendMessageForm";
import UserConnectedList from "./UserConnectedList";

function ChatPage({ messages, sendMessage, closeConnection, users, uid }) {
  return (
    <Container
      maxWidth="sx"
      component="main"
      sx={{ justifyContent: "center", display: "flex", mt: "15px" }}
    >
      <Box sx={{ width: "95%" }}>
        <Box sx={{ display: "flex", justifyContent: "right", width: "100%" }}>
          <Button
            sx={{ mb: "10px" }}
            variant="outlined"
            onClick={(e) => {
              closeConnection();
            }}
          >
            Rời phòng
          </Button>
        </Box>

        <Divider />
        <Grid
          container
          sx={{ height: "550px", width: "100%", display: "flex" }}
        >
          <Grid item xs={3}>
            <UserConnectedList users={users} />
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={8}>
            <MessagesList messages={messages} uid={uid} />
          </Grid>
        </Grid>
        <Divider sx={{ mb: "10px" }} />
        <SendMessageForm sendMessage={sendMessage} />
      </Box>
    </Container>
  );
}

export default ChatPage;
