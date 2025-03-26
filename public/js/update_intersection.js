// Joseph Storto 
// 3/17/2024
// Node.js implementation code adapted from osu-cs340-ecampus/nodejs-starter-app
// Scope: Code from starter app adapted to handle Node.js and Handlebars general implementation and boilerplate and functionality
// Original code contained in navigation, layout, SQL queries, data verification, and specific implementation details
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


// Add an event listener to the form so that when it's submitted, it runs this function
document.getElementById('edit-relationship-form').addEventListener("submit", function (e) {
    // Prevents the form from refreshing the page
    e.preventDefault();

    // Get the current department ID and exhibit ID from input fields
    let departmentID = document.getElementById("edit-departmentID").value;
    let exhibitID = document.getElementById("edit-exhibitID").value;
    // Get the new department ID from the dropdown
    let newDepartmentID = document.getElementById("edit-departmentDropdown").value;

    // Put all the data into an object to send to the server
    let data = { departmentID, exhibitID, newDepartmentID };

     // Create a new AJAX request
    var xhttp = new XMLHttpRequest();

     // Set up a POST request to the backend endpoint that handles updates
    xhttp.open("POST", "/update-intersection", true);

     // Tell the server that we're sending JSON data
    xhttp.setRequestHeader("Content-type", "application/json");

    // When the request state changes, check the response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // If the request is done and successful (200 OK)
            console.log(` Successfully updated exhibit ${exhibitID} to department ${newDepartmentID}`);
            // Refresh the page to show the updated data
            window.location.reload();
        } else if (xhttp.readyState == 4) {
            // If request is done but failed
            console.error(" Error updating relationship.");
        }
    };

    xhttp.send(JSON.stringify(data));
});
