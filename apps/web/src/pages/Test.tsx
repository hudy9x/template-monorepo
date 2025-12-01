import { useLoaderData, useFetcher } from 'react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <h1 className="text-4xl font-bold mb-8">Test Data</h1>

            {/* Form Card */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Add New Test</CardTitle>
                    <CardDescription>
                        Create a new test entry with a name and optional description
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Name <span className="text-destructive">*</span>
                            </label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                disabled={isSubmitting}
                                placeholder="Enter test name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Description
                            </label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isSubmitting}
                                rows={3}
                                placeholder="Enter optional description"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="w-full sm:w-auto"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Test'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Tests Table Card */}
            <Card>
                <CardHeader>
                    <CardTitle>All Tests ({tests.length})</CardTitle>
                    <CardDescription>
                        View all test entries in the database
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {tests.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            No tests found. Add one using the form above!
                        </p>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="w-[200px]">Created At</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tests.map((test) => (
                                        <TableRow key={test.id}>
                                            <TableCell className="font-medium">{test.id}</TableCell>
                                            <TableCell className="font-semibold">{test.name}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {test.description || <em className="text-muted-foreground/60">No description</em>}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(test.createdAt).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
