document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in as a teacher
    const userType = localStorage.getItem('userType');
    const username = localStorage.getItem('username');
    
    if (!userType || userType !== 'teacher' || !username) {
        // Redirect to login if not logged in as a teacher
        window.location.href = 'index.html';
        return;
    }
    
    // Set teacher name in header
    document.getElementById('teacher-name').textContent = username;
    
    // Tab navigation
    setupTabNavigation();
    
    // PDF upload functionality
    setupPdfUpload();
    
    // Assignment creation modal
    setupAssignmentModal();
    
    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('userType');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    });
});

/**
 * Sets up tab navigation for the dashboard
 */
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.sidebar nav a');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current tab and content
            const targetTab = e.target.getAttribute('data-tab');
            e.target.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

/**
 * Sets up PDF upload functionality
 */
function setupPdfUpload() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileElem');
    const uploadsList = document.getElementById('uploads-list');
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when item is dragged over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add('highlight');
        });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove('highlight');
        });
    });
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });
    
    function handleFiles(files) {
        [...files].forEach(uploadFile);
    }
    
    function uploadFile(file) {
        // Only accept PDF files
        if (file.type !== 'application/pdf') {
            alert('Only PDF files are accepted');
            return;
        }
        
        // In a real application, you would upload the file to a server here
        // For this demo, we'll just simulate the upload and store file data
        
        // Simulate upload delay
        setTimeout(() => {
            // Store file data in localStorage (in a real app, this would be stored on a server)
            const uploads = JSON.parse(localStorage.getItem('teacherUploads') || '[]');
            const newUpload = {
                id: Date.now().toString(),
                name: file.name,
                size: file.size,
                date: new Date().toISOString(),
                url: URL.createObjectURL(file) // This URL is temporary and will be lost on page refresh
            };
            
            uploads.push(newUpload);
            localStorage.setItem('teacherUploads', JSON.stringify(uploads));
            
            // Update the UI
            displayUploads();
            
            // Also update the assignment PDF dropdown
            updatePdfDropdown();
        }, 1000);
    }
    
    // Display uploaded PDFs
    function displayUploads() {
        const uploads = JSON.parse(localStorage.getItem('teacherUploads') || '[]');
        
        if (uploads.length === 0) {
            uploadsList.innerHTML = '<p class="empty-message">No PDFs uploaded yet.</p>';
            return;
        }
        
        uploadsList.innerHTML = '';
        uploads.forEach(upload => {
            const fileSize = formatFileSize(upload.size);
            const uploadDate = new Date(upload.date).toLocaleDateString();
            
            const uploadItem = document.createElement('div');
            uploadItem.className = 'assignment-card';
            uploadItem.innerHTML = `
                <div class="assignment-details">
                    <div class="assignment-title">${upload.name}</div>
                    <div class="assignment-metadata">
                        <span>${fileSize}</span>
                        <span>Uploaded: ${uploadDate}</span>
                    </div>
                </div>
                <div class="assignment-actions">
                    <button class="view-btn" data-id="${upload.id}">View</button>
                    <button class="edit-btn" data-id="${upload.id}">Assign</button>
                    <button class="delete-btn" data-id="${upload.id}">Delete</button>
                </div>
            `;
            uploadsList.appendChild(uploadItem);
        });
        
        // Add event listeners to buttons
        uploadsList.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const upload = uploads.find(u => u.id === id);
                // Open PDF in a new tab
                if (upload && upload.url) {
                    window.open(upload.url, '_blank');
                }
            });
        });
        
        uploadsList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                // Switch to assignments tab and open the assignment creation modal
                document.querySelector('a[data-tab="assignments"]').click();
                document.getElementById('assignment-modal').style.display = 'block';
                // Pre-select the PDF in the dropdown
                const pdfSelect = document.getElementById('assignment-pdf');
                pdfSelect.value = id;
            });
        });
        
        uploadsList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const updatedUploads = uploads.filter(u => u.id !== id);
                localStorage.setItem('teacherUploads', JSON.stringify(updatedUploads));
                displayUploads();
                updatePdfDropdown();
            });
        });
    }
    
    // Call the function on load
    displayUploads();
}

/**
 * Sets up the assignment creation modal and functionality
 */
