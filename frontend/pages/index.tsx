import Link from 'next/link';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <Link href="/admin">
                <a>Go to Admin Dashboard</a>
            </Link>
        </div>
    );
};

export default Home;