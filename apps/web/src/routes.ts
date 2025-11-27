import { createBrowserRouter } from 'react-router';
import Root from './pages/Root.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
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
        ],
    },
    {
        path: '*',
        Component: NotFound,
    },
]);
