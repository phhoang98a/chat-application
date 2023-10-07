import React, { useEffect, useState, useRef } from 'react';
import { Paper, TextField, Button, Box, Divider, Avatar, InputAdornment } from '@mui/material';
import socket from '../configs/socket';
import { styled } from '@mui/material/styles';
import EmojiPicker from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { keyframes } from '@mui/system';

const CustomTextField = styled(TextField)({
  '& .MuiInputBase-input, .MuiFormLabel-root': {
    color: 'black !important',
  }
});

// Keyframes for dot animation
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
`;

const Dot = styled('span')({
  display: 'inline-block',
  width: '3px',
  height: '3px',
  borderRadius: '50%',
  background: '#333',
  animation: `${bounce} 1.2s infinite`,
  margin: '0 2px',
  '&:nth-of-type(1)': {
    animationDelay: '0s',
  },
  '&:nth-of-type(2)': {
    animationDelay: '0.2s',
  },
  '&:nth-of-type(3)': {
    animationDelay: '0.4s',
  }
});

const ChatBody = ({ account, selectedUserID, users, setUsers }) => {

  const [newMessage, setNewMessage] = useState('');
  const chatBoxRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [openEmoji, setOpenEmoji] = useState(false);

  useEffect(() => {
    const user = users.find(user => user.userID === selectedUserID);
    setSelectedUser(user);
  }, [users, selectedUserID]);

  useEffect(() => {
    setNewMessage("");
    setIsTyping(false);
  }, [selectedUserID]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setOpenEmoji(false);
      }
    }
    // Attach the click event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener when the component is unmounted or when the effect re-runs
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    socket.on("typing response", (data) => {
      if (data.from === selectedUserID) {
        setIsTyping(true);
      }
    })

    socket.on("stop typing response", (data) => {
      if (data.from === selectedUserID) {
        setIsTyping(false);
      }
    })

    socket.on("private message", (data) => {
      const fromSelf = socket.userID === data.from;
      const updatedUsers = users.map(user => {
        if (user.userID === (fromSelf ? data.to : data.from)) {
          return {
            ...user,
            messages: [...user.messages, {
              content: data.content,
              fromSelf
            }],
            hasNewMessages: user.userID !== selectedUserID
          };
        }
        return user;
      })
      setUsers(updatedUsers);
    })

    return () => {
      // Cleanup the message listener when the component unmounts
      socket.off('private message');
      socket.off('typing response');
      socket.off("stop typing response")
    };
  }, [users, selectedUserID, setUsers]);

  useEffect(() => {
    chatBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedUser, isTyping]);

  useEffect(() => {
    if (newMessage.trim() === "") {
      socket.emit('stop typing', {
        to: selectedUserID
      });
    }
  }, [newMessage, selectedUserID]);

  const handleTyping = () => {
    if (newMessage.trim() !== "") {
      socket.emit('typing', {
        to: selectedUserID
      });
    }
  }

  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(prevMessage => prevMessage + event.emoji);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      if (selectedUser) {
        socket.emit('message', {
          content: newMessage,
          name: account.displayName,
          photoURL: account.photoURL,
          to: selectedUserID,
        });
        const updatedUsers = users.map(user =>
          user.userID === selectedUserID
            ? {
              ...user,
              messages: [...user.messages, {
                content: newMessage,
                fromSelf: true
              }]
            }
            : user
        );
        setUsers(updatedUsers);
      }
    };
    setNewMessage('');
  };

  return (
    <>
      {
        (account && selectedUser) ?
        <Paper elevation={3} className='chat-body'>
          <Box style={{ marginBottom: "10px", display: "flex" }}>
            <Avatar src={selectedUser.photoURL} />
            <Box style={{ marginTop: "auto", marginBottom: "auto", marginLeft: "10px" }}>
              {selectedUser.name}
              {selectedUser.connected === 1 ? <span className="logged-in">●</span> : <span className="logged-out">●</span>}
            </Box>
          </Box>
          <Divider />
          <Box className="box-chat">
            {selectedUser.messages.map((message, index) => (

              message.fromSelf ? <Box key={index} className="rightMessage">{message.content}</Box> : <Box key={index} className="leftMessage">{message.content}</Box>

            ))}
            {isTyping &&
              <Box style={{ display: "flex", alignItems: "center", fontStyle: "italic" }}>
                {selectedUser.name} is typing
                <Dot />
                <Dot />
                <Dot />
              </Box>}
            <div ref={chatBoxRef} />
          </Box>

          <Box style={{ marginTop: "15px", position: "relative", display:"flex" }}>
            {openEmoji && (
              <Box style={{
                position: 'absolute',
                bottom: '40px', // Adjust this based on the height of your TextField
                right: '0',
                zIndex: 10 // to ensure it appears on top
              }}>
                <Box ref={emojiPickerRef}>
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </Box>
              </Box>
            )}
            <CustomTextField
              label="Type a message..."
              style={{ width: "100%", marginRight: '3px' }}
              value={newMessage}
              multiline
              onChange={(e) => setNewMessage(e.target.value)}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <InsertEmoticonIcon style={{ cursor: "pointer" }} onClick={() => setOpenEmoji(true)} />
                  </InputAdornment>,
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                } else {
                  handleTyping();
                }
              }}
            />
            <Button variant="contained" style={{ backgroundColor: "rgb(30, 30, 30)"}} onClick={handleSendMessage} >
              Send
            </Button>
          </Box>

        </Paper> : 
        <Box className='chat-body' style={{height:"100%"}}>
          <Box style={{color:"white", fontSize:"30px"}}>
            Select an user to have a fun conversation.
          </Box>
        </Box>
      }
    </>
  )
}

export default ChatBody;