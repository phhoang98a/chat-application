import './App.css';
import React, { useEffect } from 'react';
import AuthPage from './components/AuthPage.js';
import ChatPage from './components/ChatPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import socket from './configs/socket';
import { handleSet } from './ultis/Redis';

function App() {


  useEffect(() => {

    //const sessionID = localStorage.getItem("sessionID");

    // if (sessionID) {
    //   socket.auth = { sessionID };
    //   socket.connect();
    // }

    // Listen for incoming messages and update the state
    socket.on('session', ({ sessionID, userID, email }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      handleSet(email, sessionID);

      socket.userID = userID;
    })

    return () => {
      // Cleanup the message listener when the component unmounts
      socket.off('session');
    };
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<ChatPage />} />
          <Route exact path="/login" element={<AuthPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
