import React, { useEffect, useState, useRef } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Paper, Input, Typography } from '@mui/material';
import axios from 'axios';

const ChatBox = ({ selectedUser }) => {
    const currentUserId = JSON.parse(localStorage.getItem('user')).user.id; // Get current user ID
    const [channelKey, setChannelKey] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [file, setFile] = useState(null);
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
    const intervalRef = useRef(null);
    const chatContainerRef = useRef(null);
    const scrollRef = useRef(null);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    // Create or fetch a channel on mount
    useEffect(() => {
        const createChannel = async () => {
            try {
                const response = await axios.post('/api/channel/create',
                    {
                        user_ids: [Number(currentUserId), Number(selectedUser.id)],
                    },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }}
                );
                console.log(response.data.channel.channel_key);
                setChannelKey(response.data.channel.channel_key); // Save channel key
                setIsAutoScrollEnabled(true);
            } catch (err) {
                console.error('Error creating channel:', err);
            }
        };

        createChannel();
    }, [currentUserId, selectedUser]);

    // Fetch messages in a loop
    useEffect(() => {
        if (channelKey) {
            intervalRef.current = setInterval(async () => {
                try {
                    const response = await axios.post('/api/channel/ping', 
                    	{
                        channel_key: channelKey
	                    },
	                    { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }});
                    setMessages(response.data.thread);
                } catch (err) {
                    console.error('Error fetching messages:', err);
                }
            }, 3000); // Fetch every 3 seconds
        }

        return () => clearInterval(intervalRef.current); // Cleanup on unmount
    }, [channelKey]);

    // Scroll to bottom when messages change, if auto-scroll is enabled
    useEffect(() => {
        if (isAutoScrollEnabled && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isAutoScrollEnabled]);

    useEffect(() => {
		    const checkScroll = () => {
		        const scrollTop = document.documentElement.scrollTop;
		        const scrollHeight = document.documentElement.scrollHeight;
		        const clientHeight = document.documentElement.clientHeight;
		        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
		        setIsAutoScrollEnabled(false);

		        if (isAtBottom) {
		        	setIsAutoScrollEnabled(true);
		        }
		    };

		    window.addEventListener('scroll', checkScroll);

		    return () => {
		        window.removeEventListener('scroll', checkScroll); // Cleanup listener on unmount
		    };
		}, []);

    // Handle user scrolling
    const handleScroll = () => {
    		setIsAutoScrollEnabled(false);
        const container = chatContainerRef.current;
        console.log(container);
//         Check if user is near the bottom
//         const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
// 
//         if (isAtBottom) {
//             setIsAutoScrollEnabled(true);
//         } else {
//             setIsAutoScrollEnabled(false);
//         }
    };

    // Send a message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await axios.post(
                '/api/channel/send',
                {
                    channel_key: channelKey,
                    user_ids: [currentUserId, selectedUser.id],
                    message: newMessage,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
            );
            setNewMessage('');
            setIsAutoScrollEnabled(true);
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
                headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
            });
            setFile(null); // Clear file input
            setIsAutoScrollEnabled(true);
        } catch (err) {
            console.error('Error uploading file:', err);
        }
    };

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }} id="chatBox"
        			ref={chatContainerRef}
            	onScroll={handleScroll}
        		>
            <div id="chatThread">
            <Paper sx={{ flex: 1, overflowY: 'auto', p: 2, mb: 2 }}>
                <List>
                    {messages.map((msg, index) => (
                        <Box
							            key={index}
							            sx={{
							                display: 'flex',
							                justifyContent: msg.sender_id === currentUserId ? 'flex-end' : 'flex-start',
							                mb: 1,
							            }}
							        >
							            <Paper
							                elevation={2}
							                sx={{
							                    p: 1.5,
							                    maxWidth: '75%',
							                    bgcolor: msg.sender_id === currentUserId ? '#1976d2' : '#e0e0e0',
							                    color: msg.sender_id === currentUserId ? 'white' : 'black',
							                    borderRadius: 5,
							                    borderTopLeftRadius: msg.sender_id === currentUserId ? 20 : 0,
							                    borderTopRightRadius: msg.sender_id === currentUserId ? 0 : 20,
							                }}
							            >	
							            		{msg.file_url ? (
	                                <img
	                                    src={`${BACKEND_URL}${msg.file_url}`} // Display the file URL
	                                    alt="Uploaded File"
	                                    style={{
	                                        maxWidth: '100%',
	                                        borderRadius: '8px',
	                                        marginTop: '8px',
	                                    }}
	                                />
	                            ) : (
	                                <Typography variant="body1">{msg.content}</Typography>
	                            )}
							                <Typography variant="caption" sx={{ mt: 0.5, display: 'block', textAlign: 'right' }}>
							                    {new Date(msg.timestamp).toLocaleTimeString()}
							                </Typography>
							            </Paper>
							        </Box>
                    ))}
                </List>
            </Paper>
            <div ref={scrollRef}></div>
            </div>
            <div id="sendBox">
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
	            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
	                <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
	                <Button variant="contained" onClick={handleUpload}>
	                    Upload
	                </Button>
	            </Box>
            </div>
        </Box>
    );
};

export default ChatBox;
