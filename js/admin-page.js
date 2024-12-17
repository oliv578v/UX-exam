// admin.js

// 1️⃣ **Admin Access Control**
const userRole = sessionStorage.getItem('userRole');

// If user is not an admin, redirect to login page
if (userRole !== 'admin') {
    alert('Access Denied: Admins only');
    window.location.href = 'login.htm'; // Redirect to login page
}

// 2️⃣ **Logout Functionality**
const logoutButton = document.getElementById('logout');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        sessionStorage.clear(); // Clear session storage to log out user
        window.location.href = 'login.htm'; // Redirect to login page
    });
}

// 3️⃣ **Helper Function to Make API Requests**
/**
 * Makes an authenticated GET request to the backend
 * @param {string} url - The API URL to fetch data from
 * @returns {Promise<any>} - The response data from the API
 */
async function fetchData(url) {
    try {
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data from server.');
    }
}

// 4️⃣ **Dynamic Button Actions (Optional)**
document.addEventListener('DOMContentLoaded', () => {
    const manageBooksButton = document.getElementById('manage-books');
    const viewLoanHistoryButton = document.getElementById('view-loan-history');

    if (manageBooksButton) {
        manageBooksButton.addEventListener('click', () => {
            window.location.href = 'loan-now.html'; // Redirect to book management page
        });
    }

    if (viewLoanHistoryButton) {
        viewLoanHistoryButton.addEventListener('click', () => {
            window.location.href = 'loan-history.html'; // Redirect to loan history page
        });
    }
});

