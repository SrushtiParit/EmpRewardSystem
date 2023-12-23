import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Typography, Container, FormControl, FormControlLabel, Checkbox, Box, colors } from "@mui/material";
import { Link, json } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useDispatch } from "react-redux";
import { userData } from "../redux/loginSlice";

const Login = () => {
  const [email, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let photo;

    const userlogin = async () => {
      let result = await fetch("http://localhost:5000/login", {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (result.status === 200) {
        result = await result.json();
        if (result) {
          //document.cookie = `userRole=${result.role}; path=/; secure; samesite=strict`;
          sessionStorage.setItem("token", JSON.stringify(result.token));
          const username = result.name;
          const role = result.role;
          if(result.image)
          {
            const bufferData = result.image.data;
            const uint8Array = new Uint8Array(bufferData);
            const base64Image = btoa(String.fromCharCode.apply(null, uint8Array));
            photo = 'data:image/png;base64,'+base64Image;
            dispatch(userData({ username, role, photo }));
          }
          else
          {
            dispatch(userData({ username, role}));
          }
        
          
          navigate('/');
        } 
        else {
          alert("Incorrect credentials. Please enter valid details.");
        }
      } 
      else {
        const errorData = await result.json();
        alert(errorData.error);
      }
    };
    

  return (
    <Box boxShadow={3} p={3} borderRadius={8} bgcolor="white" marginRight={50} marginLeft={50} marginTop={10} marginBottom={10}>
    <Container maxWidth="sm">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
        <AccountCircle style={{ fontSize: 55 }}/>
          <Typography variant="h4" align="center" gutterBottom style={{ fontFamily: 'Comic Sans MS'}}>
            Welcome Back
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="email"
            variant="filled"
            color="secondary"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Password"
            variant="filled"
            color="secondary"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
        <Button variant="outlined" size="medium" onClick={userlogin}>
            Login
          </Button></Grid>
          <Grid item xs={12}>
          <p>Don't have an account? <Link to={"/signup"} style={{textDecoration:"none"}}>Sign-up</Link></p>
          </Grid>
      </Grid>
      
    </Container>
    </Box>
  );
};

export default Login;
