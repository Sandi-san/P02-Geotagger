import { Link } from 'react-router-dom';
// import Layout from '../components/ui/Layout';
import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Layout from '../components/ui/Layout';
import GuessCard from '../components/ui/GuessCard';

//MAIN PAGE
const Home: FC = () => {
    //TODO: load GuessCard images from DB

    return (
        <>
            <Layout>
                {/* First section */}
                <Box sx={{ display: 'flex', flexDirection: 'row', overflow: 'hidden', paddingTop: 2 }}>
                    {/* Left section: text */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            position: 'relative',
                            paddingLeft: 10,
                            maxWidth: '20%',
                            zIndex: 2, //text overlaps the image
                        }}
                    >
                        <Typography variant="h3" color='primary' sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                            Explore the world with Geotagger!
                        </Typography>
                        <Typography variant="body1" color='primary.dark' sx={{ marginY: 2 }}>
                            Geotagger allows you to post pictures and tag them on the map. Other users then try to find it via Google Maps!
                        </Typography>
                        {/* Sign up button */}
                        <Button
                            variant="contained"
                            color='primary'
                            href="/register"
                            sx={{ marginTop: 2, minWidth: 150 }}
                        >
                            Sign up
                        </Button>
                    </Box>
                    {/* Right section: image */}
                    <Box
                        sx={{
                            flex: 3,
                            position: 'relative',
                            marginLeft: -10, //overlapping with the text
                            zIndex: 1, //image is in the background
                        }}
                    >
                        <Box
                            component="img"
                            src="background-world-map.png"
                            alt="Scenic View"
                            sx={{
                                width: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>
                </Box>
                {/* {Second section} */}
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', paddingTop: 10,  alignItems: 'center', }}>
                    <Typography variant="h4" color='primary'
                        sx={{
                            marginBottom: 2,
                            flex: 1,
                            position: 'relative',
                        }}>
                        Try yourself at Geotagger!
                    </Typography>
                    <Typography variant="body1" color='primary.dark'>
                        Try to guess the location of an image by selecting a position on the map.
                    </Typography>
                    <Typography variant="body1" color='primary.dark'>
                        The result will be determined by the error distance.
                    </Typography>
                </Box>
                {/* Third section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', paddingY: 2, alignItems: 'center', marginBottom: 16, }}>
                    {/* Location card widgets */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap', //if child elements exceed width, wrap into next line
                            position: 'relative',
                            padding: 2,
                            gap: 2, //padding between child elements
                        }}
                    >
                        <GuessCard
                            imageUrl='placeholder1.jpg'
                            isLocked={true}
                        />
                        <GuessCard
                            imageUrl='placeholder2.jpg'
                            isLocked={true}
                        />
                        <GuessCard
                            imageUrl='placeholder3.jpg'
                            isLocked={true}
                        />
                    </Box>
                    {/* Sign up button */}
                    <Button
                        variant="contained"
                        color='primary'
                        href="/register"
                        sx={{ marginTop: 2, minWidth: 150, flex: 2 }}
                    >
                        Sign up
                    </Button>
                </Box>
            </Layout>
        </>
    );
};

export default Home;