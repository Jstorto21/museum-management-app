// Joseph Storto 
// 3/17/2024
// Code for adding files to display in web application copied and adapted from mdn web docs.
// Source: https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications


// Add documents to web page as viewable objects in page.
function openFileViewer(filePath, fileName) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error("File not found");
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("file-title").textContent = fileName;
            document.getElementById("file-content").textContent = data;  
            document.getElementById("file-modal").style.display = "flex"; 
        })
        .catch(error => {
            document.getElementById("file-title").textContent = "Error";
            document.getElementById("file-content").textContent = "Failed to load file.";
            console.error("Error loading file:", error);
        });
}

function closeFileViewer() {
    document.getElementById("file-modal").style.display = "none";
}