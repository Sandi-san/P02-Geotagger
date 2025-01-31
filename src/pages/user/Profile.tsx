import { FC, useEffect, useState } from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import GuessCard from '../../components/ui/GuessCard';
import { FetchGuessType, FetchPaginatedGuessType } from '../../models/guess';
import { FetchPaginatedLocationType, LocationType } from '../../models/location';
import useMediaQuery from '../../hooks/useMediaQuery';
import userStore from '../../stores/user.store';
import { UserType } from '../../models/user';
import Layout from '../../components/ui/Layout';
import getValidImagePath from '../../utils/validImagePath';
import { useGetGuessesQuery, useGetLocationsQuery } from '../../slices/api/user.slice';
import { computeHeadingLevel } from '@testing-library/react';
import Loading from '../../components/ui/Loading';

const Profile: FC = () => {
    const { isMobile } = useMediaQuery(720)

    const { image, firstName, lastName } = userStore.user as UserType

    //check if User avatar image can be displayed 
    const [validImage, setValidImage] = useState(false);
    const userImage = getValidImagePath(image)

    useEffect(() => {
        if (userImage !== undefined)
            setValidImage(true)
        else
            setValidImage(false)
    }, []);

    //TODO: load GuessCard images from DB


    //TODO: backend paginated fetch Guesses: take 3

    //states for Guesses
    const [guesses, setGuesses] = useState<FetchGuessType[]>([]); //array to hold fetched guesses
    const [pageGuess, setPageGuess] = useState(1); //current page for fetching guesses
    const [pageGuessTotal, setPageGuessTotal] = useState(1); //total pages for fetching guesses
    // const [loadingGuess, setLoadingGuess] = useState(false); //loading state for button

    //states for Locations
    const [locations, setLocations] = useState<LocationType[]>([]); //array to hold fetched locations
    const [pageLocation, setPageLocation] = useState(1)
    const [pageLocationTotal, setPageLocationTotal] = useState(1); //total pages for fetching locations
    // const [loadingLocation, setLoadingLocation] = useState(false)

    //methods of API calls from user.slice
    const { data: dataLocations, error: locationsError, isLoading: isLoadingLocation } = useGetLocationsQuery({ page: pageGuess });
    const { data: dataGuesses, error: guessesError, isLoading: isLoadingGuess } = useGetGuessesQuery({ page: pageLocation });


    //update when data changes
    useEffect(() => {
        if (dataLocations && dataLocations.data) {
            setLocations(dataLocations.data)
            setPageLocationTotal(dataLocations.meta.last_page)
        }
        console.log("Locations page: ", pageLocation)
        console.log("Locations: ", locations)
    }, [dataLocations])
    useEffect(() => {
        if (dataGuesses && dataGuesses.data) {
            setGuesses(dataGuesses.data)
            setPageGuessTotal(dataGuesses.meta.last_page)
        }
        console.log("Guesses page: ", pageLocation)
        console.log("Guesses: ", guesses)
    }, [dataGuesses])

    //TODO: fetch more and show on button press

    const handleLoadMoreGuesses = () => {
        if (pageGuess < pageGuessTotal)
            setPageGuess((prev) => prev + 1); // Increment the page number
    };

    const handleLoadMoreLocations = () => {
        if (pageLocation < pageLocationTotal)
            setPageLocation((prev) => prev + 1); // Increment the page number
    };

    //TODO: open Location when clicking on Card

    if (isLoadingGuess || isLoadingLocation) {
        return <Loading />
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
                        width: '12vh',
                        height: '12vh',
                        marginRight: 3,
                        marginLeft: 1,
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
            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', paddingTop: '4vh', marginLeft: '4vh', alignItems: 'flex-start', }}>
                <Typography variant="h5" color='primary.dark'
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
                            <GuessCard key={index}
                                imageUrl={(guess.location.image ? guess.location.image : '')}
                                errorDistance={guess.errorDistance}
                            />
                        ))}
                    </Box>
                    <Button
                        variant="outlined"
                        color='primary'
                        onClick={handleLoadMoreGuesses}
                        disabled={isLoadingGuess} //disable while loading
                        sx={{ marginTop: 2, minWidth: 150, flex: 2, border: 2 }}
                    >
                        {isLoadingGuess ? 'Loading...' : 'Load more'}
                    </Button>

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
                        onClick={() => console.log("Open locations")}
                        sx={{ marginTop: 2, flex: 2 }}
                    >
                        Go to locations
                    </Button>
                </Box>
            )}

            {/* Third section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', marginLeft: '4vh', alignItems: 'flex-start', }}>
                <Typography variant="h5" color='primary.dark'
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
                            <GuessCard key={index}
                                imageUrl={location.image || ''}
                            />
                        ))}
                    </Box>
                    {/* Load more button */}
                    <Button
                        variant="outlined"
                        color='primary'
                        onClick={handleLoadMoreLocations}
                        disabled={isLoadingLocation}
                        sx={{ marginTop: 2, minWidth: 150, flex: 2, border: 2 }}
                    >
                        {isLoadingLocation ? 'Loading...' : 'Load more'}
                    </Button>
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