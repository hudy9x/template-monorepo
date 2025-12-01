import { Outlet, Link } from 'react-router';
import { Button } from '@/components/ui/button';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b">
                <nav className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold">Template Monorepo</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link to="/">Home</Link>
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link to="/test">Test</Link>
                            </Button>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="border-t py-6 mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>Built with React, Vite, Hono, and Prisma</p>
                </div>
            </footer>
        </div>
    );
}
