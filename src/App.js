import { HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import { useEffect, useRef, useState } from 'react';
import ChatPage from './components/ChatPage';
import ConnectPage from './components/ConnectPage';
import MainLayout from './components/MainLayout';

function App() {
  const [connectionChat, setConnectionChat] = useState();
  const [connectionAccount, setConnectionAccount] = useState();//
  const [messages, setMessages] = useState([]);
  const listMess = useRef();
  const [room, setRoom] = useState([]);//
  const [createRoomMessages, setCreateRoomMessages] = useState([]);//
  const [usersInServer, setUsersInServer] = useState([]);//
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [connectionId, setConnectionId] = useState();
  const [account, setAccount] = useState();//
  const [registerMessage, setRegisterMessage] = useState();//
  const [loginMessage, setLoginMessage] = useState();//
  const [roomsInServer, setRoomInServer] = useState();//

  const DisconnectAccount = () => {
    setAccount();
    setConnectionAccount();
    setRoomInServer();
    setRoom();
    setRegisterMessage();
    setLoginMessage();
    setCreateRoomMessages();
    setUsersInServer();
  }

  useEffect(() => {
    console.log("askdaksd", messages);
    listMess.current = [...messages];
  }, [messages])

  useEffect(() => {
    console.log("curr", listMess.current);
  }, [listMess.current])

  // useEffect(() => {
  //   ConnectSignalrChat();
  //   ConnectSignalrAccount();
  // }, [])

  const ConnectSignalrChat = async (roomName) => {
    try {
      const connectionChat = new HubConnectionBuilder()
        .withUrl("https://localhost:44351/chat")
        .configureLogging(LogLevel.Information)
        .build();

      connectionChat.on("ReceiveMessage", (user, uid, title) => {
        console.log(user, title, uid, listMess.current);
        setMessages([...listMess.current, { user: user, uid: uid, title: title }]);
      });

      connectionChat.on("ReceiveGroupMessage", (isComplete , Res) => {
        if (isComplete){
          listMess.current = Res;
          console.log("nah", messages, Res, isComplete);
        } else {
          console.log("none", Res);
        }
      });

      connectionChat.on("UsersInRoom", (users) => {
        setUsersInRoom(users);
      });

      connectionChat.on("ReceiveConnectionId", (connectionId) => {
        setConnectionId(connectionId);
      });

      connectionChat.onclose((e) => {
        setConnectionChat();
        setMessages([]);
        listMess.current = [];
        console.log("close");
      });

      console.log("here");

      await connectionChat.start().then( async () => {
        console.log(account, roomName);
        const _uid = String(account);
        await connectionChat.invoke("GetConnectionId");
        await connectionChat.invoke("JoinRoom", { user: _uid, room: roomName})
      });

      setConnectionChat(connectionChat);

    } catch (e) {
      console.log(e);
    }
  };

  const ConnectSignalrAccount = async (Func, username, password) => {
    try {
      const connectionAccount = new HubConnectionBuilder()
        .withUrl("https://localhost:44351/account")
        //.configureLogging(LogLevel.Information)
        .build();

      connectionAccount.on("CreateAccount", (res) => {
        if (res !== "Tên đăng nhập đã tồn tại") {
          setAccount(res);
        } else {
          setRegisterMessage(res);
        }
        console.log(res);
      });

      connectionAccount.on("ReceiveRooms", (rooms) => {
        setRoomInServer(rooms);
      });

      connectionAccount.on("ReciveLogin", (account, message) => {
        setAccount(account);
        setLoginMessage(message);
        console.log("acc", account);
      });

      connectionAccount.on("LogoutLogin", (messages) => {
        setAccount();
      });

      connectionAccount.on("UsersInServer", (users) => {
        setUsersInServer(users);
      });

      connectionAccount.on("CreateNewRoom", async (room, message) => {
        if (message === "Tạo phòng thành công") {
          await connectionAccount.invoke("SendRoomsInServer");
        }
        setCreateRoomMessages(messages);
        setRoom(room);
      });

      connectionAccount.onclose(() => {
        DisconnectAccount();
      });

      await connectionAccount.start().then( async () => {
        await connectionAccount.invoke("SendRoomsInServer");
        if (Func === "Login") {
          await connectionAccount.invoke("Login", username, password);
        } else {
          await connectionAccount.invoke("CreateAccount", username, password);
        }
      });

      setConnectionAccount(connectionAccount);
    } catch (error) {
      console.log(error);
    }
  };

  const createRoom = async (name) => {
    try {
      await connectionAccount.invoke("CreateNewRoom", name);
    } catch (error) {
      console.log(error);
    }
  }

  const SendMessage = async (message) => {
    try {
      await connectionChat.invoke("SendMessage", message);
    } catch (e) {
      console.log(e);
    }
  }

  const Register = async (username, password) => {
    try {
      await ConnectSignalrAccount("Register", username, password);
    } catch (e) {
      console.log(e);
    }
  };

  const Login = async (username, password) => {
    try {
      await ConnectSignalrAccount("Login", username, password);
    } catch (e) {
      console.log(e);
    }
  }

  const Logout = async () => {
    try {
      await connectionAccount.stop();
    } catch (error) {
      console.log(error)
    }
  }

  const closeConnection = async () => {
    try {
      await connectionChat.stop();
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {setLoginMessage(''); setRegisterMessage('')}, 3000);
    return () => {
      clearInterval(interval);
    }
  }, [loginMessage, registerMessage])

  return (
    <div className="App">
      {!account ? (
        <ConnectPage
          Login={Login}
          Register={Register}
          ResponseLogin={loginMessage}
          ResponseRegister={registerMessage}
        />
      ) : (
        <>
          {!connectionChat ? (
            <MainLayout
              Logout={Logout}
              users={usersInServer}
              rooms={roomsInServer}
              room={room}
              createRoomMessage={createRoomMessages}
              createRoom={createRoom}
              onClickRoom={ConnectSignalrChat}
            />
          ) : (
            <ChatPage
              messages={messages}
              sendMessage={SendMessage}
              closeConnection={closeConnection}
              uid={account}
              users={usersInRoom}
            />
          )}
        </>

        /*  */
      )}
    </div>
  );
}

export default App;
