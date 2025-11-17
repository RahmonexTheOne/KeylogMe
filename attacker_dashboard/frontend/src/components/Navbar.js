import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  MarkEmailRead as MarkReadIcon,
} from '@mui/icons-material';

const Navbar = ({ drawerWidth }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  
  const notifications = [
    { id: 1, message: 'Nouvelle victime connectée: PC-WIN-01', read: false },
    { id: 2, message: 'Mots-clé "banque" détectés', read: false },
    { id: 3, message: 'Capture d\'écran reçue de PC-WIN-01', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'primary.main' }}>
            <strong>Cyber</strong>Watch
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="large" color="primary" onClick={handleNotificationMenu}>
              <Badge badgeContent={unreadCount} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="primary"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu Notifications */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{ sx: { width: '320px', maxHeight: '400px' } }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <List sx={{ p: 0 }}>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <ListItem key={notif.id} button onClick={handleNotificationClose} sx={{ backgroundColor: notif.read ? 'transparent' : 'rgba(41, 121, 255, 0.1)' }}>
                <ListItemText primary={notif.message} secondary="Il y a un instant" />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Aucune nouvelle notification" />
            </ListItem>
          )}
        </List>
        {unreadCount > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1 }}>
              <MenuItem onClick={handleNotificationClose}>
                <ListItemIcon><MarkReadIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Tout marquer comme lu" />
              </MenuItem>
            </Box>
          </>
        )}
      </Menu>

      {/* Menu Utilisateur */}
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Paramètres" />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;