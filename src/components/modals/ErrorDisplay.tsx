import React, { FC, forwardRef } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';

interface ErrorDisplayProps {
    message: string; //message to display
    errorStatus?: string; //status code
    handleClose: () => void; //function to close the widget (modal)
}

const ErrorDisplay = forwardRef<HTMLDivElement, ErrorDisplayProps>(
    ({ message, errorStatus, handleClose }, ref) => {

        //check if the string contains only numbers using a regular expression
        const isCodeNumber = (status: string | undefined): boolean => {
            if(status==undefined) return false
            return /^\d+$/.test(status);
        }

        return (
            <Box
                ref={ref}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 400 },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4, //padding between border and content
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    Oops! Error
                    {isCodeNumber(errorStatus) ? (` code ${errorStatus}`) : 
                    (errorStatus!==undefined && (` ${errorStatus}`))}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    {message}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary"
                        onClick={handleClose}>
                        Dismiss
                    </Button>
                </Box>
            </Box>
        );
    }
);

export default ErrorDisplay;