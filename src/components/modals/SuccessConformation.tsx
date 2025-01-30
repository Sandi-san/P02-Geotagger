import { forwardRef } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface SuccessConformationProps {
    title: string,
    message: string,
    handleClose: () => void,
}

const SuccessConformation = forwardRef<HTMLDivElement, SuccessConformationProps>(
    ({ title, message, handleClose }, ref) => {
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
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" component="h2" color='success' gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body1" color='success' sx={{ marginBottom: 2 }}>
                    {message}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary"
                        onClick={handleClose}>
                        Close
                    </Button>
                </Box>
            </Box>
        );
    }
);

export default SuccessConformation;