import { Outlet, Link } from 'react-router';
import '../App.css';

export default function Root() {
    return (
        <div className="app">
            <nav style={{
                padding: '1rem',
                borderBottom: '1px solid #646cff',
                marginBottom: '2rem',
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center'
            }}>
                <Link to="/" style={{ color: '#646cff', textDecoration: 'none' }}>
                    Home
                </Link>
                <Link to="/about" style={{ color: '#646cff', textDecoration: 'none' }}>
                    About
                </Link>
                <Link to="/test" style={{ color: '#646cff', textDecoration: 'none' }}>
                    Test
                </Link>
            </nav>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
