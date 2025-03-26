// Joseph Storto 
// 3/17/2024
// Node.js implementation code adapted from osu-cs340-ecampus/nodejs-starter-app
// Scope: Code from starter app adapted to handle Node.js and Handlebars general implementation and boilerplate and functionality
// Original code contained in navigation, layout, SQL queries, data verification, and specific implementation details
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


// Function handles deleting a department_has_exhibits relationship.
function deleteRelationship() {
    // Get department ID and exhibit ID from input fields
    let departmentID = document.getElementById("delete-departmentID").value;
    let exhibitID = document.getElementById("delete-exhibitID").value;

    // Package the IDs into a data object
    let data = { departmentID: departmentID, exhibitID: exhibitID };

    // Create a new AJAX request
    var xhttp = new XMLHttpRequest();

     // Set up a DELETE request to the backend endpoint
    xhttp.open("DELETE", "/delete-exhibit-relationship", true);

    // Tell the server we're sending JSON data
    xhttp.setRequestHeader("Content-type", "application/json");

    // When the request state changes, check the response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // If the request is done and successful (204 No Content)
            console.log(`Successfully deleted relationship between Department ${departmentID} and Exhibit ${exhibitID}`);
            // Refresh the page to reflect the changes
            window.location.reload();
        } else if (xhttp.readyState == 4) {
            // If request is done but failed
            console.error("Error deleting relationship.");
        }
    };
    // Send the request with the data as a JSON string
    xhttp.send(JSON.stringify(data));
}