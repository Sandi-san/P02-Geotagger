import { FC, useEffect, useState } from 'react';
import { Avatar, Box, Button, DialogContent, Modal, Typography } from '@mui/material';
import Card from '../../components/ui/Card';
import { FetchGuessType } from '../../models/guess';
import { LocationType } from '../../models/location';
import useMediaQuery from '../../hooks/useMediaQuery';
import userStore from '../../stores/user.store';
import { UserType } from '../../models/user';
import Layout from '../../components/ui/Layout';
import getValidImagePath from '../../utils/validImagePath';
import { useGetGuessesQuery, useGetLocationsQuery } from '../../slices/api/user.slice';
import Loading from '../../components/ui/Loading';
import isApiError from '../../utils/apiErrorChecker';
import ErrorDisplay from '../../components/modals/ErrorDisplay';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../constants/routesConstants';

const Profile: FC = () => {
    const { isMobile } = useMediaQuery(720)
    const navigate = useNavigate()

    //states for opening Error Modal
    const [apiError, setApiError] = useState('')
    const [apiStatus, setApiStatus] = useState('')
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        if (!userStore.user) {
            console.error("Cannot access local user object on this widget! Redirecting...")
            navigate(routes.HOME)
        }
    }, []);

    const { image, firstName, lastName } = userStore.user as UserType
    const userImage = getValidImagePath(image)

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

    // Function to remove a location from the array
    const handleRemoveFromArray = (id: number) => {
        console.log("Remove location: ", id)
        setLocations((prevLocations) => prevLocations.filter(location => location.id !== id));
    };

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
            //append new guesses to array
            setGuesses((prevGuesses) => [...prevGuesses, ...dataGuesses.data])
            setPageGuessTotal(dataGuesses.meta.last_page)
        }
    }, [dataGuesses])

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

    if (locationsError) {
        if (isApiError(locationsError)) {
            setApiError(locationsError.data.message);
            setApiStatus(locationsError.status.toString());
            setShowError(true);
        }
    }
    else if (guessesError) {
        if (isApiError(guessesError)) {
            setApiError(guessesError.data.message);
            setApiStatus(guessesError.status.toString());
            setShowError(true);
        }
    }

    //show error instead of rendering page if error on api occurs
    if (locationsError || guessesError) {
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

    return (
        <Layout>
            {/* First section */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center', //vertical center
                    textAlign: 'left',
                    paddingY: '3vh',
                    marginLeft: '3vh',
                }}
            >
                <Avatar
                    src={userImage ? (userImage) :
                        ('/placeholder-avatar.png')}
                    sx={{
                        width: isMobile ? '10vh' : '12vh',
                        height: isMobile ? '10vh' : '12vh',
                        marginRight: 3,
                        marginLeft: 1,
                        bgcolor: userImage ? '' : 'grey.400',
                    }}
                />
                <Typography
                    variant="h4"
                    color="primary.dark"
                    sx={{
                        marginBottom: 0, //remove margin-bottom for better alignment
                    }}
                >
                    {firstName} {lastName}
                </Typography>
            </Box>

            {/* Second section */}
            <Box sx={{
                display: 'flex', flexDirection: 'column', textAlign: 'left', paddingTop: '4vh', marginLeft: '4vh', alignItems: 'flex-start',
                paddingBottom: isMobile ? '2vh' : 0,
            }}>
                <Typography variant="h5" color={isMobile ? 'primary' : 'primary.dark'}
                    sx={{
                        flex: 1,
                        position: 'relative',
                    }}>
                    My best guesses
                </Typography>
            </Box>
            {/* Guess Card widgets */}
            {guesses && guesses.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', marginBottom: 2, }}>
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
                            />
                        ))}
                    </Box>
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
            ) : (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'left',
                    alignItems: 'flex-start',
                    marginY: '4vh',
                    marginLeft: '4vh',
                }}>
                    <Typography variant="body2" color='primary.dark'>
                        No best guesses yet!
                    </Typography>
                    <Typography variant="body1" color='primary.dark'>
                        Start a new game and guess the location of a picture to get the results here!
                    </Typography>
                    <Button
                        variant="contained"
                        color='primary'
                        href='/'
                        sx={{ marginTop: 2, flex: 2 }}
                    >
                        Go to locations
                    </Button>
                </Box>
            )}

            {/* Third section */}
            <Box sx={{
                display: 'flex', flexDirection: 'column', textAlign: 'left', marginLeft: '4vh', alignItems: 'flex-start',
                paddingBottom: isMobile ? '2vh' : 0,
            }}>
                <Typography variant="h5" color={isMobile ? 'primary' : 'primary.dark'}
                    sx={{
                        flex: 1,
                        position: 'relative',
                    }}>
                    My uploads
                </Typography>
            </Box>
            {/* Location cards */}
            {locations && locations.length > 0 ? (
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
                                isUser={true}
                                id={location.id}
                                removeFromArray={handleRemoveFromArray}
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
            ) : (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'left',
                    alignItems: 'flex-start',
                    marginY: '4vh',
                    marginLeft: '4vh',
                    marginBottom: 16,
                }}>
                    <Typography variant="body2" color='primary.dark'>
                        No uploads yet!
                    </Typography>
                    <Typography variant="body1" color='primary.dark'>
                        Upload new location by clicking the button below or the "+" button on the navigation bar.
                    </Typography>
                    <Button
                        variant="contained"
                        color='primary'
                        href='/location/add'
                        sx={{ marginTop: 2, flex: 2 }}
                    >
                        Add location
                    </Button>
                </Box>
            )}
        </Layout>
    );
};

export default Profile;