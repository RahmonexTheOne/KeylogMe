import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { People as PeopleIcon } from '@mui/icons-material';

const VictimsPage = () => {
    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Toutes les Victimes
            </Typography>
            <Paper sx={{ p: 3, minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" align="center">
                    Aucune victime enregistrée pour le moment.
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    Assurez-vous que les machines cibles exécutent le keylogger et sont connectées au réseau.
                </Typography>
            </Paper>
        </Box>
    );
};

export default VictimsPage;