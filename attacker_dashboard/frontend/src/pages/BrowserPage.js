import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, CircularProgress, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const BrowserPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllHistory = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/browser-history');
                const data = await response.json();
                setHistory(data);
            } catch (error) {
                console.error('Error fetching browser history:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllHistory();
    }, []);

    const columns = [
        { field: 'victim_id', headerName: 'ID Victime', width: 150, renderCell: (params) => <Chip label={params.value.substring(0, 8) + '...'} size="small" color="primary" /> },
        { field: 'timestamp', headerName: 'Timestamp', width: 180 },
        { field: 'title', headerName: 'Titre', width: 300, flex: 1 },
        { field: 'url', headerName: 'URL', width: 400, flex: 1, renderCell: (params) => <a href={params.value} target="_blank" rel="noopener noreferrer" style={{ color: '#2979ff' }}>{params.value}</a> },
    ];

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>Historique du Navigateur</Typography>
            <Paper sx={{ p: 2, height: '75vh' }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <DataGrid rows={history} columns={columns} getRowId={(row) => row.id} />
                )}
            </Paper>
        </Box>
    );
};

export default BrowserPage;