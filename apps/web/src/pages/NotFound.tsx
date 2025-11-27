import { Link } from 'react-router';

export default function NotFound() {
    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/" style={{ color: '#646cff', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>
                Go back to Home
            </Link>
        </div>
    );
}
