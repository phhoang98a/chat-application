import '../styles/AuthPage.css';
import React, {useState} from 'react';
import { Box, TextField, Button, Alert } from '@mui/material'
import { auth } from '../configs/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import socket from '../configs/socket';
import { handleGet } from '../ultis/Redis';

const SignIn = ({setIsLogin}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async ()=>{
    if (email==="") {
      setNotice("Please fill in email");
    } else if (password===""){
      setNotice("Please fill in password");
    }else{
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);  
        const displayName =  res.user.displayName;
        const photoURL = res.user.photoURL;
        //const sessionID = localStorage.getItem(email);
        const sessionID = await handleGet(email);
        socket.auth = {sessionID, email, displayName, photoURL};
        socket.connect();
        navigate("/");
      } catch (error) {
        if (error.code==="auth/invalid-email"){
          setNotice("Email is invalid");
        } else if (error.code==="auth/invalid-login-credentials"){
          setNotice("Incorrect email or password");
        }
      }
    }
  };
  
  return (
    <>
      <Box style={{ fontWeight: 800, letterSpacing: '0.5px', color: '#e8e8e8', paddingBottom: '12px', fontSize: '18px', textDecoration: 'underline', cursor: 'pointer' }}
        onClick={()=>{setIsLogin(false)}}
      >
        New customer? Register
      </Box>
      <Box>
        <TextField label="Email" variant="outlined" value={email} onChange={(e)=>{setEmail(e.target.value)}} className="input" type='email' fullWidth required />
      </Box>
      <Box style={{ marginTop: "10px" }}>
        <TextField label="Password" variant="outlined" value={password} onChange={(e)=>{setPassword(e.target.value)}} className="input" type='password' fullWidth required />
      </Box>
      {notice && <Alert style={{ marginTop: "10px" }} severity="error">{notice}</Alert>}
      <Button style={{ marginTop: "10px", fontFamily: "Avenir", backgroundColor: "#fa541c", borderRadius: "8px" }} variant="contained" fullWidth onClick={handleSignIn}>Enter</Button>
    </>
  )
};

export default SignIn;