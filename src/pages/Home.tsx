import { FC } from 'react';
import Layout from '../components/ui/Layout';
import userStore from '../stores/user.store';
import HomeLogged from './user/HomeLogged';
import HomeUnlogged from './HomeUnlogged';

//MAIN PAGE, Home Index
const Home: FC = () => {
    return (
        <Layout>
            {/* Load different Home pages depending if User is logged or not */}
            {userStore.user ? (
                <HomeLogged />
            ) : (
                <HomeUnlogged />
            )}
        </Layout>
    );
};

export default Home;