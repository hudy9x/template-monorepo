import { createBrowserRouter, redirect } from 'react-router';
import Layout from './pages/Layout.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Test from './pages/Test.tsx';
import NotFound from './pages/NotFound.tsx';
import ErrorBoundary from './pages/ErrorBoundary.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Layout,
        ErrorBoundary: ErrorBoundary,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: 'about',
                Component: About,
            },
            {
                path: 'test',
                Component: Test,
                ErrorBoundary: ErrorBoundary,
                // Loader: Fetch all test data from API before rendering the page
                // This runs on navigation to /test and provides data via useLoaderData()
                loader: async () => {
                    const response = await fetch('/api/tests');
                    if (!response.ok) {
                        throw new Error('Forget to start API server => pnpm dev:api');
                    }
                    return response.json();
                },
                // Action: Handle form submissions to create new test entries
                // This runs when a form is submitted to /test and redirects back after success
                action: async ({ request }) => {
                    const formData = await request.json();
                    const response = await fetch('/api/tests', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });
                    if (!response.ok) {
                        throw new Error('Failed to create test');
                    }
                    return redirect('/test');
                },
            },
        ],
    },
    {
        path: '*',
        Component: NotFound,
    },
]);
