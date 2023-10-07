import '../styles/AuthPage.css'
import React, {useState} from 'react';
import { Box } from '@mui/material';
import SignIn from './SignIn';
import SignUp from './SignUp';


const AuthPage = () => {

  const [isLogin, setIsLogin] = useState('true');

  return (
    <Box className="main">
      <Box className="auth-area">
        <Box style={{  fontWeight: 800, letterSpacing: '0.5px', color: '#e8e8e8', paddingBottom: '12px', fontSize: '42px' }}>
          Welcome 👋
        </Box>
        { isLogin 
          ? <SignIn setIsLogin={setIsLogin}/>
          : <SignUp setIsLogin={setIsLogin}/>
        }
      </Box>
    </Box >

  )
}

export default AuthPage;