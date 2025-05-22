# ClassPDF - PDF Assignment Platform

ClassPDF is a web-based platform that enables teachers to share PDF materials with students, allowing students to complete assignments using virtual school supplies and submit them for grading.

## Features

### For Teachers
- Upload and manage PDF documents
- Create and assign PDF-based assignments to students
- Track student submissions
- Review and grade completed assignments
- Manage students and classes

### For Students
- Access assigned PDF materials
- Use virtual school supplies (pen, highlighter, text tools) to complete assignments
- Save work in progress and submit completed assignments
- View graded assignments with teacher feedback

## Technical Details

ClassPDF is built with the following technologies:
- HTML5, CSS3, and JavaScript (vanilla)
- Client-side PDF.js for PDF rendering
- LocalStorage for data persistence (in a production environment, this would be replaced with a proper database)

## Project Structure

```
.
├── index.html                # Landing page
├── teacher-dashboard.html    # Teacher dashboard
├── student-dashboard.html    # Student dashboard
├── css/
│   ├── style.css             # Main stylesheet
│   └── dashboard.css         # Dashboard specific styles
├── js/
│   ├── main.js               # Main JavaScript for landing page
│   ├── teacher-dashboard.js  # Teacher dashboard functionality
│   ├── student-dashboard.js  # Student dashboard functionality
│   └── pdf.min.js            # PDF.js library (needs to be added)
└── README.md                 # This file
```

## How It Works

1. **User Authentication**:
   - Teachers and students can register and login to their respective dashboards
   - For demonstration purposes, user data is stored in LocalStorage

2. **PDF Management**:
   - Teachers can upload PDF files
   - Files are stored as object URLs (in a production environment, they would be stored on a server)

3. **Assignment Creation**:
   - Teachers can create assignments by selecting a PDF and setting details like title, description, and due date

4. **Student Workflow**:
   - Students see assigned PDFs in their dashboard
   - They can open PDFs and use virtual tools to annotate them
   - Work can be saved in progress or submitted for grading

5. **Grading**:
   - Teachers can review submitted assignments
   - They can add grades and feedback for students to view

## Getting Started

1. Clone this repository
2. Open `index.html` in a modern web browser
3. Register as a teacher or student
4. Log in to access the respective dashboard

Note: Since this is a client-side demo, all data is stored in your browser's LocalStorage. This means:
- Data will persist between page refreshes
- Data will be lost if you clear your browser cache
- In a production environment, this would be replaced with a proper database and server-side logic

## Future Enhancements

- Implement real-time annotation capabilities using Canvas API
- Add collaboration features for group assignments
- Develop mobile-responsive design for tablet use
- Add support for other document formats
- Implement cloud storage for files and student data 
