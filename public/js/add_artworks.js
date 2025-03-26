// Joseph Storto
// 3/17/2024
// Node.js implementation code adapted from osu-cs340-ecampus/nodejs-starter-app
// Scope: Code from starter app adapted to handle Node.js and Handlebars general implementation and boilerplate and functionality
// Original code contained in navigation, layout, SQL queries, data verification, and specific implementation details
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 


// Get the form element
let addArtworkForm = document.getElementById('add-artworks-form-ajax');

// Event listener for form submission
addArtworkForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get the input field and retrieve its value
    let inputArtworkName = document.getElementById("input-artworkName");
    let inputArtistName = document.getElementById("input-artistName");
    let inputDepartmentID = document.getElementById("input-departmentID");
    let inputExhibitID = document.getElementById("input-exhibitID");
    
    
    let artworkNameValue = inputArtworkName.value;
    let artistNameValue = inputArtistName.value;
    let departmentIDValue = inputDepartmentID.value;
    let exhibitIDValue = inputExhibitID.value;


    // Check if the input field is empty
    if (!artworkNameValue) {
        alert("Artwork Name cannot be empty.");
        return;
    }

    // Create the data object to send
    let data = {
        artworkName: artworkNameValue,
        artistName: artistNameValue,
        departmentID: departmentIDValue,
        exhibitID: exhibitIDValue
    };

    // Set up the AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-artwork", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle the response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Parse response data
            let newArtwork = JSON.parse(xhttp.responseText);

            // Add the new row to the table dynamically
            addRowToTable(newArtwork);

            // Clear the input field
            inputArtworkName.value = '';
            inputArtistName.value = '';
            inputDepartmentID.value = '';
            inputExhibitID = '';
        } else if (xhttp.readyState == 4) {
            console.log("Error adding artwork.");
        }
    };

    // Send the request with the JSON data
    xhttp.send(JSON.stringify(data));
});

// Function to add a new row to the artwork table
function addRowToTable(newArtwork) {
    let table = document.getElementById("artworks-table").getElementsByTagName('tbody')[0];

    // Create a new row
    let row = table.insertRow();

    // Insert cells into the row
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);

    // Fill the cells with data
    cell1.textContent = newArtwork.artworkID;
    cell2.textContent = newArtwork.artworkName;
    cell3.textContent = newArtwork.artistName;
    cell4.textContent = newArtwork.departmentID;
    cell5.textContent = newArtwork.exhibitID;

    // Create action buttons for the new row
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        populateDeleteForm(newArtwork.artworkID, newArtwork.artworkName, newArtwork.artistName, newArtwork.departmentID, newArtwork.exhibitID);
    };

    // Append buttons to the actions cell
    cell6.appendChild(deleteButton);
    // Reload page to get department and exhibit names.
    location.reload();
}
