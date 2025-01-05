import { Link } from 'react-router-dom';
// import Layout from '../components/ui/Layout';
import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Layout from '../components/ui/Layout';

//MAIN PAGE
const Home: FC = () => {
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
                            position: 'relative',
                            zIndex: 2, // Ensure text is above the image
                            padding: 4,
                        }}
                    >
                        <Typography variant="h3" color='primary' sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                            Explore the world with Geotagger!
                        </Typography>
                        <Typography variant="body2" color='primary.dark'>
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
                            flex: 2,
                            position: 'relative',
                            marginLeft: -10, //overlapping with the text
                            zIndex: 1, // Image is in the background
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
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', paddingTop: 10, marginX: '40vh', alignItems: 'center', }}>
                    <Typography variant="h5" color='primary'
                        sx={{
                            marginBottom: 2,
                            flex: 1,
                            position: 'relative',
                        }}>
                        Try yourself at Geotagger!
                    </Typography>
                    <Typography variant="body2" color='primary.dark'>
                        Try to guess the location of an image by selecting a position on the map. The result will be determined by the error distance.
                    </Typography>
                </Box>
                {/* Third section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', paddingY: 2, alignItems: 'center', }}>
                    {/* Location card widgets */}
                    {/* TODO */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            position: 'relative',
                            padding: 4,
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                position: 'relative',
                                padding: 4,
                            }}
                        >
                            1
                        </Box>
                        <Box
                            sx={{
                                flex: 2,
                                display: 'flex',
                                position: 'relative',
                                padding: 4,
                            }}
                        >
                            2
                        </Box>
                        <Box
                            sx={{
                                flex: 3,
                                display: 'flex',
                                position: 'relative',
                                padding: 4,
                            }}
                        >
                            3
                        </Box>
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
            {/* <Layout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-6xl font-bold mb-4">E-auctions made easy!</h1>
          <p className="text-lg text-center mb-8">
            Simple way for selling your unused products, or<br></br>getting a
            deal on product you want!
          </p>
          <Link to="/auctions">
            <Button className="bg-customYellow custom-button w-full hover:bg-customYellow-dark">
              Start bidding
            </Button>
          </Link>
          <img
            src="/images/landing_page_preview.png"
            alt="Static Image"
            className="mt-auto"
          />
        </div>
      </Layout> */}
        </>
    );
};

export default Home;