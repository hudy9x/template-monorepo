import { PrismaClient } from "../generated/client/client.js";
import { withAccelerate } from "@prisma/extension-accelerate";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!,
}).$extends(withAccelerate());


async function main() {
    console.log("🌱 Starting seed...");

    // Clear existing data
    await prisma.test.deleteMany();
    console.log("🗑️  Cleared existing Test records");

    // Create seed data
    const tests = await prisma.test.createMany({
        data: [
            {
                name: "Unit Test Example",
                description: "A sample unit test for testing basic functionality",
            },
            {
                name: "Integration Test",
                description: "Tests the integration between multiple components",
            },
            {
                name: "E2E Test",
                description: "End-to-end test covering the entire user flow",
            },
            {
                name: "Performance Test",
                description: "Measures application performance under load",
            },
            {
                name: "Security Test",
                description: null, // Testing null description
            },
            {
                name: "Accessibility Test",
                description: "Ensures the application meets accessibility standards",
            },
            {
                name: "Smoke Test",
                description: "Quick verification that critical features work",
            },
            {
                name: "Regression Test",
                description: "Verifies that recent changes haven't broken existing functionality",
            },
        ],
    });

    console.log(`✅ Created ${tests.count} test records`);

    // Fetch and display the created records
    const allTests = await prisma.test.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    console.log("\n📋 Seeded Test records:");
    allTests.forEach((test) => {
        console.log(`  - ${test.name} (ID: ${test.id})`);
    });

    console.log("\n🎉 Seed completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:");
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
