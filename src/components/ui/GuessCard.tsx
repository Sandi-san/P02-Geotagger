import { Box, Button, IconButton, Typography } from "@mui/material"
import { FC, useState } from "react"
import theme from "../../theme"
import useMediaQuery from "../../hooks/useMediaQuery"
import getValidImagePath from "../../utils/validImagePath"

interface GuessCardProps {
    imageUrl: string
    isLocked?: boolean //display lock icon on card?
    errorDistance?: number //display error distance on card?
    width?: number, height?: number //override width/height?
    isUser?: boolean, //display delete/edit options?
    id?: number, //id of location (for edit/delete)
}

const GuessCard: FC<GuessCardProps> = ({
    imageUrl,
    isLocked = false,
    errorDistance = -1,
    width = 300,
    height = 200,
    isUser = false,
    id,
}) => {
    //called if image from imageUrl cannot be loaded
    const [imageError, setImageError] = useState(false);

    return (
        <Box
            sx={{
                position: 'relative', //contain the Locked overlays
                width: { width },
                height: { height },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden', //content (image) stays within bounds
                borderRadius: 3, //rounded corners
                //   boxShadow: 3, //drop shadow
                bgcolor: 'background.paper', //background color of the card
            }}
        >
            {isUser && (
                <>
                    {/* Edit button */}
                    <Button
                        color="primary"
                        sx={{
                            position: 'absolute',
                            left: '1.5vh',
                            top: '1.5vh',
                            bgcolor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.light',
                            },
                            minWidth: '6vh',
                            minHeight: '6vh',
                        }}
                        onClick={() => console.log(`Edit location ${id}`)}
                    >
                        <Box component="img" src="/icon-edit.svg" alt="+" sx={{ height: '3vh' }} />
                    </Button>
                    {/* Delete button */}
                    <Button
                        color="primary"
                        sx={{
                            position: 'absolute',
                            right: '1.5vh',
                            top: '1.5vh',
                            bgcolor: '#9B6161',
                            '&:hover': {
                                bgcolor: 'coral',
                            },
                            minWidth: '6vh',
                            minHeight: '6vh',
                        }}
                        onClick={() => console.log(`Delete location ${id}`)}
                    >
                        <Box component="img" src="/icon-trash.svg" alt="X" sx={{ height: '4vh' }} />
                    </Button>
                </>
            )}
            {/* Image element */}
            {!imageError ? (
                <Box
                    component="img"
                    src={getValidImagePath(imageUrl)}
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
                    <Box component="img" src="/icon-lock.svg" alt="Lock" sx={{ height: 40 }} />
                </Box>
            )}
            {/* ErrorDistance green overlay */}
            {errorDistance != -1 && (
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
                    <Typography color="primary.contrastText" variant="body2" sx={{
                        fontSize: '3vh'
                    }} >{errorDistance} m</Typography>
                </Box>
            )}
        </Box>
    )
}
export default GuessCard