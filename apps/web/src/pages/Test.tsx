import { useLoaderData, useFetcher } from 'react-router';
import { useState } from 'react';

interface Test {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
}

export default function Test() {
    const tests = useLoaderData() as Test[];
    const fetcher = useFetcher();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        fetcher.submit(
            { name, description },
            { method: 'post', action: '/test', encType: 'application/json' }
        );

        // Clear form after submission
        if (fetcher.state === 'idle') {
            setName('');
            setDescription('');
        }
    };

    const isSubmitting = fetcher.state !== 'idle';

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Test Data</h1>

            {/* Form to add new test */}
            <div style={{
                marginBottom: '2rem',
                padding: '1.5rem',
                border: '1px solid #646cff',
                borderRadius: '8px',
                backgroundColor: '#1a1a1a'
            }}>
                <h2 style={{ marginTop: 0 }}>Add New Test</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Name <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                fontSize: '1rem',
                                borderRadius: '4px',
                                border: '1px solid #646cff',
                                backgroundColor: '#242424',
                                color: 'white',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSubmitting}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                fontSize: '1rem',
                                borderRadius: '4px',
                                border: '1px solid #646cff',
                                backgroundColor: '#242424',
                                color: 'white',
                                resize: 'vertical',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !name.trim()}
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            backgroundColor: isSubmitting ? '#555' : '#646cff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Test'}
                    </button>
                </form>
            </div>

            {/* Table to display tests */}
            <div style={{ overflowX: 'auto' }}>
                <h2>All Tests ({tests.length})</h2>
                {tests.length === 0 ? (
                    <p style={{ color: '#888' }}>No tests found. Add one using the form above!</p>
                ) : (
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginTop: '1rem',
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: '#1a1a1a', borderBottom: '2px solid #646cff' }}>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Description</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tests.map((test) => (
                                <tr
                                    key={test.id}
                                    style={{
                                        borderBottom: '1px solid #333',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <td style={{ padding: '1rem' }}>{test.id}</td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{test.name}</td>
                                    <td style={{ padding: '1rem', color: '#aaa' }}>
                                        {test.description || <em style={{ color: '#666' }}>No description</em>}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#aaa' }}>
                                        {new Date(test.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