function setupAssignmentModal() {
    const modal = document.getElementById('assignment-modal');
    const closeBtn = modal.querySelector('.close');
    const createAssignmentBtn = document.getElementById('create-assignment');
    const assignmentForm = document.getElementById('assignment-form');
    const assignmentsList = document.querySelector('.assignments-list');
    
    // Update PDF dropdown options
    updatePdfDropdown();
    
    // Open modal when Create Assignment button is clicked
    createAssignmentBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });
    
    // Close modal when X button is clicked
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle form submission
    assignmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(assignmentForm);
        const title = formData.get('title');
        const description = formData.get('description');
        const pdfId = formData.get('pdf');
        const dueDate = formData.get('dueDate');
        const classId = formData.get('class');
        
        // In a real app, this would be sent to a server
        // For this demo, we'll just store it in localStorage
        const assignments = JSON.parse(localStorage.getItem('teacherAssignments') || '[]');
        const newAssignment = {
            id: Date.now().toString(),
            title,
            description,
            pdfId,
            dueDate,
            classId,
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        
        assignments.push(newAssignment);
        localStorage.setItem('teacherAssignments', JSON.stringify(assignments));
        
        // Reset form and close modal
        assignmentForm.reset();
        modal.style.display = 'none';
        
        // Update assignments list
        displayAssignments();
    });
    
    // Display assignments in the list
    function displayAssignments() {
        const assignments = JSON.parse(localStorage.getItem('teacherAssignments') || '[]');
        
        if (assignments.length === 0) {
            assignmentsList.innerHTML = '<p class="empty-message">No assignments created yet.</p>';
            return;
        }
        
        assignmentsList.innerHTML = '';
        assignments.forEach(assignment => {
            const dueDate = new Date(assignment.dueDate).toLocaleDateString();
            const createdDate = new Date(assignment.createdAt).toLocaleDateString();
            
            // Get PDF name from the uploads
            const uploads = JSON.parse(localStorage.getItem('teacherUploads') || '[]');
            const pdf = uploads.find(u => u.id === assignment.pdfId);
            const pdfName = pdf ? pdf.name : 'Unknown PDF';
            
            const assignmentItem = document.createElement('div');
            assignmentItem.className = 'assignment-card';
            assignmentItem.innerHTML = `
                <div class="assignment-details">
                    <div class="assignment-title">${assignment.title}</div>
                    <div class="assignment-metadata">
                        <span>PDF: ${pdfName}</span>
                        <span>Due: ${dueDate}</span>
                        <span>Created: ${createdDate}</span>
                    </div>
                </div>
                <div class="assignment-actions">
                    <button class="view-btn" data-id="${assignment.id}">View</button>
                    <button class="edit-btn" data-id="${assignment.id}">Edit</button>
                    <button class="delete-btn" data-id="${assignment.id}">Delete</button>
                </div>
            `;
            assignmentsList.appendChild(assignmentItem);
        });
        
        // Add event listeners to buttons
        assignmentsList.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const assignment = assignments.find(a => a.id === id);
                if (assignment) {
                    // Find the PDF URL
                    const uploads = JSON.parse(localStorage.getItem('teacherUploads') || '[]');
                    const pdf = uploads.find(u => u.id === assignment.pdfId);
                    if (pdf && pdf.url) {
                        window.open(pdf.url, '_blank');
                    }
                }
            });
        });
        
        assignmentsList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const updatedAssignments = assignments.filter(a => a.id !== id);
                localStorage.setItem('teacherAssignments', JSON.stringify(updatedAssignments));
                displayAssignments();
            });
        });
    }
    
    // Call the function on load
    displayAssignments();
}

/**
 * Updates the PDF dropdown options in the assignment form
 */
function updatePdfDropdown() {
    const pdfSelect = document.getElementById('assignment-pdf');
    const uploads = JSON.parse(localStorage.getItem('teacherUploads') || '[]');
    
    // Clear current options except the first one
    while (pdfSelect.options.length > 1) {
        pdfSelect.remove(1);
    }
    
    // Add options for each uploaded PDF
    uploads.forEach(upload => {
        const option = document.createElement('option');
        option.value = upload.id;
        option.textContent = upload.name;
        pdfSelect.appendChild(option);
    });
}

/**
 * Formats file size for display
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 