// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Login modal elements
    const modal = document.getElementById('login-modal');
    const teacherLoginBtn = document.getElementById('teacher-login');
    const studentLoginBtn = document.getElementById('student-login');
    const closeBtn = document.querySelector('.close');
    const loginFormContainer = document.getElementById('login-form-container');
    
    // Hero section buttons
    const btnTeacher = document.getElementById('btn-teacher');
    const btnStudent = document.getElementById('btn-student');
    
    // Event Listeners
    teacherLoginBtn.addEventListener('click', () => openLoginModal('teacher'));
    studentLoginBtn.addEventListener('click', () => openLoginModal('student'));
    btnTeacher.addEventListener('click', () => openLoginModal('teacher'));
    btnStudent.addEventListener('click', () => openLoginModal('student'));
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Functions
    function openLoginModal(userType) {
        loginFormContainer.innerHTML = createLoginForm(userType);
        modal.style.display = 'block';
        
        // Add event listener to the form
        const form = document.getElementById(`${userType}-login-form`);
        form.addEventListener('submit', handleLogin);
    }
    
    function createLoginForm(userType) {
        const capitalizedType = userType.charAt(0).toUpperCase() + userType.slice(1);
        
        return `
            <h2>${capitalizedType} Login</h2>
            <form id="${userType}-login-form">
                <div class="form-group">
                    <label for="${userType}-username">Username</label>
                    <input type="text" id="${userType}-username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="${userType}-password">Password</label>
                    <input type="password" id="${userType}-password" name="password" required>
                </div>
                <button type="submit" class="submit-btn">Login</button>
                <p class="form-footer">Don't have an account? <a href="#" class="register-link" data-type="${userType}">Register</a></p>
            </form>
        `;
    }
    
    function createRegisterForm(userType) {
        const capitalizedType = userType.charAt(0).toUpperCase() + userType.slice(1);
        
        return `
            <h2>${capitalizedType} Registration</h2>
            <form id="${userType}-register-form">
                <div class="form-group">
                    <label for="${userType}-reg-fullname">Full Name</label>
                    <input type="text" id="${userType}-reg-fullname" name="fullname" required>
                </div>
                <div class="form-group">
                    <label for="${userType}-reg-email">Email</label>
                    <input type="email" id="${userType}-reg-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="${userType}-reg-username">Username</label>
                    <input type="text" id="${userType}-reg-username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="${userType}-reg-password">Password</label>
                    <input type="password" id="${userType}-reg-password" name="password" required>
                </div>
                ${userType === 'teacher' ? `
                <div class="form-group">
                    <label for="teacher-reg-school">School Name</label>
                    <input type="text" id="teacher-reg-school" name="school" required>
                </div>
                ` : ''}
                ${userType === 'student' ? `
                <div class="form-group">
                    <label for="student-reg-grade">Grade</label>
                    <input type="text" id="student-reg-grade" name="grade" required>
                </div>
                ` : ''}
                <button type="submit" class="submit-btn">Register</button>
                <p class="form-footer">Already have an account? <a href="#" class="login-link" data-type="${userType}">Login</a></p>
            </form>
        `;
    }
    
    function closeModal() {
        modal.style.display = 'none';
    }
    
    function handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const username = formData.get('username');
        const password = formData.get('password');
        
        // Demo login functionality - in a real app, this would validate credentials with a server
        if (username && password) {
            const userType = form.id.includes('teacher') ? 'teacher' : 'student';
            
            // Simulate successful login and redirect
            localStorage.setItem('userType', userType);
            localStorage.setItem('username', username);
            
            // Redirect to the appropriate dashboard
            window.location.href = userType === 'teacher' ? 'teacher-dashboard.html' : 'student-dashboard.html';
        }
    }
    
    function handleRegister(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // In a real app, this would send registration data to a server
        const userType = form.id.includes('teacher') ? 'teacher' : 'student';
        
        // Simulate successful registration and redirect to login
        alert(`${userType.charAt(0).toUpperCase() + userType.slice(1)} registration successful! Please login.`);
        openLoginModal(userType);
    }
    
    // Event delegation for register and login links inside the modal
    loginFormContainer.addEventListener('click', (e) => {
        // Register link clicked
        if (e.target.classList.contains('register-link')) {
            const userType = e.target.getAttribute('data-type');
            loginFormContainer.innerHTML = createRegisterForm(userType);
            
            const registerForm = document.getElementById(`${userType}-register-form`);
            registerForm.addEventListener('submit', handleRegister);
        }
        
        // Login link clicked
        if (e.target.classList.contains('login-link')) {
            const userType = e.target.getAttribute('data-type');
            openLoginModal(userType);
        }
    });
}); 