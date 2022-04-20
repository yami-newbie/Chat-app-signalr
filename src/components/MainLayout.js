import { Box, Button, Container, Divider, Grid } from '@mui/material'
import React from 'react'
import RoomList from './RoomList'
import UserConnectedList from './UserConnectedList'

function MainLayout({ Logout, users, rooms = ["1", "2"], room, createRoomMessage, createRoom, onClickRoom }) {
  return (
    <Container
      maxWidth="sx"
      component="main"
      sx={{
        justifyContent: "center",
        display: "flex",
        height: "650px",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={Logout} variant="contained">
            Đăng xuất
          </Button>
        </div>
        <div>
          <Grid container spacing={3} sx={{ height: "650px", width: "100%" }}>
            <Grid item xs={3}>
              <UserConnectedList users={users} />
            </Grid>
            <Divider orientation="vertical" flexItem />
            <Grid item xs={8}>
              <RoomList
                rooms={rooms}
                createRoom={createRoom}
                message={createRoomMessage}
                onClickItem={onClickRoom}
              />
            </Grid>
          </Grid>
        </div>
      </Box>
    </Container>
  );
}

export default MainLayout