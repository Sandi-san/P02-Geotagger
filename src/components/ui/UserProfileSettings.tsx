import { Box, Button, TextField, Typography } from "@mui/material"
import { FC, forwardRef } from "react"

//use forwardRef to recieve a functional component (handleClose function), required by Modal
const UserProfileSettings = forwardRef(({ handleClose }: { handleClose: () => void }, ref) => {
    return (
        <Box
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
            <Typography id="profile-settings-title" variant="h6" component="h2" gutterBottom>
                Profile Settings
            </Typography>
            <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
            />
            <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleClose}>
                    Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Cancel
                </Button>
            </Box>
        </Box>
    )
})
export default UserProfileSettings