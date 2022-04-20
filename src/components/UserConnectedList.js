import { Avatar, Divider, List, ListItemAvatar, ListItemButton, ListItemText, ListSubheader } from '@mui/material';
import React from 'react'

function UserConnectedList({ users, onClickItems = null }) {
  return (
    <List
      subheader={<ListSubheader>Người dùng đang online</ListSubheader>}
      sx={{ bgcolor: "", width: "100%", overflow: "auto" }}
    >
      <Divider />
      {users.map((user, i) => {
        return (
          <ListItemButton key={i} sx={{ mt: "5px" }} onClick={onClickItems}>
            <ListItemAvatar>
              <Avatar>{user[0].toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText>{user}</ListItemText>
          </ListItemButton>
        );
      })}
    </List>
  );
}

export default UserConnectedList