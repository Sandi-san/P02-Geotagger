import { Box, Button, DialogContent, Modal, Typography } from "@mui/material"
import { FC, useState } from "react"
import theme from "../../theme"
import getValidImagePath from "../../utils/validImagePath"
import { useNavigate } from "react-router-dom"
import DeleteQuote from "../modals/DeleteQuote"
import { useDeleteLocationMutation } from "../../slices/api/location.slice"
import ErrorDisplay from "../modals/ErrorDisplay"
import isApiError from "../../utils/apiErrorChecker"
import DeleteQuoteConformation from "../modals/DeleteQuoteConformation"

interface CardProps {
    imageUrl: string //image to display on card
    isLocked?: boolean //display lock icon on card?
    errorDistance?: number //display error distance on card?
    width?: number, height?: number //override width/height?
    isUser?: boolean, //display delete/edit options?
    isLocation?: boolean, //states if element is location (default yes) 
    id?: number, //id of displayed element (for edit/delete location or )
    removeFromArray?: (locationId: number) => void //reference function to remove object with id from array
}

const Card: FC<CardProps> = ({
    imageUrl,
    isLocked = false,
    errorDistance = -1,
    width = 300,
    height = 200,
    isUser = false,
    isLocation = true,
    id,
    removeFromArray,
}) => {
    //called if image from imageUrl cannot be loaded
    const [imageError, setImageError] = useState(false);

    const navigate = useNavigate()
    const handleOpenEditLocation = () => {
        navigate(`/location/edit/${id}`)
    }
    const handleOpenLocation = () => {
        if (isLocation && !isLocked)
            navigate(`/location/${id}`)
    }

    //states for opening Error Modal
    const [apiError, setApiError] = useState('')
    const [apiStatus, setApiStatus] = useState('')
    const [showError, setShowError] = useState(false)

    //API call for delete location
    const [deleteLocation] = useDeleteLocationMutation()

    //open/close states for Delete modal
    const [openDeleteLocationModal, setOpenDeleteLocationModal] = useState(false);
    //open the modal
    const handleOpenDeleteLocation = () => setOpenDeleteLocationModal(true);
    //close the modal
    const handleCloseDeleteLocation = () => setOpenDeleteLocationModal(false);

    //open/close states for Successful deletion modal
    const [openDeleteSuccessModal, setOpenDeleteSuccessModal] = useState(false);
    //close the modal
    const handleCloseDeleteSuccess = () => {
        setOpenDeleteSuccessModal(false)
        //call removeFromArray function from parent
        if (id && removeFromArray)
            removeFromArray(id)
    }

    const handleDeleteLocation = async () => {
        if (!id) {
            console.error("No id passed. Cannot delete location.");
            return
        }

        try {
            const deleteResponse = await deleteLocation({ id }).unwrap()
            // console.log("Response: ", deleteResponse)
            setOpenDeleteLocationModal(false)
            if (deleteResponse.response) {
                setOpenDeleteSuccessModal(true)
            }
            else {
                if (isApiError(deleteResponse)) {
                    setApiError(deleteResponse.data.message);
                    setApiStatus(deleteResponse.status.toString());
                    setShowError(true);
                }
            }
        } catch (error) {
            if (isApiError(error)) {
                setApiError(error.data.message);
                setApiStatus(error.status.toString());
                setShowError(true);
            }
        }
    }

    const formatDistance = (errorDistance: number) => {
        if(errorDistance<1000)
            return `${errorDistance} m`
        const errorKm = errorDistance/1000
        return `${errorKm.toFixed()} km`
    }

    if (showError) {
        return <Modal
            open={showError}
            onClose={() => setShowError(false)}
            aria-labelledby="error-modal-title"
            aria-describedby="error-modal-description"
        >
            <DialogContent>
                <ErrorDisplay message={apiError} errorStatus={apiStatus} handleClose={() => setShowError(false)} />
            </DialogContent>
        </Modal>
    }
    else if (openDeleteSuccessModal) {
        return <Modal
            open={openDeleteSuccessModal}
            onClose={handleCloseDeleteSuccess}
            aria-labelledby="profile-settings-title"
            aria-describedby="profile-settings-description"
        >
            <DeleteQuoteConformation
                handleClose={handleCloseDeleteSuccess}
            />
        </Modal>
    }

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
                bgcolor: 'background.paper', //background color of the card
                '&:hover': {
                    boxShadow: 3, //drop shadow
                    transform: 'scale(1.05)', //increase size by fraction
                    cursor: 'pointer',
                },
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
                        onClick={handleOpenEditLocation}
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
                        // onClick={() => console.log(`Delete location ${id}`)}
                        onClick={handleOpenDeleteLocation}
                    >
                        <Box component="img" src="/icon-trash.svg" alt="X" sx={{ height: '4vh' }} />
                    </Button>
                    <Modal
                        open={openDeleteLocationModal}
                        onClose={handleCloseDeleteLocation}
                        aria-labelledby="profile-settings-title"
                        aria-describedby="profile-settings-description"
                    >
                        <DeleteQuote
                            handleClose={handleCloseDeleteLocation}
                            handleSubmit={handleDeleteLocation}
                        />
                    </Modal>
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
                    onClick={handleOpenLocation}
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
                        bgcolor: `${theme.palette.primary.dark}1A`, //color from custom theme with alpha channel opacity (10% = 1A in hex color code)
                    }}
                    onClick={handleOpenLocation}
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
                        bgcolor: `${theme.palette.primary.main}80`, //color from custom theme with alpha channel opacity (50% = 80 in hex color code)
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
                        bgcolor: `${theme.palette.primary.main}80`, //color from custom theme with alpha channel opacity (50% = 80 in hex color code)
                        borderRadius: 'inherit',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography color="primary.contrastText" variant="body2" sx={{
                        fontSize: '3vh'
                    }} >{formatDistance(errorDistance)}</Typography>
                </Box>
            )}
        </Box >
    )
}
export default Card