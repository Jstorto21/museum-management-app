// Joseph Storto 
// 3/17/2024
// Node.js implementation code adapted from osu-cs340-ecampus/nodejs-starter-app
// Scope: Code from starter app adapted to handle Node.js and Handlebars general implementation and boilerplate and functionality
// Original code contained in navigation, layout, SQL queries, data verification, and specific implementation details
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


// Get the update form element
let updateExhibitsForm = document.getElementById('update-exhibits-form-ajax');

// Add an event listener to handle form submission
updateExhibitsForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get values from the update form input fields
    let exhibitID = document.getElementById("updateExhibitID").value;
    let newExhibitName = document.getElementById("update-exhibitName").value;
    let newStartDate = document.getElementById("update-startDate").value;
    let newEndDate = document.getElementById("update-endDate").value;

    // Ensure valid input
    if (!exhibitID || !newExhibitName.trim() || !newStartDate || !newEndDate) {
        console.error("Invalid update request: Missing exhibit ID or required fields.");
        return;
    }

    // Create a data object to send
    let data = {
        exhibitID: exhibitID,
        exhibitName: newExhibitName,
        startDate: newStartDate,
        endDate: newEndDate
    };

    // Create an AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-exhibit-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(`Successfully updated exhibit ID ${exhibitID}`);
            window.location.reload();
        } else if (xhttp.readyState == 4) {
            console.error("Error updating exhibit.");
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
});