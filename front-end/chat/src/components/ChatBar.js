import React, { useEffect, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, Badge, IconButton, Tooltip, InputBase } from '@mui/material';
import socket from '../configs/socket';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import { useNavigate } from "react-router-dom";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Setting from './Setting';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme, connected }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: connected === 1 ? '#44b700' : "red",
    color: '#red',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const ChatBar = ({ account, selectedUserID, setSelectedUserID, users, setUsers }) => {
  const navigate = useNavigate();
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [query, setQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    // Listen for incoming messages and update the state
    socket.on("connect", () => {
      setUsers((prevUsers) => {
        return prevUsers.map((user) => user.self ? { ...user, connected: 1 } : user);
      })
    });

    socket.on("disconnect", () => {
      setUsers((prevUsers) => {
        return prevUsers.map((user) => user.self ? { ...user, connected: 0 } : user)
      })
    });

    socket.on('users', (userList) => {
      const updatedUsers = users.slice();
      userList.forEach((user) => {
        user.messages.forEach((message) => {
          message.fromSelf = message.from === socket.userID;
        })
        const userIndex = updatedUsers.findIndex(u => u.userID === user.userID);
        if (userIndex !== -1) {
          updatedUsers[userIndex] = {
            ...updatedUsers[userIndex],
            connected: user.connected,
            messages: user.messages,
            name: user.name,
            photoURL: user.photoURL
          }
        } else {
          user.self = user.userID === socket.userID;
          user.hasNewMessages = false;
          updatedUsers.push(user);
        }

      });
      setUsers(updatedUsers);
    });

    socket.on("user connected", (user) => {
      const userIndex = users.findIndex(u => u.userID === user.userID);
      if (userIndex !== -1) {
        const updatedUsers = [...users];
        updatedUsers[userIndex] = {
          ...updatedUsers[userIndex],
          name: user.name,
          photoURL: user.photoURL,
          connected: 1
        }
        setUsers(updatedUsers);
      } else {
        const newUser = {
          ...user,
          hasNewMessages: false,
          messages: [],
          connected: 1,
          self: user.userID === socket.userID
        }
        setUsers(prevUsers => {
          let newUsers;
          if (!Array.isArray(prevUsers))
            newUsers = [newUser];
          else
            newUsers = [...prevUsers, newUser];
          return newUsers;
        });
      }
    })

    socket.on("user disconnected", (id) => {
      setUsers(prevUsers => {
        return prevUsers.map(user => {
          if (user.userID === id) {
            return { ...user, connected: 0 }; // Create a new user object with connected set to 0
          }
          return user;
        });
      });
    })

    return () => {
      // Cleanup the message listener when the component unmounts
      socket.off('users');
      socket.off('user connected');
      socket.off('user disconnected');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [users, selectedUserID, setUsers]);

  useEffect(() => {
    if (query) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [users, query]);

  const selectUser = (userID) => {
    setSelectedUserID(userID);
    setQuery("");
    const updatedUsers = users.map(user =>
      user.userID === userID
        ? { ...user, hasNewMessages: false }
        : user
    );
    console.log("7");
    setUsers(updatedUsers);
  };

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleLogOut = async () => {
    socket.disconnect();
    navigate("/login");
  };

  return (
    <>
      {account &&
        <>
          <Box className="chat-bar">
            <Box
              style={{
                fontWeight: 800,
                letterSpacing: '0.5px',
                paddingBottom: '12px',
                fontSize: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              Welcome, {account.displayName}  👋
              <Box >
                <Tooltip title="Log out" style={{ padding: "0" }}>
                  <IconButton onClick={handleLogOut}>
                    <LogoutOutlinedIcon style={{ color: "white" }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Settings" style={{ padding: "0" }}>
                  <IconButton onClick={() => setOpenModal(true)}>
                    <ManageAccountsIcon style={{ color: "white" }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                  value={query}
                  onChange={handleSearch}
                />
              </Search>
            </Box>
            <Box>
              <List>
                <List className='user-list'>
                  {filteredUsers.map((user, index) => (
                    <>
                      {(user.self === false) &&
                        <>
                          <ListItem  key={index} onClick={() => selectUser(user.userID)}
                            style={{
                              paddingLeft: "0px",
                              cursor: "pointer",
                              backgroundColor: user.userID === selectedUserID && "rgb(40,40,40)"
                            }}>
                            <ListItemAvatar>
                              <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                connected={user.connected}
                              >
                                <Avatar src={user.photoURL} />
                              </StyledBadge>

                            </ListItemAvatar>
                            <ListItemText
                              primary={user.name}
                              secondary={<React.Fragment>
                                {filteredUsers[index].messages.length > 0 ? 
                                (filteredUsers[index].messages[filteredUsers[index].messages.length - 1].content.length > 15 ?
                                  filteredUsers[index].messages[filteredUsers[index].messages.length - 1].content.substring(0,15)+"...":
                                  filteredUsers[index].messages[filteredUsers[index].messages.length - 1].content
                                )
                                : ""}
                              </React.Fragment>} />
                            {filteredUsers[index].hasNewMessages && <MarkChatUnreadIcon style={{ color: 'red' }} />}
                          </ListItem>
                          {/* <Divider variant="inset" component="li" /> */}
                        </>
                      }
                    </>
                  ))}
                </List>

              </List>
            </Box>
          </Box>
          {openModal && <Setting openModal={openModal} setOpenModal={setOpenModal} account={account} />}
        </>
      }
    </>
  );
};

export default ChatBar;