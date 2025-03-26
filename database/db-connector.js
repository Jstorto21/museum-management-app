


// ./database/db-connector.js

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'DavenportCentral123!',
    database        : 'museum_db'
})

// Export it for use in our applicaiton
module.exports.pool = pool;