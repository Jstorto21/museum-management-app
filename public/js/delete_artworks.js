// Joseph Storto
// 3/17/2024
// Node.js implementation code adapted from osu-cs340-ecampus/nodejs-starter-app
// Scope: Code from starter app adapted to handle Node.js and Handlebars general implementation and boilerplate and functionality
// Original code contained in navigation, layout, SQL queries, data verification, and specific implementation details
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 



// Function to handle artwork deletion
function deleteArtwork() {
    // Retrieve the artwork ID from the hidden input field
    let artworkID = document.getElementById("deleteArtworkID").value;

    // Create an object containing the artwork ID to send in the request
    let data = { artworkID: artworkID };

    // Create a new XMLHttpRequest object for AJAX communication
    var xhttp = new XMLHttpRequest();

    // Configure it: DELETE request to "/delete-artwork-ajax" endpoint
    xhttp.open("DELETE", "/delete-artwork-ajax", true);

    // Set request header to indicate that JSON data is being sent
    xhttp.setRequestHeader("Content-type", "application/json");

    // Define what happens when the server responds
    xhttp.onreadystatechange = () => {
        // Check if the request is complete and was successful (status 204: No Content)
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            console.log(`Successfully deleted artwork ID ${artworkID}`);

            // Refresh the page after successful deletion
            window.location.reload();
        } else if (xhttp.readyState == 4) {
            // If an error occurred, log the response message
            console.log("Error deleting artwork:", xhttp.responseText);
        }
    };

    // Send the request with the artwork ID as JSON data
    xhttp.send(JSON.stringify(data));
}