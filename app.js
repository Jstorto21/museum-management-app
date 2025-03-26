
//  Joseph Storto 
// 3/17/2024
// Node.js implementation code adapted from osu-cs340-ecampus/nodejs-starter-app
// Scope: Code from starter app adapted to handle Node.js and Handlebars general implementation and boilerplate and functionality
// Original code contained in navigation, layout, SQL queries, data verification, and specific implementation details
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 
// Code for adding files to display in web application copied and adapted from mdn web docs.
// Source: https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications


/*
    SETUP
*/
// Import Express
const express = require('express');
const app = express();
const PORT = 9546;

app.use(express.json())        
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
const path = require('path');

// Import Database Connector
const db = require('./database/db-connector');

// Import and Configure Handlebars
const { engine } = require('express-handlebars');
app.engine('.hbs', engine({ extname: ".hbs" }));  
app.set('view engine', '.hbs');                 
app.set('views', './views');                     // Explicitly set views directory

// Serve Static Files - source cited above
app.use(express.static(path.join(__dirname, 'public')));
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));


/*
    ROUTES
*/
// Home (index.hbs)
app.get('/', (req, res) => {   
    res.render('index'); 
});                 


// Departments (departments.hbs)
// Get Department (READ)
app.get('/departments', function(req, res){

    let getDepartment = "SELECT * FROM Departments;"  // SQL query to get all departments
    db.pool.query(getDepartment, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(500);  // Return server error if query fails
        } else {
            res.render('departments', { departments: rows });  // Render departments page with data
        }
    });
});

// Add Department (CREATE)
app.post('/add-department', (req, res) => {
    let data = req.body;  // Get data from request body

    // Validate department name
    if (!data.departmentName || data.departmentName.trim() === '') {
        return res.status(400).json({ error: "Department Name is required." });
    }

    // Check if department already exists
    let checkQuery = `SELECT * FROM Departments WHERE departmentName = ?`;
    db.pool.query(checkQuery, [data.departmentName], (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Database error occurred." });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: "Department already exists." });
        }

        // If department does not exist, insert it
        let insertQuery = `INSERT INTO Departments (departmentName) VALUES (?)`;
        db.pool.query(insertQuery, [data.departmentName], (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ error: "Database error occurred." });
            }

            res.status(200).json({
                departmentID: results.insertId,
                departmentName: data.departmentName
            });
        });
    });
});

// Delete Department (DELETE)
app.delete('/delete-department-ajax', function(req, res) {
    let data = req.body;
    let departmentID = parseInt(data.departmentID);  // Ensure it's a number

    if (isNaN(departmentID)) {
        console.log("Invalid department ID:", data.departmentID);
        return res.sendStatus(400); // Bad request
    }

    let deleteQuery = `DELETE FROM Departments WHERE departmentID = ?;`;

    db.pool.query(deleteQuery, [departmentID], function(error, results, fields) {
        if (error) {
            console.log("Error deleting department:", error);
            return res.sendStatus(500); // Server error
        }

        console.log(`Department with ID ${departmentID} deleted successfully`);
        res.sendStatus(204); // Success, No Content
    });
});

// Update Department (UPDATE)
app.put('/update-department-ajax', function(req, res) {
    let data = req.body;

    let departmentID = parseInt(data.departmentID);
    let departmentName = data.departmentName;
     // Validate input
    if (!departmentID || !departmentName.trim()) {
        res.status(400).send("Invalid request: Missing department ID or name.");
        return;
    }

    let updateDepartment = `UPDATE Departments SET departmentName = '${departmentName}' WHERE departmentID = ${departmentID};`;

    db.pool.query(updateDepartment, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});


// Get Exhibits (READ)
app.get('/exhibits', function(req, res) {
    let getExhibit = `
        SELECT Exhibits.exhibitID, Exhibits.exhibitName, 
        DATE_FORMAT(Exhibits.startDate, '%m-%d-%Y') AS startDate, 
        DATE_FORMAT(Exhibits.endDate, '%m-%d-%Y') AS endDate, 
        Departments.departmentName, Departments.departmentID 
        FROM Exhibits 
        JOIN Departments_has_Exhibits ON Exhibits.exhibitID = Departments_has_Exhibits.exhibitID
        JOIN Departments ON Departments_has_Exhibits.departmentID = Departments.departmentID
        ORDER BY Exhibits.startDate ASC;`;  // Order by Start Date

    let getDepartmentDropdown = `SELECT departmentID, departmentName FROM Departments;`;

    db.pool.query(getExhibit, function(error, exhibitRows) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            db.pool.query(getDepartmentDropdown, function(error, departmentRows) {
                if (error) {
                    console.log(error);
                    res.sendStatus(500);
                } else {
                    res.render('exhibits', { 
                        exhibits: exhibitRows,
                        departments: departmentRows
                    });
                }
            });
        }
    });
});


// Add Exhibit (CREATE)
app.post('/add-exhibit', (req, res) => {
    let data = req.body;

    if (!data.exhibitName || !data.startDate || !data.endDate || !data.departmentID) {
        return res.status(400).json({ error: "All fields are required." });
    }

    let insertQuery = `INSERT INTO Exhibits (exhibitName, startDate, endDate) VALUES (?, ?, ?);`;

    db.pool.query(insertQuery, [data.exhibitName, data.startDate, data.endDate], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Database error occurred." });
        }

        let exhibitID = results.insertId; // Get the newly inserted exhibit ID

        // Now insert the department-exhibit relationship
        let insertRelationQuery = `INSERT INTO Departments_has_Exhibits (departmentID, exhibitID) VALUES (?, ?);`;
        db.pool.query(insertRelationQuery, [data.departmentID, exhibitID], (error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Error linking exhibit to department." });
            }
            res.status(200).json({ exhibitID: exhibitID, ...data });
        });
    });
});

// Update Exhibit (UPDATE)
app.put('/update-exhibit-ajax', function(req, res) {
    let data = req.body;

    let exhibitID = parseInt(data.exhibitID);
    let exhibitName = data.exhibitName;
    let startDate = data.startDate;
    let endDate = data.endDate;

    if (!exhibitID || !exhibitName.trim() || !startDate || !endDate) {
        console.log("Invalid update request.");
        return res.sendStatus(400);
    }

    let updateQuery = `UPDATE Exhibits SET exhibitName = ?, startDate = ?, endDate = ? WHERE exhibitID = ?;`;

    db.pool.query(updateQuery, [exhibitName, startDate, endDate, exhibitID], function(error, results) {
        if (error) {
            console.log("Error updating exhibit:", error);
            return res.sendStatus(500);
        }

        console.log(`Exhibit ID ${exhibitID} updated successfully`);
        res.sendStatus(200);
    });
});

// Delete Exhibit (DELETE)
app.delete('/delete-exhibit-ajax', function(req, res) {
    let data = req.body;
    let exhibitID = parseInt(data.exhibitID);

    if (isNaN(exhibitID)) {
        console.log("Invalid exhibit ID:", data.exhibitID);
        return res.status(400).json({ error: "Invalid exhibit ID" }); // Bad request
    }

    console.log(`Deleting exhibit ID ${exhibitID}`);

    let deleteQuery = `DELETE FROM Exhibits WHERE exhibitID = ?;`;

    db.pool.query(deleteQuery, [exhibitID], function(error, results) {
        if (error) {
            console.error("Error deleting exhibit:", error);
            return res.status(500).json({ error: "Database error occurred." }); // Server error
        }

        if (results.affectedRows === 0) {
            console.log("No exhibit found with that ID.");
            return res.status(404).json({ error: "No exhibit found with that ID." });
        }

        console.log(`Exhibit with ID ${exhibitID} deleted successfully`);
        res.sendStatus(204); // Success, No Content
    });
});


