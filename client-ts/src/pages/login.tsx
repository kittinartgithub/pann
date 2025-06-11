import { useEffect } from 'react';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from "react-oidc-context";
import { Navigate, useLocation } from 'react-router-dom';
import { useAppCtx } from '../AppProvider';

function Login() {

  const { userInfo, action } = useAppCtx();
  const auth = useAuth();
  const location = useLocation();
  const bglogin = require("../image/bg4.jpg");

  console.log('rendering..... login', auth.user)
  useEffect(() => {
    if (auth.isAuthenticated) {
      setTimeout(() => {
        action.setUserInfo({
          ready: true,
          username: auth.user?.profile.preferred_username,
          displayName: auth.user?.profile.given_name + ' ' + auth.user?.profile.family_name
        })
      }, 1000)
    }
  }, [auth, userInfo.ready])

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Sign in...</div>;
    case "signoutRedirect":
      return <div>Sign out...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops!!... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    if (userInfo.ready) {
      const backTo = location.state?.backTo || '/home'
      return (
        <Navigate to={backTo} replace />
      );
    } else {
      return <div>Waiting for seconds</div>;
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 890,
        backgroundImage: `url(${bglogin})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      <Button
        variant="contained"
        sx={{ fontSize: "large" }}
        onClick={() => void auth.signinRedirect()}
      >
        <LoginIcon sx={{ mr: 3 }} />

        Log in
      </Button>
    </Box>
  );
};

export default Login;