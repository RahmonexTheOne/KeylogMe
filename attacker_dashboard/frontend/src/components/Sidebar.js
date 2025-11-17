import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  ListItemButton,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Keyboard as KeyboardIcon,
  Image as ImageIcon,
  Language as LanguageIcon,
  Terminal as TerminalIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 200;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Victimes', icon: <PeopleIcon />, path: '/victims' },
  { text: 'Frappes', icon: <KeyboardIcon />, path: '/keystrokes' },
  { text: 'Captures', icon: <ImageIcon />, path: '/screenshots' },
  { text: 'Navigateur', icon: <LanguageIcon />, path: '/browser' },
  { text: 'Commandes', icon: <TerminalIcon />, path: '/commands' },
  { text: 'Statistiques', icon: <AssessmentIcon />, path: '/statistics' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontWeight: 'bold', fontSize: '0.75rem' }}>
          Principal
        </Typography>
        <List>
          {menuItems.slice(0, 1).map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem' } }} /> {/* Smaller text */}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Typography variant="overline" sx={{ px: 2, pt: 2, color: 'text.secondary', fontWeight: 'bold', fontSize: '0.75rem' }}>
          Modules
        </Typography>
        <List>
          {menuItems.slice(1).map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem' } }} /> {/* Smaller text */}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;