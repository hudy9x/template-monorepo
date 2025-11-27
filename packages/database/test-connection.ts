import dotenv from "dotenv";
import pg from "pg";

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

console.log("🔍 Testing database connection...");
console.log(`📍 Connection string: ${connectionString?.replace(/:[^:@]+@/, ':****@')}`); // Hide password

const client = new pg.Client({
    connectionString,
});

async function testConnection() {
    try {
        console.log("⏳ Attempting to connect...");
        await client.connect();
        console.log("✅ Successfully connected to PostgreSQL!");

        const result = await client.query("SELECT version()");
        console.log("📊 PostgreSQL version:", result.rows[0].version);

        await client.end();
        console.log("👋 Connection closed");
        process.exit(0);
    } catch (error) {
        console.error("❌ Connection failed!");
        console.error("Error details:", error);

        if (error instanceof Error) {
            if (error.message.includes("ECONNREFUSED")) {
                console.log("\n💡 Tip: PostgreSQL is not running or not accessible at this address");
                console.log("   - Make sure PostgreSQL is started");
                console.log("   - Check if the host and port are correct");
            } else if (error.message.includes("ETIMEDOUT")) {
                console.log("\n💡 Tip: Connection timed out");
                console.log("   - The database server might be unreachable");
                console.log("   - Check your network connection");
                console.log("   - Verify the DATABASE_URL is correct");
            } else if (error.message.includes("authentication")) {
                console.log("\n💡 Tip: Authentication failed");
                console.log("   - Check your database username and password");
            }
        }

        process.exit(1);
    }
}

testConnection();
