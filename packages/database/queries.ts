import { prisma } from "./client.js";

/**
 * Get all tests from the database
 */
export async function getAllTests() {
    return await prisma.test.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

/**
 * Create a new test
 */
export async function createTest(name: string, description?: string) {
    return await prisma.test.create({
        data: {
            name,
            ...(description !== undefined && { description }),
        },
    });
}

/**
 * Get a test by ID
 */
export async function getTestById(id: number) {
    return await prisma.test.findUnique({
        where: {
            id,
        },
    });
}
