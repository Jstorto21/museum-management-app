// Joseph Storto
// 3/17/2024
// Node.js implementation code adapted from osu-cs340-ecampus/nodejs-starter-app
// Scope: Code from starter app adapted to handle Node.js and Handlebars general implementation and boilerplate and functionality
// Original code contained in navigation, layout, SQL queries, data verification, and specific implementation details
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


// Function to handle employee deletion
function deleteEmployee() {
    // Retrieve the employee ID from the hidden input field
    let employeeID = document.getElementById("deleteEmployeeID").value;

    // Create an object containing the employee ID to send in the request
    let data = { employeeID: employeeID };

    // Create a new XMLHttpRequest object for AJAX communication
    var xhttp = new XMLHttpRequest();

    // Configure it: DELETE request to "/delete-employee-ajax" endpoint
    xhttp.open("DELETE", "/delete-employee-ajax", true);

    // Set request header to indicate that JSON data is being sent
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define what happens when the server responds
    xhttp.onreadystatechange = () => {
        // Check if the request is complete and was successful (status 204: No Content)
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            console.log(`Successfully deleted employee ID ${employeeID}`);

            // Refresh the page after successful deletion
            window.location.reload();
        } else if (xhttp.readyState == 4) {
            // If an error occurred, log the response message
            console.log("Error deleting employee:", xhttp.responseText);
        }
    };

    // Send the request with the employee ID as JSON data
    xhttp.send(JSON.stringify(data));
}