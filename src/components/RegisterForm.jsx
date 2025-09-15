// components/RegisterForm.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const RegisterForm = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://lillebrorgrodas-first-api.onrender.com/users/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data));

          setUser(data);
          setUsername('');
          setPassword('');
        } else {
          alert(data.message || 'Registration failed');
        }
      })
      .catch((error) => {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Username"
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Box mt={2}>
        <Button fullWidth type="submit" variant="contained" color="secondary">
          Register
        </Button>
      </Box>
    </form>
  );
};

export default RegisterForm;
