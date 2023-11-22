import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Link} from 'react-router-dom';
import axios from 'axios';

import { useNavigate  } from 'react-router-dom';



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();


export default function SignUp() {


  const navigate = useNavigate ()

// useEffect for navigate to home page if alredy loged in 
React.useEffect(()=>{
  const userData = JSON.parse(localStorage.getItem('userData'));

  console.log("userData11",userData )
  if (userData){
    navigate("/")
  }
},[])



  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    signUpuser({
      orgName:data.get('OrganizationName'),
      email: data.get('email'),
      password: data.get('password'),
    })
  };

  const signUpuser = async(data)=>{
    try {
      const serverRespose = await axios({
        method: "post",
        url: "http://localhost:4001/signup",
        data: data,
      });
      console.log("serverRespose", serverRespose)

      if(serverRespose.data.status === "success") {

        localStorage.setItem('userData', JSON.stringify(serverRespose.data));
        navigate("/")
      }else{
        window.alert("email already registered please login")
      }
    } catch (error) {
      console.log(error);
      window.alert("email already registered please login")
    }
    
  }


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <TextField
                  autoComplete="OrganizationName"
                  name="OrganizationName"
                  required
                  fullWidth
                  id="OrganizationName"
                  label="Organization Name"
                  autoFocus
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
             
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to={"/login"} >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
       
      </Container>
    </ThemeProvider>
  );
}