import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { Assessment as AssessmentIcon } from '@mui/icons-material';

const StatisticsPage = () => {
    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Statistiques
            </Typography>
            <Paper sx={{ p: 3, minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" align="center">
                    Les statistiques ne sont pas encore disponibles.
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                    Veuillez collecter plus de données pour afficher des graphiques détaillés.
                </Typography>
            </Paper>
        </Box>
    );
};

export default StatisticsPage;