// Artworks (artworks.hbs)
// Get Artwork (READ)
app.get('/artworks', function(req, res){

    let artworkTable = "SELECT artworkID, artworkName, artistName, Departments.departmentName AS department, IFNULL(Exhibits.exhibitName, 'None') AS exhibit FROM Artworks INNER JOIN Departments ON Artworks.departmentID = Departments.departmentID LEFT JOIN Exhibits ON Artworks.exhibitID = Exhibits.exhibitID ORDER BY artworkID;"

    let departmentDropdown = "SELECT departmentID, departmentName FROM Departments;"
    let exhibitDropdown = "SELECT exhibitID, exhibitName FROM Exhibits;"
    
    db.pool.query(artworkTable, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            let artworks = rows;
            db.pool.query(departmentDropdown, (error, rows, fields) => {
            
                // Save the departments
                let department = rows;
                db.pool.query(exhibitDropdown, (error, rows, fields) => {
            
                    // Save the exhibits
                    let exhibit = rows;
                    // Render the artworks page and pass query data for table and dropdowns.
                    return res.render('artworks', {artworks: artworks, department: department, exhibit: exhibit});
                });
            });
    }});
});

// Add Artwork (CREATE)
app.post('/add-artwork', (req, res) => {
    let data = req.body;

    if (!data.artworkName || data.artworkName.trim() === '') {
        return res.status(400).json({ error: "Artwork Name is required." });
    }

    // Check that the artwork does not already exist.
    let checkQuery = `SELECT * FROM Artworks WHERE artworkName = '${data.artworkName}'`;
    db.pool.query(checkQuery, (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Database error occurred." });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: "Artwork already exists." });
        }

        // Check if there is a NULL exhibit, insert correct data if so.
        let insertQuery = '';
        if (data.exhibitID == '') {
            insertQuery = `INSERT INTO Artworks (artworkName, artistName, departmentID, exhibitID)  VALUES ('${data.artworkName}', '${data.artistName}', '${data.departmentID}', NULL)`;
        }
        else{
            // If artwork does not exist, insert it
            insertQuery = `INSERT INTO Artworks (artworkName, artistName, departmentID, exhibitID)  VALUES ('${data.artworkName}', '${data.artistName}', '${data.departmentID}', '${data.exhibitID}')`;
        }
        
        db.pool.query(insertQuery, (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ error: "Database error occurred." });
            }

            res.status(200).json({
                artworkID: results.insertId,
                artworkName: data.artworkName,
                artistName: data.artistName,
                departmentID: data.departmentID,
                exhibitID : data.exhibitID
            });
        });
    });
});

// Delete Artwork (DELETE)
app.delete('/delete-artwork-ajax', function(req, res) {
    let data = req.body;
    let artworkID = parseInt(data.artworkID);  // Ensure it's a number

    if (isNaN(artworkID)) {
        console.log("Invalid artwork ID:", data.artworkID);
        return res.sendStatus(400); // Bad request
    }

    let deleteQuery = `DELETE FROM Artworks WHERE artworkID = '${artworkID}';`;

    db.pool.query(deleteQuery, function(error, results, fields) {
        if (error) {
            console.log("Error deleting artwork:", error);
            return res.sendStatus(500); // Server error
        }

        console.log(`Artwork with ID ${artworkID} deleted successfully`);
        res.sendStatus(204); // Success, No Content
    });
});


// Employees (employees.hbs)
// Get Employee (READ)
app.get('/employees', function(req, res){

    let employeeTable = "SELECT employeeID, firstName, lastName, Departments.departmentName AS department FROM Employees INNER JOIN Departments ON Employees.departmentID = Departments.departmentID;"

    let departmentDropdown = "SELECT departmentID, departmentName FROM Departments;"

    db.pool.query(employeeTable, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            let employee = rows;
            db.pool.query(departmentDropdown, (error, rows, fields) => {
            
                // Save the departments
                let department = rows;
                // Render the employees page and pass  data for table and dropdown.
                return res.render('employees', {employee: employee, department: department});
            });
    }});
});

// Add Employee (CREATE)
app.post('/add-employee', (req, res) => {
    let data = req.body;

    if (!data.firstName || data.firstName.trim() === '') {
        return res.status(400).json({ error: "First Name is required." });
    }

    // Check to make sure employee with same name does not exist.
    let checkQuery = `SELECT * FROM Employees WHERE firstName = '${data.firstName}' AND lastName = '${data.lastName}'`;
    db.pool.query(checkQuery, (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Database error occurred." });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: "Employee already exists." });
        }

        // If employee does not exist, insert it
        let insertQuery = `INSERT INTO Employees (firstName, lastName, departmentID)  VALUES ('${data.firstName}', '${data.lastName}', '${data.departmentID}')`;
        db.pool.query(insertQuery, (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).json({ error: "Database error occurred." });
            }

            res.status(200).json({
                employeeID: results.insertId,
                firstName: data.firstName,
                lastName: data.lastName,
                departmentID: data.departmentID
            });
        });
    });
});

