import { FC, useEffect, useState } from 'react';
import { Box, Button, DialogContent, Modal, Typography } from '@mui/material';
import Card from '../../components/ui/Card';
import { FetchGuessType } from '../../models/guess';
import { LocationType } from '../../models/location';
import useMediaQuery from '../../hooks/useMediaQuery';
import { useGetGuessesQuery } from '../../slices/api/user.slice';
import { useGetLocationsQuery } from '../../slices/api/location.slice';
import Loading from '../../components/ui/Loading';
import isApiError from '../../utils/apiErrorChecker';
import ErrorDisplay from '../../components/modals/ErrorDisplay';

const HomeLogged: FC = () => {
    const { isMobile } = useMediaQuery(720)

    //states for opening Error Modal
    const [apiError, setApiError] = useState('')
    const [apiStatus, setApiStatus] = useState('')
    const [showError, setShowError] = useState(false)

    //states for Guesses
    const [guesses, setGuesses] = useState<FetchGuessType[]>([]); //array to hold fetched guesses
    const [pageGuess, setPageGuess] = useState(1); //current page for fetching guesses
    const [pageGuessTotal, setPageGuessTotal] = useState(1); //total pages for fetching guesses

    //states for Locations
    const [locations, setLocations] = useState<LocationType[]>([]); //array to hold fetched locations
    const [pageLocation, setPageLocation] = useState(1)
    const [pageLocationTotal, setPageLocationTotal] = useState(1); //total pages for fetching locations

    //methods of API calls from user.slice
    const { data: dataLocations, error: locationsError, isLoading: isLoadingLocation } = useGetLocationsQuery({ page: pageLocation });
    const { data: dataGuesses, error: guessesError, isLoading: isLoadingGuess } = useGetGuessesQuery({ page: pageGuess });

    //update when data changes
    useEffect(() => {
        if (dataLocations && dataLocations.data) {
            // console.log("Fetched: ", dataLocations)
            //append new locations to array
            setLocations((prevLocations) => [...prevLocations, ...dataLocations.data])
            setPageLocationTotal(dataLocations.meta.last_page)
        }
    }, [dataLocations])
    useEffect(() => {
        if (dataGuesses && dataGuesses.data) {
            setGuesses(dataGuesses.data)
            setPageGuessTotal(dataGuesses.meta.last_page)
        }
        // console.log("Guesses: ", dataGuesses)
    }, [dataGuesses])

    useEffect(() => {
        //if error or locations throws error, fill Api Error to open ErrorModal
        if (isApiError(guessesError)) {
            setApiError(`Error fetching guesses. ${guessesError.data?.message}`)
            setApiStatus(guessesError.status?.toString())
            setShowError(true);
        }
        if (isApiError(locationsError)) {
            setApiError(`Error fetching locations. ${locationsError.data?.message}`)
            setApiStatus(locationsError.status?.toString())
            setShowError(true);
        }
    }, [guessesError, locationsError]);

    const handleLoadMoreLocations = () => {
        //increment page number (if possible) and fetch next paginated locations
        if (pageLocation < pageLocationTotal)
            setPageLocation((prev) => prev + 1)
    }

    const handleLoadMoreGuesses = () => {
        //increment page number (if possible) and fetch next paginated guesses
        if (pageGuess < pageGuessTotal)
            setPageGuess((prev) => prev + 1)
    }

    if (isLoadingGuess || isLoadingLocation) {
        return <Loading />
    }

    return (
        <>
            {/* First section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', paddingTop: '4vh', marginLeft: '4vh', alignItems: 'flex-start', }}>
                <Typography variant="h4" color='primary'
                    sx={{
                        marginBottom: 2,
                        flex: 1,
                        position: 'relative',
                    }}>
                    Personal best guesses
                </Typography>
                <Typography variant="body1" color='primary.dark'>
                    Your personal best guesses appear here. Go on and try to beat your personal records or set new ones!
                </Typography>
            </Box>
            {/* Guess Card widgets */}
            {guesses && guesses.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', paddingY: 2, alignItems: 'center', marginBottom: 16, }}>
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap', //wrap child elements into the next line
                            position: 'relative',
                            padding: 2,
                            gap: 2, //space between child elements
                            justifyContent: 'center',
                        }}
                    >
                        {/* Render GuessCards dynamically */}
                        {guesses.map((guess, index) => (
                            <Card key={index}
                                imageUrl={(guess.location.image ? guess.location.image : '')}
                                errorDistance={guess.errorDistance}
                                isLocation={false}
                                width={450}
                                height={300}
                            />
                        ))}
                    </Box>
                    {/* Load more button */}
                    {pageGuess < pageGuessTotal && (
                        <Button
                            variant="outlined"
                            color='primary'
                            onClick={handleLoadMoreGuesses}
                            disabled={isLoadingGuess} //disable while loading
                            sx={{ marginTop: 2, minWidth: 150, flex: 2, border: 2 }}
                        >
                            {isLoadingGuess ? 'Loading...' : 'Load more'}
                        </Button>
                    )}
                </Box>
            )}
            {/* Show error text if fetching fails */}
            {guessesError && (
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', paddingY: 2 }}>
                    <Typography color='error' variant='h4'>
                        Error loading data.
                    </Typography>
                </Box>
            )}

            {/* Second section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', paddingTop: '4vh', marginLeft: '4vh', alignItems: 'flex-start', }}>
                <Typography variant="h4" color='primary'
                    sx={{
                        marginBottom: 2,
                        flex: 1,
                        position: 'relative',
                    }}>
                    New locations
                </Typography>
                <Typography variant="body1" color='primary.dark'>
                    New uploads from users. Try to guess all the locations by pressing on a picture.
                </Typography>
            </Box>
            {/* Location cards */}
            {locations && locations.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', paddingY: 2, alignItems: 'center', marginBottom: 16, }}>
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            position: 'relative',
                            padding: 2,
                            gap: 2,
                            justifyContent: 'center',
                        }}
                    >
                        {/* Render GuessCards dynamically */}
                        {locations.map((location, index) => (
                            <Card key={index}
                                imageUrl={location.image || ''}
                                id={location.id}
                                width={450}
                                height={300}
                            />
                        ))}
                    </Box>
                    {/* Load more button */}
                    {pageLocation < pageLocationTotal && (
                        <Button
                            variant="outlined"
                            color='primary'
                            onClick={handleLoadMoreLocations}
                            disabled={isLoadingLocation}
                            sx={{ marginTop: 2, minWidth: 150, flex: 2, border: 2 }}
                        >
                            {isLoadingLocation ? 'Loading...' : 'Load more'}
                        </Button>
                    )}
                </Box>
            )}
            {/* Show error text if fetching fails */}
            {locationsError && (
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', paddingY: 2 }}>
                    <Typography color='error' variant='h4'>
                        Error loading data.
                    </Typography>
                </Box>
            )}

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
        </>
    );
};

export default HomeLogged;