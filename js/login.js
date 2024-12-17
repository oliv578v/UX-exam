import { baseUserUrl, handleAPIResponseError } from './common.js';

// Admin credentials
const admin_email = "admin.library@mail.com";
const admin_password = "WebUdvikling24!";

document.querySelector('#frmLogin').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = e.target.txtEmail.value.trim();
    const password = e.target.txtPassword.value.trim();

    // Check if the user is the admin
    if (email === admin_email && password === admin_password) {
        alert('Welcome, Admin!');

        // Store admin role and email in sessionStorage
        sessionStorage.setItem('e-book_user_id', 'admin');
        sessionStorage.setItem('userRole', 'admin');
        sessionStorage.setItem('userEmail', admin_email);
        
        window.location.href = 'admin-dashboard.html'; // Redirect admin to the admin dashboard
        return; // End function here to avoid additional login checks
    }

    // Handle regular user login
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);

    fetch(`${baseUserUrl}/users/login`, {
        method: 'POST',
        body: params
    })
    .then(response => response.json())
    .then(data => {
        if (Object.keys(data).includes('user_id')) {
            alert('Login was successful');

            // Store user information in sessionStorage
            sessionStorage.setItem('e-book_user_id', data.user_id);
            sessionStorage.setItem('userRole', 'user'); // Set role as user
            sessionStorage.setItem('userEmail', email);

            window.location.href = 'index.html'; // Redirect regular user to homepage
        } else {
            handleAPIResponseError(data.error);
        }
    })
    .catch(handleAPIResponseError);
});
