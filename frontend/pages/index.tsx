import Link from 'next/link';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <Link href="/admin">
                Go to Admin Dashboard
            </Link>
        </div>
    );
};

export default Home;