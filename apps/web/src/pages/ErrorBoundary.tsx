import { useRouteError, isRouteErrorResponse, Link } from 'react-router';

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#ff6b6b' }}>
          {error.status} {error.statusText}
        </h1>
        <p style={{ marginTop: '1rem', color: '#aaa' }}>{error.data}</p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#646cff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Go back to Home
        </Link>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#ff6b6b' }}>Error</h1>
        <p style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '4px',
          color: '#ff6b6b'
        }}>
          {error.message}
        </p>
        {import.meta.env.DEV && error.stack && (
          <>
            <p style={{ marginTop: '2rem', fontWeight: 'bold' }}>Stack trace:</p>
            <pre style={{
              marginTop: '0.5rem',
              padding: '1rem',
              backgroundColor: '#1a1a1a',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.875rem',
              color: '#aaa'
            }}>
              {error.stack}
            </pre>
          </>
        )}
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#646cff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Go back to Home
        </Link>
      </div>
    );
  } else {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#ff6b6b' }}>Unknown Error</h1>
        <p style={{ marginTop: '1rem', color: '#aaa' }}>
          An unexpected error occurred.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#646cff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Go back to Home
        </Link>
      </div>
    );
  }
}
