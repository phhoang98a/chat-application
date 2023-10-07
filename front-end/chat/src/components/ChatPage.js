import '../styles/ChatPage.css'
import React, { useState, useEffect } from 'react';
import { auth } from '../configs/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { Box, Grid } from '@mui/material';
import ChatBar from './ChatBar';
import { useNavigate } from "react-router-dom";
import ChatBody from './ChatBody';
import { handleGet } from '../ultis/Redis';
import socket from '../configs/socket';

const ChatPage = () => {

  const [account, setAccount] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserID, setSelectedUserID] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe =  onAuthStateChanged(auth, async (userInfo) => {
      if (userInfo) {
        setAccount(userInfo);
        const sessionID = await handleGet(userInfo.email);
        if (sessionID) {
          socket.auth = { sessionID };
          socket.connect();
        }
      } else {
        setAccount(null);
        navigate('/login')
      }
    });
    return () => unsubscribe();

  }, [navigate])

  return (
    <Box className="main">
      <Box className="chat-area">
        <Grid container >
          <Grid item xs={12} sm={3} md={3}>
            <ChatBar  account={account} selectedUserID={selectedUserID} setSelectedUserID={setSelectedUserID} users={users} setUsers={setUsers} />
          </Grid>
          <Grid item xs={12} sm={8} md={8}>
            <ChatBody account={account} selectedUserID={selectedUserID} users={users} setUsers={setUsers} />
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
}

export default ChatPage;