import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Checkbox,
  Typography,Grid,Fab
} from '@mui/material';
import { json, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { userData } from "../redux/loginSlice";


const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [tnc, setTnc] = useState(false);
  const [errors, setErrors] = useState({});
  const [photo, setPhoto]  = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    const errors = {};

    if (!name) {
      errors.name = 'Name is required';
    }
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Invalid email format';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    if (!phone) {
      errors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(phone)) {
      errors.phone = 'Phone number should be 10 digits';
    }
    if (!gender) {
      errors.gender = 'Gender is required';
    }
    if (!role) {
      errors.role = 'role is required';
    }
    if (!tnc) {
      errors.tnc = 'You must accept terms and conditions';
    }

    return errors;
  };

  const showData = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      const formData = new FormData();
  
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('role', role);
      formData.append('gender', gender);
      formData.append('tnc', tnc);
  
      if (photo) {
        formData.append('photo', photo);
      }
      
  console.log(formData);
      let result = await fetch('http://localhost:5000/register', {
        method: 'POST',
        body: formData,
      });
  
      result = await result.json();
      if (result) {
        sessionStorage.setItem('token', JSON.stringify(result.token));
            const username = result.name;
            const role = result.role;
            if(result.image)
          {
            const bufferData = result.image.data;
            const uint8Array = new Uint8Array(bufferData);
            const base64Image = btoa(String.fromCharCode.apply(null, uint8Array));
            setPhoto('data:image/png;base64,'+base64Image)
            dispatch(userData({ username, role, photo }));
          }
          else
          {
            dispatch(userData({ username, role}));
          }
            navigate('/');      
          }
    } else {
      setErrors(errors);
    }






    // if (Object.keys(errors).length === 0) {
    //   let result = await fetch('http://localhost:5000/register', {
    //     method: 'POST',
    //     body: JSON.stringify({ name, email, password, phone, role, gender, tnc }),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    //   });
    //   result = await result.json();
    //   if (result) {
    //    // document.cookie = `userRole=${result.role}; path=/; secure; samesite=strict`;
    //     sessionStorage.setItem('token', JSON.stringify(result.token));
    //     const username = result.name;
    //     const role = result.role;
    //     dispatch(userData({username, role}));
    //     navigate('/');
    //   }
    // } else {
    //   setErrors(errors);
    // }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={10} md={8} lg={6}>
        <Box boxShadow={3} p={3} borderRadius={8} bgcolor="white" marginTop={10} marginBottom={10}>
          <Typography variant="h4" align="center" gutterBottom style={{ fontFamily: 'Comic Sans MS' }}>
            Let's get started
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Your Name"
                variant="filled"
                color="secondary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="filled"
                color="secondary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              variant="filled"
              color="secondary"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
            />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              variant="filled"
              color="secondary"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone}
            />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
          <FormControl>
            <FormLabel id="gender-label">Gender</FormLabel>
            <RadioGroup
              row
              aria-labelledby="gender-label"
              name="row-radio-buttons-group"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
            {errors.gender && (
              <span style={{ color: 'red' }}>{errors.gender}</span>
            )}
          </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} marginTop={4}>
          <label htmlFor="upload-photo">
          <input
          style={{ display: "none" }}
          id="upload-photo"
          name="upload-photo"
          type="file"
          onChange={(e)=>setPhoto(e.target.files[0])}
        />
          <Fab
          color="secondary"
          size="small"
          component="span"
          aria-label="add"
          variant="extended"
        >
           Upload photo
        </Fab>
        </label>
          </Grid>
            </Grid>
          <Grid container spacing={2}>
          <Grid item xs={24} sm={12}>
          <FormControl variant="filled" fullWidth style={{ margin: '10px 0' }}>
            <InputLabel id="role-label">Designation</InputLabel>
            <Select
              labelId="role-label"
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              error={!!errors.role}
            >
            <MenuItem value="">
              <em>Other</em>
            </MenuItem>
            <MenuItem value={'manager'}>Manager</MenuItem>
            <MenuItem value={'admin'}>Admin</MenuItem>
            <MenuItem value={'staff'}>Staff</MenuItem>            </Select>
            {errors.role && <span style={{ color: 'red' }}>{errors.role}</span>}
          </FormControl>
          </Grid>
          
          </Grid>
          

          <FormControl>
            <FormControlLabel
              required
              control={<Checkbox />}
              onChange={(e) => setTnc(e.target.checked)}
              label="Accept terms and conditions"
            />
            {errors.tnc && <span style={{ color: 'red' }}>{errors.tnc}</span>}
          </FormControl>
          <br/>
          <Button
            sx={{ mt: 1, mr: 1, mb: 2 }}
            type="submit"
            variant="outlined"
            onClick={() => showData()}
            size="medium"
          >
            Sign Up
          </Button>

          <Typography align="center">
            Already have an account? <Link to="/login" style={{ textDecoration: 'none' }}>Login here</Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignUp;