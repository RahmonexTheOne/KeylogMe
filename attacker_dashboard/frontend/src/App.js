import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VictimDetails from './pages/VictimDetails';
import CommandsPage from './pages/CommandsPage';
import StatisticsPage from './pages/StatisticsPage';
import VictimsPage from './pages/VictimsPage';
import KeystrokesPage from './pages/KeystrokesPage'; // Page pour les frappes
import ScreenshotsPage from './pages/ScreenshotsPage'; // Page pour les captures
import BrowserPage from './pages/BrowserPage'; // Page pour l'historique

// --- Thème Moderne avec Texte Plus Petit ---
const modernTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2979ff', // Un bleu vif et moderne
      light: '#75a7ff',
      dark: '#004ecb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff4081', // Un rose/rouge vif pour les accents
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a0f', // Un gris très foncé, presque noir
      paper: '#151521', // Un bleu-gris très sombre pour les cartes
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontSize: '1.5rem', // Texte plus petit
      fontWeight: 700,
    },
    h6: {
      fontSize: '1.1rem', // Texte plus petit
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#151521',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#2979ff',
            borderRadius: '4px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(145deg, #1e1e30, #151521)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundImage: 'linear-gradient(45deg, #2979ff, #75a7ff)',
          boxShadow: '0 4px 15px rgba(41, 121, 255, 0.4)',
          fontWeight: 600,
          '&:hover': {
            boxShadow: '0 6px 20px rgba(41, 121, 255, 0.6)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(90deg, #151521, #1e1e30)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'linear-gradient(180deg, #1e1e30, #151521)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
});

const drawerWidth = 200; // Barre latérale plus petite

function App() {
  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Navbar drawerWidth={drawerWidth} />
          <Sidebar drawerWidth={drawerWidth} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              minHeight: '100vh',
              pt: '64px', // Espace pour la Navbar
            }}
          >
            <Box sx={{ p: 2, maxWidth: '100%' }}> {/* Pleine largeur et padding réduit */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/victim/:victimId" element={<VictimDetails />} />
                <Route path="/commands" element={<CommandsPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/victims" element={<VictimsPage />} />
                <Route path="/keystrokes" element={<KeystrokesPage />} />
                <Route path="/screenshots" element={<ScreenshotsPage />} />
                <Route path="/browser" element={<BrowserPage />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;