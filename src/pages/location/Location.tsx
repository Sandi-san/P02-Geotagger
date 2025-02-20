import { FC, useEffect, useState } from 'react';
import { Box, Button, DialogContent, FormControl, Modal, TextField, Typography } from '@mui/material';
import useMediaQuery from '../../hooks/useMediaQuery';
import Layout from '../../components/ui/Layout';
import theme from '../../theme';
import WorldMap from '../../components/ui/Map';
import { useCreateGuessMutation, useGetLocationQuery } from '../../slices/api/location.slice';
import isApiError from '../../utils/apiErrorChecker';
import ErrorDisplay from '../../components/modals/ErrorDisplay';
import Loading from '../../components/ui/Loading';
import getValidImagePath from '../../utils/validImagePath';
import { CreateGuessFields, useCreateGuessForm } from '../../hooks/react-hook-form/useCreateGuess';
import GuessesLeaderboard from '../../components/ui/GuessesLeaderboard';
import userStore from '../../stores/user.store';

interface LocationProps {
    locationId: number, //id of the location displayed on the page
}

const Location: FC<LocationProps> = ({ locationId }) => {
    const { isMobile } = useMediaQuery(720) //860
    //for removing padding
    const isUnpadded = useMediaQuery(1000)

    //form for creating/updating Location 
    const { handleSubmit, control, errors, setValue } = useCreateGuessForm();
    //location data
    const { data: dataLocation, error: locationError, isLoading: isLoadingLocation } = useGetLocationQuery({ id: locationId })

    const [createGuess] = useCreateGuessMutation()

    //value of error returned by api
    const [apiError, setApiError] = useState('')
    //status code returned by api
    const [apiStatus, setApiStatus] = useState('')
    //state if error has occured
    const [showError, setShowError] = useState(false)

    interface GuessType {
        address: string,
        errorDistance: number
    }
    const [guess, setGuess] = useState<GuessType>()

    //triggers a refresh in of Guesses in GuessLeaderboard
    const [refreshKey, setRefreshKey] = useState(0)

    const onSubmit = async (formData: CreateGuessFields) => {
        console.log('Form Data:', guessLocation)

        if ((formData.lat == 0 || null) || (formData.lon == 0 || null)) {
            console.log('Please select a valid location!')
            setApiError('Please select a valid location!');
            setApiStatus('404');
            setShowError(true);
            return
        }

        //create GuessType variable to later set as global guess object 
        let guessData: GuessType = ({ address: "", errorDistance: 0 })
        if (guessLocation?.address)
            guessData.address = guessLocation.address

        try {
            //call RTK Query mutation with valid formData (create guess)
            const guessResponse = await createGuess({ id: locationId, formData }).unwrap();

            //if created guess returned successfully, set data in inputs
            if (guessResponse.id) {
                console.log('Guess created successfully:', guessResponse);

                guessData.errorDistance = guessResponse.errorDistance
                setGuess(guessData)
                
                //refresh guess token for header
                if(guessResponse.user.guessTokens){
                    if(userStore.user)
                        userStore.user.guessTokens = guessResponse.user.guessTokens
                }

                setRefreshKey(prevKey => prevKey + 1)
            }
            else {
                //force call catch error block
                throw new Error()
            }
        }
        catch (err) {
            console.error("Error during creation of guess: ", err)
            if (isApiError(err)) {
                setApiError(err.data.message);
                setApiStatus(err.status.toString());
                setShowError(true);
            }
            else {
                setApiError("An unexpected error has occured.");
                setShowError(true);
            }
        }
    }

    const [guessLocation, setGuessLocation] = useState<{ lat: number; lon: number; address: string } | null>(null);

    const handleLocationSelect = (lat: number, lon: number, address: string) => {
        setGuessLocation({ lat, lon, address })
        console.log("Location:", { lat, lon });
        // console.log("Address:", address);

        //update formData
        setValue("lat", lat, { shouldValidate: true });
        setValue("lon", lon, { shouldValidate: true });
    }

    //update when data changes
    useEffect(() => {
        if (dataLocation) {
            console.log("Fetched: ", dataLocation)
        }
    }, [dataLocation])

    if (!dataLocation || isLoadingLocation) {
        return <Loading />
    }

    if (locationError) {
        if (isApiError(locationError)) {
            setApiError(locationError.data.message);
            setApiStatus(locationError.status.toString());
            setShowError(true);
        }
    }

    return (
        <Layout>
            <Box sx={{
                position: 'relative',
                display: 'flex',
                // height: '100vh',
                width: '100%',
                flexDirection: isMobile ? 'column' : 'row',
                textAlign: 'center',
                alignItems: 'stretch',
                overflow: 'hidden', //prevent accidental overflow
            }}>
                {/* Left section - Location */}
                <Box
                    sx={{
                        flex: 1,
                        // height: '100%',
                        bgcolor: 'background.paper',
                        minHeight: 0,
                    }}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* First section - Image */}
                        <Box sx={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'center',
                            //pad 8vh by default, 2vh for unpadded and 8vh when displaying mobile
                            paddingLeft: isUnpadded.isMobile ? (isMobile ? '8vh' : '2vh') : '8vh',
                            paddingRight: isMobile ? '8vh': 0,
                            overflow: 'hidden',
                        }}>
                            {/* Main text */}
                            <Typography variant="h4" component="span" sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2vh' }}>
                                <span style={{ color: theme.palette.primary.dark }}>Take a</span>
                                <span style={{ color: theme.palette.primary.main }}>&nbsp;guess</span>
                                <span style={{ color: theme.palette.primary.dark }}>!</span>
                            </Typography>
                            {/* Location image */}
                            <Box
                                component="img"
                                src={dataLocation?.image ? getValidImagePath(dataLocation?.image) : '/placeholder-image.png'}
                                alt="Location image preview"
                                sx={{
                                    marginBottom: 4,
                                    width: '100%',
                                    height: '40vh',
                                    objectFit: 'cover',
                                    backgroundColor: '#f0f0f0',
                                    display: 'inline-block', //label behaves like block but only takes up the size of the content
                                    borderRadius: 2,
                                    // width: '66%',  //set width relative on parent    
                                }}
                            />
                        </Box>

                        {/* Second section - Map */}
                        <Box sx={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'center',
                            alignItems: 'center',
                            paddingLeft: isUnpadded.isMobile ? (isMobile ? '8vh' : '2vh') : '8vh',
                            paddingRight: isMobile ? '8vh': 0,
                            overflow: 'hidden',
                        }}>
                            {/* Box for Map component */}
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '30vh',
                                    objectFit: 'cover',
                                    // border: '2px solid #ccc', // Optional border for styling
                                    backgroundColor: '#f0f0f0', // Fallback color if no image
                                }}
                            >
                                <WorldMap onSelectLocation={handleLocationSelect} />
                            </Box>
                            {/* Guess data */}
                            <Box sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                            }}>
                                <FormControl
                                    sx={{
                                        paddingRight: 2,
                                        flex: 2,
                                    }}>
                                    {/* Address field */}
                                    <TextField
                                        value={guess?.address || ''}
                                        type='text'
                                        label="Guessed location"
                                        // error={!!errors.address}
                                        // helperText={errors.address?.message}
                                        variant="outlined"
                                        fullWidth
                                        sx={{ marginY: 2 }}
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormControl
                                    sx={{
                                        flex: 1,
                                    }}>
                                    {/* Error distance field */}
                                    <TextField
                                        value={guess?.errorDistance || ''}
                                        type='text'
                                        label="Error distance"
                                        variant="outlined"
                                        fullWidth
                                        sx={{ marginY: 2 }}
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                            }
                                        }}
                                    />
                                </FormControl>
                            </Box>
                        </Box>
                        {/* Button for submit */}
                        <Box sx={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: isMobile ? 'flex-start' : 'flex-end',
                            overflow: 'hidden',
                            paddingLeft: isMobile ? '8vh' : 0,
                        }}>
                            <Button type='submit' variant="contained" color="primary">
                                Guess
                            </Button>
                        </Box>
                    </form>
                </Box>

                {/* Right section leaderboard */}
                <Box
                    sx={{
                        flex: 1,
                        height: '100vh', //stretch through entire height
                        // justifyContent: 'center',
                        // alignItems: 'center',
                        marginLeft: isUnpadded.isMobile ? 1 : 2,
                        marginRight: isUnpadded.isMobile ? '2vh' : '8vh',
                        marginTop: isMobile ? 4 : 0,
                        marginX: isMobile ? '7vh' : 0,
                        marginBottom: isMobile ? 8 : 0,
                    }}>
                    <GuessesLeaderboard locationId={locationId} refreshKey={refreshKey} />
                </Box>

            </Box>

            {showError && (
                <Modal
                    open={showError} // Modal visibility tied to the showError state
                    onClose={() => setShowError(false)} // Close the modal on backdrop click
                    aria-labelledby="error-modal-title"
                    aria-describedby="error-modal-description"
                >
                    <DialogContent>
                        <ErrorDisplay message={apiError} errorStatus={apiStatus} handleClose={() => setShowError(false)} />
                    </DialogContent>
                </Modal>
            )}
        </Layout>
    );
};

export default Location;