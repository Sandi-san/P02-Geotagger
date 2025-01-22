import React, { FC } from 'react';
import { Box, Typography, Alert } from '@mui/material';

interface ErrorDisplayProps {
    message: string;
}

const ErrorDisplay: FC<ErrorDisplayProps> = ({ message }) => {
    return (
        //TODO: display as widget
        <Box sx={{ marginTop: 2, width: '100%' }}>
            <Alert severity="error">
                <Typography variant="body1">{message}</Typography>
            </Alert>
        </Box>
    );
};

export default ErrorDisplay;
