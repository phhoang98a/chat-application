import React from "react";
import { WelcomeSVG } from "../ultis/WelcomeSVG";
import { Box } from '@mui/material';

export default function Welcome() {
  return (
    <Box style={{ padding: '20px', margin: '0 auto' }}>

      <WelcomeSVG />
      <Box style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color:"white",
        fontSize:"25px"
      }}>
        Select a Chat to Start Messaging
      </Box>
    </Box>
  );
}