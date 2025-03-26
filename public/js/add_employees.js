// Joseph Storto
// 3/17/2024
// Node.js implementation code adapted from osu-cs340-ecampus/nodejs-starter-app
// Scope: Code from starter app adapted to handle Node.js and Handlebars general implementation and boilerplate and functionality
// Original code contained in navigation, layout, SQL queries, data verification, and specific implementation details
// Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app 



// Get the form element
let addEmployeeForm = document.getElementById('add-employees-form-ajax');

// Event listener for form submission
addEmployeeForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get the input field and retrieve its value
    let inputFirstName = document.getElementById("input-firstName");
    let inputLastName = document.getElementById("input-lastName");
    let inputDepartmentID = document.getElementById("input-departmentID");
    
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let departmentIDValue = inputDepartmentID.value;


    // Check if the input field is empty
    if (!firstNameValue) {
        alert("Employee Name cannot be empty.");
        return;
    }

    // Create the data object to send
    let data = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        departmentID: departmentIDValue
    };

    // Set up the AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-employee", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Handle the response
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Parse response data
            let newEmployee = JSON.parse(xhttp.responseText);

            // Add the new row to the table dynamically
            addRowToTable(newEmployee);

            // Clear the input field
            inputFirstName.value = '';
            inputLastName.value = '';
            inputDepartmentID.value = '';
        } else if (xhttp.readyState == 4) {
            console.log("Error adding employee.");
        }
    };

    // Send the request with the JSON data
    xhttp.send(JSON.stringify(data));
});

// Function to add a new row to the employee table
function addRowToTable(newEmployee) {
    let table = document.getElementById("employees-table").getElementsByTagName('tbody')[0];

    // Create a new row
    let row = table.insertRow();

    // Insert cells into the row
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    // Fill the cells with data
    cell1.textContent = newEmployee.employeeID;
    cell2.textContent = newEmployee.firstName;
    cell3.textContent = newEmployee.lastName;
    cell4.textContent = newEmployee.departmentID;

    // Create action buttons for the new row
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        populateDeleteForm(newEmployee.employeeID, newEmployee.firstName, newEmployee.lastName, newEmployee.departmentID);
    };

    // Append buttons to the actions cell
    cell5.appendChild(deleteButton);
    // Reload page to get department names.
    location.reload();
}
