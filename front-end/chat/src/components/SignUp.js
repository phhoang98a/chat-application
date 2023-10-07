import '../styles/AuthPage.css';
import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Avatar, Badge } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { auth, storage } from '../configs/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const SignUp = ({ setIsLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [notice, setNotice] = useState("");
  const [type, setType] = useState("error");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSignUp = async () => {
    setType("error");
    if (username === "") {
      setNotice("Please fill in username");
    } else if (email === "") {
      setNotice("Please fill in email");
    } else if (password === "") {
      setNotice("Please fill in password");
    } else {
      try {
        let userCredential = await createUserWithEmailAndPassword(auth, email, password);
        let user = userCredential.user;
        const avatarURL = await handleSubmit();
        await updateProfile(user, { displayName: username, photoURL: avatarURL });
        setType("success");
        setNotice("Sign up successfully");
      } catch (error) {
        console.log('123', error);
        if (error.code === "auth/invalid-email") {
          setNotice("Email is invalid");
        } else if (error.code === "auth/weak-password") {
          setNotice("Passwords must contain a minimum of 6 characters");
        } else if (error.code === "auth/email-already-in-use") {
          setNotice("Email is already set up. Please use a different email.")
        }
      }
    }
  }

  const handleSubmit = async () => {
    if (!file) return;
    // Create a reference to the location you want to save the file
    const imageRef = ref(storage,'avatars/' + file.name);

    try {
      // Upload the file
      const snapshot = await uploadBytes(imageRef, file);
      // After the upload completes, get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleImagePreview = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <>
      <Box style={{ fontWeight: 800, letterSpacing: '0.5px', color: '#e8e8e8', paddingBottom: '12px', fontSize: '18px', textDecoration: 'underline', cursor: 'pointer' }}
        onClick={() => { setIsLogin(true) }}
      >
        You registed an account? Sign in
      </Box>
      <Box>
        <TextField label="Username" variant="outlined" value={username} onChange={(e) => { setUsername(e.target.value) }} className="input" fullWidth required />
      </Box>
      <Box style={{ marginTop: "10px" }}>
        <TextField label="Email" variant="outlined" value={email} onChange={(e) => { setEmail(e.target.value) }} className="input" type='email' fullWidth required />
      </Box>
      <Box style={{ marginTop: "10px" }}>
        <TextField label="Password" variant="outlined" value={password} onChange={(e) => { setPassWord(e.target.value) }} className="input" type='password' fullWidth required />
      </Box>
      <Box style={{ marginTop: "10px", display: "flex" }} >
        <Badge
          overlap="circular"
          badgeContent={
            imagePreview ? <ClearRoundedIcon style={{ backgroundColor: "black", borderRadius: "50%" }} onClick={() => { setImagePreview(null); setFile(null); }} fontSize='small' /> : <></>
          }
        >
          <Avatar src={imagePreview} style={{ width: 100, height: 100 }} />
        </Badge>

        <Button
          variant="contained"
          component="label"
          startIcon={<AddAPhotoIcon />}
          style={{ marginBottom: 'auto', marginTop: 'auto', marginLeft: '10px', backgroundColor: 'transparent' }}
        >
          Upload File
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImagePreview}
          />
        </Button>
      </Box>
      {notice && <Alert style={{ marginTop: "10px" }} severity={type}>{notice}</Alert>}
      <Button style={{ marginTop: "10px", fontFamily: "Avenir", backgroundColor: "#fa541c", borderRadius: "8px" }}
        onClick={handleSignUp}
        variant="contained"
        fullWidth
      > Sign up</Button>
    </>
  )
};

export default SignUp;