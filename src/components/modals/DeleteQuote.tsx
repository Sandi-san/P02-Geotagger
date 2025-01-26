import { forwardRef } from 'react';
import { Box, Typography, Button } from '@mui/material';

const DeleteQuote = forwardRef((
    { handleClose, handleSubmit }: { handleClose: () => void, handleSubmit: () => void },
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
                Are you sure?
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                The location will be deleted. There is no undo of this action.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="outlined" color="primary"
                    sx={{ marginRight: 2 }}
                    onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary"
                    onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
        </Box>
    );
}
);

export default DeleteQuote;