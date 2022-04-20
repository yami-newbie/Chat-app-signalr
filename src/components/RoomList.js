import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'

function RoomList({rooms = [], createRoom, message, onClickItem = null}) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [selected, setSelected] = useState(null);
  const [listDisplay, setListDisplay] = useState([]);
  const [listData, setListData] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onConfirm = () => {
    if(name){
      createRoom(name);
    }
  }

  useEffect(() => {
     
  }, [message])

  useEffect(() => {
    setListData(rooms);
  }, [rooms])

  useEffect(() => {
    if (selected !== null) {
      setListDisplay([selected]);
    } else {
      setListDisplay(listData);
    }
  }, [listData, selected]);

  return (
    <Box>
      <Typography variant="h5">Các phòng hiện tại</Typography>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        onChange={(event, newValue) => {
          setSelected(newValue);
        }}
        options={listData}
        getOptionLabel={(room) => room}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Tên phòng" />}
      />
      <Grid
        container
        spacing={3}
        direction="row"
        sx={{ width: "100%", m: "5px" }}
      >
        {rooms.length >= 1
          ? listDisplay.map((room, i) => (
              <Grid
                item
                key={i}
                onClick={async (e) => {
                  e.preventDefault();
                  await onClickItem(room);
                }}
              >
                <Button
                  variant="contained"
                  sx={{ width: "15em", borderRadius: "7px" }}
                >
                  {room}
                </Button>
              </Grid>
            ))
          : null}
        <Grid item>
          <Button
            onClick={handleClickOpen}
            variant="contained"
            sx={{ width: "15em", borderRadius: "7px" }}
          >
            +
          </Button>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Tạo phòng mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Tên phòng mới"
            error={name ? false : true}
            onChange={(e) => {
              setName(e.target.value);
            }}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={onConfirm}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RoomList