// Delete Employee (DELETE)
app.delete('/delete-employee-ajax', function(req, res) {
    let data = req.body;
    let employeeID = parseInt(data.employeeID);  // Ensure it's a number

    if (isNaN(employeeID)) {
        console.log("Invalid employee ID:", data.employeeID);
        return res.sendStatus(400); // Bad request
    }

    let deleteQuery = `DELETE FROM Employees WHERE employeeID = '${employeeID}';`;

    db.pool.query(deleteQuery, function(error, results, fields) {
        if (error) {
            console.log("Error deleting employee:", error);
            return res.sendStatus(500); // Server error
        }

        console.log(`Employee with ID ${employeeID} deleted successfully`);
        res.sendStatus(204); // Success, No Content
    });
});


// Department-Exhibits Transaction (department_has_exhibits.hbs)
// Get Department-Exhibit (READ)
app.get('/department_has_exhibits', function(req, res) {
    let intersectionTable = `
        SELECT Departments.departmentName AS department, 
            Exhibits.exhibitName AS exhibit, 
            Departments.departmentID, Exhibits.exhibitID
        FROM Departments_has_Exhibits
        INNER JOIN Departments ON Departments_has_Exhibits.departmentID = Departments.departmentID
        INNER JOIN Exhibits ON Departments_has_Exhibits.exhibitID = Exhibits.exhibitID;
    `;
    let departmentQuery = `SELECT departmentID, departmentName FROM Departments;`;

    db.pool.query(intersectionTable, function(error, relationships) {
        if (error) {
            console.log("Error fetching relationships:", error);
            res.sendStatus(500);
        } else {
            db.pool.query(departmentQuery, function(error, departments) {
                if (error) {
                    console.log("Error fetching departments:", error);
                    res.sendStatus(500);
                } else {
                    res.render('department_has_exhibits', { 
                        relationships: relationships,
                        departments: departments
                    });
                }
            });
        }
    });
});

// Delete Department-Exhibit (DELETE)
app.delete('/delete-exhibit-relationship', function(req, res) {
    let data = req.body;
    let deleteQuery = `DELETE FROM Departments_has_Exhibits WHERE departmentID = ? AND exhibitID = ?;`;

    db.pool.query(deleteQuery, [data.departmentID, data.exhibitID], function(error) {
        if (error) {
            console.log("Error deleting relationship:", error);
            res.sendStatus(500);
        } else {
            // Also delete the exhibit from the exhibits table
            let deleteExhibitQuery = `DELETE FROM Exhibits WHERE exhibitID = ?;`;
            db.pool.query(deleteExhibitQuery, [data.exhibitID], function(error) {
                if (error) {
                    console.log("Error deleting exhibit:", error);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(204);
                }
            });
        }
    });
});

// Update Department-Exhibits (UPDATE)
app.post('/update-intersection', function(req, res) {  
    let { departmentID, exhibitID, newDepartmentID } = req.body;

    if (!departmentID || !exhibitID || !newDepartmentID) {
        console.log("Error: Missing required fields", req.body);
        return res.status(400).json({ error: "Missing required fields" });
    }

    let updateQuery = `
        UPDATE Departments_has_Exhibits 
        SET departmentID = ? 
        WHERE departmentID = ? AND exhibitID = ?;
    `;

    db.pool.query(updateQuery, [newDepartmentID, departmentID, exhibitID], function(error, results) {
        if (error) {
            console.log("Error updating relationship:", error);
            return res.sendStatus(500);
        }

        console.log(`Relationship updated: Exhibit ${exhibitID} now belongs to Department ${newDepartmentID}`);
        res.sendStatus(200);
    });
});


/*
    LISTENER
*/
app.listen(PORT, () => {
    console.log(`Express started on http://localhost:${PORT}; press Ctrl-C to terminate.`);
});
