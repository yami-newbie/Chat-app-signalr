import React, { useEffect } from 'react'
import { useState } from "react";
import {
  TextField,
  Box,
  Button,
  Container,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function ConnectPage({ Login, Register, ResponseLogin, ResponseRegister }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [warningText2, setWarningText2] = useState("");

  useEffect(() => {
    setUser("");
    setPassword("");
    setConfirm("");
    setWarningText("");
    setWarningText2("");
  }, [isRegister]);

  useEffect(() => {
    setWarningText(ResponseLogin);
  }, [ResponseLogin]);

  useEffect(() => {
    setWarningText(ResponseRegister);
  }, [ResponseRegister]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isRegister) {
      Login(user, password);
    } else {
      if (password.length < 6) {
        setWarningText("Mật khẩu phải nhiều hơn 6 ký tự");
        return;
      }

      if (password !== confirm) {
        setWarningText2("Mật khẩu xác nhận không trùng khớp");
        return;
      }

      Register(user, password);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 1,
        }}
        noValidate
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {!isRegister ? "Đăng nhập" : "Đăng ký"}
        </Typography>
        {!isRegister ? (
          <Box fullWidth onSubmit={onSubmit} component="form">
            <TextField
              label="Tên đăng nhập"
              margin="normal"
              variant="outlined"
              sx={{ width: "100%" }}
              value={user}
              error={warningText ? true : false}
              onChange={(e) => {
                setUser(e.target.value);
              }}
            />

            <TextField
              label="Mật khẩu"
              margin="normal"
              variant="outlined"
              type="password"
              error={warningText ? true : false}
              sx={{ width: "100%" }}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <label style={{ width: "100%", color: "red" }}>
              {warningText ? warningText : null}
            </label>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ width: "100%", mt: "10px" }}
            >
              <Button
                onClick={() => {
                  setIsRegister(true);
                }}
                fullWidth
                variant="contained"
              >
                Đăng ký
              </Button>
              <Button fullWidth type="submit" variant="outlined">
                Đăng nhập
              </Button>
            </Stack>
          </Box>
        ) : (
          <Box onSubmit={onSubmit} component="form">
            <TextField
              label="Tên đăng nhập"
              margin="normal"
              variant="outlined"
              fullWidth
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
              }}
            />
            <label style={{ width: "100%", color: "red" }}>
              {warningText ? warningText : null}
            </label>
            <TextField
              label="Mật khẩu"
              margin="normal"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {warningText ? warningText : null}
            <TextField
              label="Xác nhận mật khẩu"
              margin="normal"
              variant="outlined"
              type="password"
              fullWidth
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
              }}
            />
            {warningText2 ? warningText : null}
            <Stack spacing={2} sx={{ width: "100%", mt: "10px" }}>
              <Button fullWidth variant="contained" type="submit">
                Đăng ký
              </Button>
              <Button
                onClick={() => {
                  setIsRegister(false);
                }}
                fullWidth
                variant="outlined"
              >
                Đã có tài khoản
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default ConnectPage