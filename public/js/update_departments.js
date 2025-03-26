// Joseph Storto 
// 3/17/2024
// Node.js implementation code adapted from osu-cs340-ecampus/nodejs-starter-app
// Scope: Code from starter app adapted to handle Node.js and Handlebars general implementation and boilerplate and functionality
// Original code contained in navigation, layout, SQL queries, data verification, and specific implementation details
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 

// Get the update form element
let updateDepartmentsForm = document.getElementById('update-departments-form-ajax');

// Add an event listener to handle form submission
updateDepartmentsForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get values from the update form input fields
    let departmentID = document.getElementById("updateDepartmentID").value;
    let newDepartmentName = document.getElementById("update-department-name").value;

    // Ensure valid input: Check if department ID exists and new name is not empty
    if (!departmentID || !newDepartmentName.trim()) {
        console.error("Invalid update request: Missing department ID or name.");
        return; // Stop function execution if validation fails
    }

    // Create a JavaScript object to hold the department data
    let data = {
        departmentID: departmentID,         // ID of the department to be updated
        departmentName: newDepartmentName   // New department name
    };

    // Create an AJAX request to send the update request to the backend
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-department-ajax", true); // Set request method to PUT
    xhttp.setRequestHeader("Content-type", "application/json"); // Indicate JSON format

    // Define what happens when the response is received from the server
    xhttp.onreadystatechange = () => {
        // Check if request is complete and successful (status 200: OK)
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(`Successfully updated department ID ${departmentID}`);

            // Refresh the page after a successful update
            window.location.reload();
        } 
        // If an error occurs, log an error message to the console
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.error("Error updating department.");
        }
    };

    // Send the department data to the server as a JSON string
    xhttp.send(JSON.stringify(data));
});