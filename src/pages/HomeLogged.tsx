import { FC, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import GuessCard from '../components/ui/GuessCard';
import { FetchGuessType } from '../models/guess';
import { LocationType } from '../models/location';
import useMediaQuery from '../hooks/useMediaQuery';

const HomeLogged: FC = () => {
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
        setGuesses(placeholderGuesses)
        setLocations(placeholderLocations)
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
                        <GuessCard key={index}
                            imageUrl={guess.locationImage}
                            errorDistance={guess.errorDistance}
                            width={450}
                            height={300}
                        />
                    ))}
                </Box>
                {/* Load more button */}
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
                            width={450}
                            height={300}
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
        </>
    );
};

export default HomeLogged;