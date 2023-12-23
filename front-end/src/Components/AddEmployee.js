import React, { useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { json, useNavigate } from 'react-router-dom';

const AddEmployee = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const balanceTony = 0;

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
    return errors;
  };

  const showData = async () => {
    const errors = validateForm();
  
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch('http://localhost:5000/registerEmp', {
          method: 'POST',
          body: JSON.stringify({ name, email, password, phone, balanceTony }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const result = await response.json();
  
        if (response.ok) {
          setName("");
          setEmail("");
          setPassword("");
          setPhone("");
          onClose();
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error('Error during API call:', error);
        // Handle the error appropriately, e.g., show an alert
      }
    } else {
      setErrors(errors);
    }
  };

  const handleCancel =()=>{
          setName("");
          setEmail("");
          setPassword("");
          setPhone("");
          onClose();
  }
  

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>New Employee</DialogTitle>
      <DialogContent>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
      <TextField
        label="Your Name"
        variant="filled"
        color="secondary"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ margin: '10px', width: '250px' }}
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        label="Email"
        variant="filled"
        color="secondary"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: '10px', width: '250px' }}
        error={!!errors.email}
        helperText={errors.email}
      />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
    <TextField
      label="Password"
      variant="filled"
      color="secondary"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      style={{ margin: '10px', width: '250px' }}
      error={!!errors.password}
      helperText={errors.password}
    />
    <TextField
      label="Phone Number"
      variant="filled"
      color="secondary"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      style={{ margin: '10px', width: '250px' }}
      error={!!errors.phone}
      helperText={errors.phone}
    />
    </div>
  </div>
</DialogContent>

      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={showData} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployee;
