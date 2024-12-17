export const baseUrl = 'https://github.com/arturomorarioja/py_library_api_v2';
export const baseUserUrl = 'http://localhost:8080'

export const handleAPIError = function(response) {
    if (response.ok) {
        return response.json();
    }
    console.log('There was an error');
}

export const handleAPIResponseError = (error = 'Generic error') => {
    alert('There was an error: ' + error);
}

export const activateLinks = () => {
    const loggedUserID = sessionStorage.getItem('e-book_user_id');
    const userRole = sessionStorage.getItem('userRole');

    // Case: Not logged in
    if (loggedUserID === null) {
        // Show logged-out links
        document.querySelectorAll('li:has(.logged-out)').forEach((option) => {
            option.classList.remove('hidden');
        });
        document.querySelectorAll('li:has(.logged-in)').forEach((option) => {
            option.classList.add('hidden');
        });

        // Hide admin-only links (like Admin Dashboard) for non-logged-in users
        document.querySelectorAll('li:has(.admin-only)').forEach((option) => {
            option.classList.add('hidden');
        });

        // Hide profile links for non-logged-in users
        document.querySelectorAll('li:has(.profile-only)').forEach((option) => {
            option.classList.add('hidden');
        });

    } else {
        // Case: User is logged in (check user role)
        if (userRole === 'admin') {
            // Show logged-in links
            document.querySelectorAll('li:has(.logged-out)').forEach((option) => {
                option.classList.add('hidden');
            });
            document.querySelectorAll('li:has(.logged-in)').forEach((option) => {
                option.classList.remove('hidden');
            });

            // Show admin-only links (like Admin Dashboard)
            document.querySelectorAll('li:has(.admin-only)').forEach((option) => {
                option.classList.remove('hidden');
            });

            // Hide profile link for admin
            document.querySelectorAll('li:has(.profile-only)').forEach((option) => {
                option.classList.add('hidden');
            });

        } else if (userRole === 'user') {
            // Case: Logged-in user (not admin)
            document.querySelectorAll('li:has(.logged-out)').forEach((option) => {
                option.classList.add('hidden');
            });
            document.querySelectorAll('li:has(.logged-in)').forEach((option) => {
                option.classList.remove('hidden');
            });

            // Hide admin-only links for regular users
            document.querySelectorAll('li:has(.admin-only)').forEach((option) => {
                option.classList.add('hidden');
            });

            // Show profile link for regular users (but hide for admin)
            document.querySelectorAll('li:has(.profile-only)').forEach((option) => {
                option.classList.remove('hidden');
            });
        }
    }
};

// Nav Menu
const burger = document.getElementById('burger');
const navMenu = document.getElementById('utility-phone');

// Toggle "open" class on the menu and animate the burger icon
burger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    burger.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    // Call the activateLinks function to set up the initial state based on role
    activateLinks();
});
