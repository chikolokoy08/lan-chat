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
import { useNavigate } from 'react-router-dom';
import ChatBox from '../components/ChatBox';

const drawerWidth = 240;

const Dashboard = () => {
    const { logout } = useContext(AuthContext);
    const [users, setUsers] = useState([]); // Initialize as an empty array
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const currentUserId = JSON.parse(localStorage.getItem('user')).user.id; // Get current user ID

    const handleUserClick = (user) => {
        if (selectedUser?.id === user.id) return;
        setSelectedUser(null);
        setTimeout(()=>{
            setSelectedUser(user);
        },0);
    };

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
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    marginLeft: drawerOpen ? `${drawerWidth}px` : 0,
                    width: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
                    transition: 'margin 0.3s, width 0.3s',
                }}
            >
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
                    width: drawerOpen ? drawerWidth : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerOpen ? drawerWidth : 0,
                        transition: 'width 0.3s',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List id="userList">
                        {Array.isArray(users) &&
                            users.map((user) => (
                                <ListItem
                                    key={user.id}
                                    button="true"
                                    onClick={() => handleUserClick(user)}
                                    disabled={selectedUser?.id === user.id} // Disable if already selected
                                    sx={{
                                        bgcolor: selectedUser?.id === user.id ? 'primary.light' : 'transparent', // Highlight active user
                                        color: selectedUser?.id === user.id ? 'white' : 'inherit', // Change text color for active user
                                        '&:hover': {
                                            bgcolor: selectedUser?.id === user.id ? 'primary.light' : 'grey.200', // Hover color
                                        },
                                    }}
                                >
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
                {selectedUser ? (
                    <ChatBox selectedUser={selectedUser} /> // Pass selected user to ChatBox
                ) : (
                    <Typography variant="h4">
                        Select a user from the sidebar to start chatting.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default Dashboard;
