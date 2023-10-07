import React, { useState, useEffect } from "react";
import { Modal, Box, Grid, Avatar, Badge, Button, TextField } from '@mui/material';
import { generateAvatar } from "../ultis/GenrerateAvatar";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from '../configs/firebase';
import { updateProfile } from 'firebase/auth';
import socket from '../configs/socket';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  background: "linear-gradient(75deg, rgb(40, 43, 54) 0%, rgb(40, 43, 54) 50%, rgba(40, 43, 54, 0.8) 70%)",
  boxShadow: 24,
  fontFamily: "Avenir !important",
  color: "white",
  borderRadius: "22px"
};

const Setting = ({ openModal, setOpenModal, account }) => {
  const [defaultAva, setDefaultAva] = useState([]);
  const [imagePreview, setImagePreview] = useState(account.photoURL);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(account.displayName);

  useEffect(() => {
    const fetchData = () => {
      const res = generateAvatar();
      setDefaultAva(res);
    };
    fetchData();
  }, []);

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
  };

  const handleUpdate = async () => {
    let downloadURL = "";
    if (file) {
      const imageRef = ref(storage, 'avatars/' + file.name);
      try {
        // Upload the file
        const snapshot = await uploadBytes(imageRef, file);
        // After the upload completes, get the download URL
        downloadURL = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    if (downloadURL === ""){
      await updateProfile(account, { displayName: username, photoURL: imagePreview });
      socket.emit("updateProfile",{name: username, photoURL: imagePreview});
    }
    else {
      await updateProfile(account, { displayName: username, photoURL: downloadURL });
      socket.emit("updateProfile",{name: username, photoURL: downloadURL});
    }
    setOpenModal(false);
  };
  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
    >
      <Box sx={style} >
        <Box style={{ padding: "5px", fontSize: "25px", textAlign: "center" }}>
          Pick avatar
          <Grid container spacing={0} style={{ marginTop: "10px" }} >
            {defaultAva.map((avatar, index) => (
              <Grid item xs={4} key={index} style={{ padding: '0px', margin: '0px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Avatar key={index} src={avatar} onClick={() => setImagePreview(avatar)} style={{ width: "70%", height: "auto", margin: '0px' }}></Avatar>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box style={{ marginTop: "10px", display: "flex", justifyContent: 'center' }} >
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
        <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px", marginBottom: "10px" }}>
          <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={(e) => { setUsername(e.target.value) }} style={{ width: "80%" }} />
        </Box>
        <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px", marginBottom: "10px" }}>
          <Button style={{ marginTop: "10px", fontFamily: "Avenir", backgroundColor: "#fa541c", width: "200px", borderRadius: "8px" }}
            variant="contained"
            onClick={handleUpdate}
            fullWidth>
            Update profile
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default Setting;