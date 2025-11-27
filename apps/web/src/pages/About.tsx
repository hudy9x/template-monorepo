export default function About() {
    return (
        <div style={{ textAlign: 'center' }}>
            <h1>About Page</h1>
            <p>
                This is a template monorepo using <strong>pnpm workspaces</strong>.
            </p>
            <div style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px', margin: '2rem auto' }}>
                <h2>Tech Stack:</h2>
                <ul>
                    <li><strong>API:</strong> Hono.js</li>
                    <li><strong>Web:</strong> React + Vite</li>
                    <li><strong>Database:</strong> Prisma</li>
                    <li><strong>Routing:</strong> React Router</li>
                </ul>
            </div>
        </div>
    );
}
