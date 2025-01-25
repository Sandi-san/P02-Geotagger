import { forwardRef } from 'react';
import { Box, Typography, Button } from '@mui/material';

const SettingsSavedConformation = forwardRef((
    { handleClose }: { handleClose: () => void },
    ref) => {
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
                <Typography variant="h6" component="h2" gutterBottom>
                    Information changed
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    Your settings are saved.
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

export default SettingsSavedConformation;