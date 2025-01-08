import { Box, Typography } from "@mui/material"
import { FC, useState } from "react"
import theme from "../../theme"

interface GuessCardProps {
    imageUrl: string
    isLocked?: boolean
}

const GuessCard: FC<GuessCardProps> = ({ imageUrl, isLocked = false }) => {
    //called if image from imageUrl cannot be loaded
    const [imageError, setImageError] = useState(false);

    return (
        <Box
            sx={{
                position: 'relative', //contain the Locked overlays
                width: 300,
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden', //content (image) stays within bounds
                borderRadius: 3, //rounded corners
                //   boxShadow: 3, //drop shadow
                bgcolor: 'background.paper', //background color of the card
            }}
        >
            {/* Image element */}
            {!imageError ? (
                <Box
                    component="img"
                    src={imageUrl}
                    alt="No image"
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 'inherit',
                    }}
                    onError={() => setImageError(true)} //handle image loading error
                />
            ) : (
                // if image cannot be loaded, show text in middle of card
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 'inherit',
                        //center elements inside
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: `${theme.palette.primary.dark}1A`, //color from custom theme with alpha channel (10% = 1A in hex color code)
                    }}
                >
                <Typography
                    sx={{
                        color: 'primary.dark',
                        textAlign: 'center',
                        fontWeight: 'bold',
                    }}
                >
                    No image available.
                </Typography>
                </Box>
            )}
            {/* Locked green overlay */}
            {isLocked && (
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        bgcolor: `${theme.palette.primary.main}80`, //color from custom theme with alpha channel (50% = 80 in hex color code)
                        borderRadius: 'inherit',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Lock logo */}
                    <Box component="img" src="/lock.svg" alt="Lock" sx={{ height: 40 }} />
                </Box>
            )}
        </Box>
    )
}
export default GuessCard