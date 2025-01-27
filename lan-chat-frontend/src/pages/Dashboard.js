import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Menu,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { logout } = useContext(AuthContext);
    const [users, setUsers] = useState([]); // Initialize as an empty array
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);

    // Fetch users from /api/user/all
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/user/all', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`, // Token required
                    },
                });
                console.log('API Response:', response.data); // Debug API response
                setUsers(response.data.users); // Set users
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        fetchUsers();
    }, []);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ marginRight: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                        <Avatar />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon fontSize="small" sx={{ marginRight: 1 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="persistent"
                open={drawerOpen}
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {Array.isArray(users) &&
                            users.map((user) => (
                                <ListItem key={user.id} button>
                                    <ListItemAvatar>
                                        <Avatar>{user.first_name?.[0] || 'U'}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${user.first_name || ''} ${user.last_name || ''}`}
                                        secondary={user.email}
                                    />
                                </ListItem>
                            ))}
                    </List>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <Toolbar />
                <Typography variant="h4" gutterBottom>
                    Welcome to the Dashboard
                </Typography>
                <Typography variant="body1">
                    Select a user from the sidebar to start chatting.
                </Typography>
            </Box>
        </Box>
    );
};

export default Dashboard;
