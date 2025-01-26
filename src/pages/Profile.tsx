import { FC, useEffect, useState } from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import GuessCard from '../components/ui/GuessCard';
import { FetchGuessType } from '../models/guess';
import { LocationType } from '../models/location';
import useMediaQuery from '../hooks/useMediaQuery';
import userStore from '../stores/user.store';
import { UserType } from '../models/user';
import Layout from '../components/ui/Layout';
import getValidImagePath from '../utils/validImagePath';

const Profile: FC = () => {
    const { isMobile } = useMediaQuery(720)

    //TODO: load GuessCard images from DB


    //TODO: backend paginated fetch Guesses: take 3

    //states for Guesses
    const [guesses, setGuesses] = useState<FetchGuessType[]>([]); //array to hold fetched guesses
    const [pageGuess, setPageGuess] = useState(1); //current page for fetching guesses
    const [loadingGuess, setLoadingGuess] = useState(false); //loading state for button

    //states for Locations
    const [locations, setLocations] = useState<LocationType[]>([]); //array to hold fetched locations
    const [pageLocation, setPageLocation] = useState(1)
    const [loadingLocation, setLoadingLocation] = useState(false)


    //fetch guesses from backend
    const fetchGuesses = async (page: number) => {
        setLoadingGuess(true); //set loading while fetching
        try {
            //TODO: call actual route
            const response = await fetch(`/api/guesses?page=${page}&limit=3`); // Replace with your actual API endpoint
            const data = await response.json();
            setGuesses((prev) => [...prev, ...data]); //append new guesses to the existing array
        } catch (error) {
            console.error('Error fetching guesses:', error);
        } finally {
            setLoadingGuess(false); //stop loading after fetch
        }
    };

    //fetch locations from backend
    const fetchLocations = async (page: number) => {
        console.log("TODO")
    };

    useEffect(() => {
        const placeholderGuesses: FetchGuessType[] = [
            {
                id: 1,
                errorDistance: 100,
                locationImage: '/placeholder1.jpg',
                locationId: 1,
                userId: 1
            },
            {
                id: 2,
                errorDistance: 200,
                locationImage: '/placeholder2.jpg',
                locationId: 2,
                userId: 1
            },
            {
                id: 3,
                errorDistance: 300,
                locationImage: '/placeholder1.jpg',
                locationId: 3,
                userId: 1
            },
            {
                id: 4,
                errorDistance: 400,
                locationImage: '/placeholder2.jpg',
                locationId: 4,
                userId: 1
            },
            {
                id: 5,
                locationImage: '/placeholder1.jpg',
                errorDistance: 500,
                locationId: 5,
                userId: 1
            },
        ]
        const placeholderLocations: LocationType[] = [
            {
                id: 1,
                image: '/placeholder1.jpg',
                userId: 1,
                lat: 0,
                lon: 0
            },
            {
                id: 2,
                image: '/placeholder2.jpg',
                userId: 1,
                lat: 0,
                lon: 0
            },
            {
                id: 3,
                image: '/placeholder1.jpg',
                userId: 1,
                lat: 0,
                lon: 0
            },
        ]
        // setGuesses(placeholderGuesses)
        // setLocations(placeholderLocations)
        // fetchGuesses(1); // Load the first set of guesses
    }, []);


    const handleLoadMoreGuesses = () => {
        setPageGuess((prev) => prev + 1); // Increment the page number
        fetchGuesses(pageGuess + 1); // Fetch the next page
    };

    const handleLoadMoreLocations = () => {
        setPageLocation((prev) => prev + 1); // Increment the page number
        fetchLocations(pageLocation + 1); // Fetch the next page
    };

    //TODO: open Location when clicking on Card


    const { image, firstName, lastName } = userStore.user as UserType

    return (
        <Layout>
            {/* First section */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center', //vertical center
                    textAlign: 'left',
                    paddingTop: '4vh',
                    marginLeft: '4vh',
                }}
            >
                <Avatar
                    src={
                        image
                            ? getValidImagePath(image)
                            : '/placeholder-avatar.png'
                    }
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
            {guesses.length > 0 ? (
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
                                imageUrl={guess.locationImage}
                                errorDistance={guess.errorDistance}
                            />
                        ))}
                    </Box>
                    <Button
                        variant="outlined"
                        color='primary'
                        onClick={handleLoadMoreGuesses}
                        disabled={loadingGuess} //disable while loading
                        sx={{ marginTop: 2, minWidth: 150, flex: 2, border: 2 }}
                    >
                        {loadingGuess ? 'Loading...' : 'Load more'}
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
            {locations.length > 0 ? (
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
                        disabled={loadingLocation}
                        sx={{ marginTop: 2, minWidth: 150, flex: 2, border: 2 }}
                    >
                        {loadingLocation ? 'Loading...' : 'Load more'}
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
                        onClick={() => console.log("Open add location")}
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