import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Typography, Box, Container, Paper } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            navigate('/dashboard');
        }
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            login(response.data);
        } catch (err) {
            const errorMessage = err?.response?.data?.message ? err?.response?.data?.message :  'Signup failed! Please try again.';
            setError(errorMessage);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, mt: 8, textAlign: 'center' }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Login
                </Typography>
                <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 2 }}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        required
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                        Login
                    </Button>
                </Box>
                <Typography variant="body2">
                    Don't have an account? <a href="/signup">Sign up</a>
                </Typography>
            </Paper>
        </Container>
    );
};

export default Login;
