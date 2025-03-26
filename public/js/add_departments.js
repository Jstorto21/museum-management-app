// Joseph Storto
// 3/17/2024
// Node.js implementation code adapted from osu-cs340-ecampus/nodejs-starter-app
// Scope: Code from starter app adapted to handle Node.js and Handlebars general implementation and boilerplate and functionality
// Original code contained in navigation, layout, SQL queries, data verification, and specific implementation details
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 



// Get the form element
let addDepartmentForm = document.getElementById('add-departments-form-ajax');

// Event listener for form submission
addDepartmentForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get the input field and retrieve its value
    let inputDepartmentName = document.getElementById("input-departmentName");
    let departmentNameValue = inputDepartmentName.value;

    // Check if the input field is empty
    if (!departmentNameValue) {
        alert("Department Name cannot be empty.");
        return;
    }

    // Create the data object to send
    let data = {
        departmentName: departmentNameValue
    };

    // Set up the AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-department", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle the response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Parse response data
            let newDepartment = JSON.parse(xhttp.responseText);

            // Add the new row to the table dynamically
            addRowToTable(newDepartment);

            // Clear the input field
            inputDepartmentName.value = '';
        } else if (xhttp.readyState == 4) {
            console.log("Error adding department.");
        }
    };

    // Send the request with the JSON data
    xhttp.send(JSON.stringify(data));
});

// Function to add a new row to the department table
function addRowToTable(newDepartment) {
    let table = document.getElementById("departments-table").getElementsByTagName('tbody')[0];

    // Create a new row
    let row = table.insertRow();

    // Insert cells into the row
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);

    // Fill the cells with data
    cell1.textContent = newDepartment.departmentID;
    cell2.textContent = newDepartment.departmentName;

    // Create action buttons for the new row
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () {
        populateEditForm(newDepartment.departmentID, newDepartment.departmentName);
    };

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        populateDeleteForm(newDepartment.departmentID, newDepartment.departmentName);
    };

    // Append buttons to the actions cell
    cell3.appendChild(editButton);
    cell3.appendChild(deleteButton);
}
