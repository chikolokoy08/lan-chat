import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Container, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            navigate('/dashboard');
        }
    })

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await axios.post('/api/auth/signup', { email, password });
            setSuccess('Signup successful! Please login.');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');
        } catch (err) {
            const errorMessage = err?.response?.data?.message ? err?.response?.data?.message :  'Signup failed! Please try again.';
            setError(errorMessage);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, mt: 8, textAlign: 'center' }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    Sign Up
                </Typography>
                <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 2 }}>
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
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        required
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    {success && (
                        <Typography color="success" variant="body2" sx={{ mt: 1 }}>
                            {success}
                        </Typography>
                    )}
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                        Sign Up
                    </Button>
                </Box>
                <Typography variant="body2">
                    Already have an account? <a href="/login">Login</a>
                </Typography>
            </Paper>
        </Container>
    );
};

export default Signup;
