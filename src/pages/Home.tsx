import { Link } from 'react-router-dom';
// import Layout from '../components/ui/Layout';
import { FC } from 'react';
import { Button } from '@mui/material';
import Layout from '../components/ui/Layout';

//MAIN PAGE
const Home: FC = () => {
    return (
        <>
            <Layout>
                <img src="./logo.svg" className="App-logo" alt="logo" />
                <p>Some text</p>
                <Button color='primary' variant='contained'>Button CTA</Button>
                <Button color='primary' variant='outlined'>Button CTA</Button>
                <Button color='secondary' variant='contained'>Button CTA</Button>
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