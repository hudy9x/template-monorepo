import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function Home() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4">Template Monorepo</h1>
                <p className="text-xl text-muted-foreground">
                    A modern full-stack monorepo template with React, Hono, and Prisma
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>🚀 Quick Start</CardTitle>
                        <CardDescription>Get up and running in minutes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <code className="text-sm bg-muted px-2 py-1 rounded">pnpm install</code>
                            <p className="text-sm text-muted-foreground mt-1">Install dependencies</p>
                        </div>
                        <div>
                            <code className="text-sm bg-muted px-2 py-1 rounded">pnpm dev:all</code>
                            <p className="text-sm text-muted-foreground mt-1">Start API and web app</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>📦 Tech Stack</CardTitle>
                        <CardDescription>Modern tools for full-stack development</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            <li><strong>Frontend:</strong> React 19 + Vite + Tailwind CSS</li>
                            <li><strong>Backend:</strong> Hono.js (Fast & Lightweight)</li>
                            <li><strong>Database:</strong> Prisma ORM</li>
                            <li><strong>UI:</strong> shadcn/ui components</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>🏗️ Project Structure</CardTitle>
                        <CardDescription>Organized monorepo workspace</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm font-mono">
                            <li>📁 apps/api - Hono API server</li>
                            <li>📁 apps/web - React application</li>
                            <li>📁 packages/database - Prisma client</li>
                            <li>📁 packages/api-client - Type-safe API client</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>✨ Features</CardTitle>
                        <CardDescription>Everything you need to build</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            <li>✅ Type-safe API client with interceptors</li>
                            <li>✅ React Router with loaders & actions</li>
                            <li>✅ Shared packages across apps</li>
                            <li>✅ Hot reload for development</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>🎯 Try It Out</CardTitle>
                    <CardDescription>See the template in action</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        The Test page demonstrates a full-stack CRUD application with API integration,
                        form handling, and data display using shadcn/ui components.
                    </p>
                    <Button asChild>
                        <Link to="/test">View Test Page →</Link>
                    </Button>
                </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
                <p>
                    For detailed documentation, check the{' '}
                    <a
                        href="https://github.com/your-repo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        README.md
                    </a>
                </p>
            </div>
        </div>
    );
}
