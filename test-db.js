// Import the database connector
const db = require('./database/db-connector');

console.log("⏳ Testing MySQL connection and fetching data...");

// Define the SQL query
const query = "SELECT * FROM Exhibits;"; 

// Connect to the database and run the query
db.pool.query(query, (error, results, fields) => {
    if (error) {
        console.error("❌ Database query error:", error);
        process.exit(1); // Exit process with failure
    }

    // Check if results exist
    if (results.length === 0) {
        console.log("⚠️ No data found in Artworks table.");
    } else {
        console.log("✅ Data retrieved from MySQL:");
        console.table(results); // Display results in table format
    }

    process.exit(0); // Exit process successfully
});

