import RotatingHouseDisplay from '@/components/RotatingHouseDisplay';
import StaticHouseContext from '../src/components/StaticHouseContext';
import { HouseQuery } from 'living-mile-high-types';
import Link from 'next/link';
import HouseQueryContext from '@/components/HouseQueryContext';

const HOME_PAGE_QUERY: HouseQuery = {
    onHomePage: 'true'
}

const Home: React.FC = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <Link href="/admin">
                Go to Admin Dashboard
            </Link>
            <HouseQueryContext initialQuery={HOME_PAGE_QUERY}>
                <RotatingHouseDisplay interval={3000} />
            </HouseQueryContext>
        </div>
    );
};

export default Home;