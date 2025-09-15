// components/LoginForm.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("https://lillebrorgrodas-first-api.onrender.com/users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data))
        setUser(data)



      } else {
        alert(data.message || 'Login failed');
      }

    }
    catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  }

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
        <Button fullWidth type="submit" variant="contained" color="primary">
          Log in
        </Button>
      </Box>
    </form>
  );
};

export default LoginForm;
