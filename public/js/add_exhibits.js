// Joseph Storto
// 3/17/2024
// Node.js implementation code adapted from osu-cs340-ecampus/nodejs-starter-app
// Scope: Code from starter app adapted to handle Node.js and Handlebars general implementation and boilerplate and functionality
// Original code contained in navigation, layout, SQL queries, data verification, and specific implementation details
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 



// Get the add exhibit form element
let addExhibitsForm = document.getElementById('add-exhibits-form-ajax');

// Add event listener for form submission
addExhibitsForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get values from form inputs
    let exhibitName = document.getElementById("input-exhibitName").value;
    let startDate = document.getElementById("input-startDate").value;
    let endDate = document.getElementById("input-endDate").value;
    let departmentID = document.getElementById("input-departmentID").value;

    // Validate input
    if (!exhibitName.trim() || !startDate || !endDate || !departmentID) {
        console.error("All fields are required.");
        return;
    }

    // Prepare data to send
    let data = {
        exhibitName: exhibitName,
        startDate: startDate,
        endDate: endDate,
        departmentID: departmentID
    };

    // Send AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-exhibit", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log("Exhibit added successfully.");
            window.location.reload();
        } else if (xhttp.readyState == 4) {
            console.error("Error adding exhibit.");
        }
    };

    // Send data
    xhttp.send(JSON.stringify(data));
});
