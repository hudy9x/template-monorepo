import { createBrowserRouter, redirect } from 'react-router';
import Root from './pages/Root.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Test from './pages/Test.tsx';
import NotFound from './pages/NotFound.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Root,
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
                loader: async () => {
                    const response = await fetch('/api/tests');
                    if (!response.ok) {
                        throw new Error('Failed to fetch tests');
                    }
                    return response.json();
                },
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
