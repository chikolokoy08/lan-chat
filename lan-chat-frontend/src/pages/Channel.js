import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Paper, Input } from '@mui/material';
import axios from 'axios';

const Channel = () => {
    const { channelKey } = useParams(); // Extract clicked user ID from URL
    const currentUserId = JSON.parse(localStorage.getItem('user')).user.id; // Get current user ID
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [file, setFile] = useState(null);
    const intervalRef = useRef(null);

    // Fetch messages in a loop
    useEffect(() => {
        if (channelKey) {
            intervalRef.current = setInterval(async () => {
                try {
                    const response = await axios.post('/api/channel/ping', {
                        channel_key: channelKey,
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('userToken')}`, // Token required
                        }
                    });
                    setMessages(response.data.thread); // Update messages
                } catch (err) {
                    console.error('Error fetching messages:', err);
                }
            }, 3000); // Fetch every 3 seconds
        }

        return () => clearInterval(intervalRef.current); // Cleanup on unmount
    }, [channelKey]);

    // Send a message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await axios.post('/api/channel/send', {
                channel_key: channelKey,
                message: newMessage,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`, // Token required
                }
            });
            setNewMessage(''); // Clear input field
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    // Upload a file
    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('channel_key', channelKey);

        try {
            await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setFile(null); // Clear file input
        } catch (err) {
            console.error('Error uploading file:', err);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* Chat UI */}
            <Typography variant="h5" gutterBottom>
                Chat with User
            </Typography>
            <Paper sx={{ height: 400, overflowY: 'auto', mb: 2, p: 2 }}>
                <List>
                    {messages.map((msg, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={msg.sender_id === currentUserId ? 'You' : `User ${msg.sender_id}`}
                                secondary={msg.content || `File: ${msg.file_url}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Message Input */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button variant="contained" onClick={handleSendMessage}>
                    Send
                </Button>
            </Box>

            {/* File Upload */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <Button variant="contained" onClick={handleUpload}>
                    Upload
                </Button>
            </Box>
        </Box>
    );
};

export default Channel;
