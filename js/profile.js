import { baseUserUrl, handleAPIResponseError } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the user ID from session storage
    const userId = sessionStorage.getItem('e-book_user_id');

    if (!userId) {
        // If no user is logged in, redirect to the login page
        window.location.href = 'login.htm';
        return;
    }

    // Reference to the form and buttons
    const profileForm = document.getElementById('profile-form');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveChangesBtn = document.getElementById('save-changes-btn');
    const deleteProfileBtn = document.getElementById('delete-profile-btn');  // Delete button
    const formFields = profileForm.querySelectorAll('input, textarea');

    // Make the API request to fetch user data
    fetch(`${baseUserUrl}/users/${userId}`, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.first_name && data.last_name) {
            // Populate the profile form with the user data
            document.getElementById('first-name').value = data.first_name;
            document.getElementById('last-name').value = data.last_name;
            document.getElementById('email').value = data.email;
            document.getElementById('phone').value = data.phone_number;
            document.getElementById('birth-date').value = data.birth_date;
            document.getElementById('address').value = data.address;
            document.getElementById('membership-date').value = data.membership_date || 'N/A';
        } else {
            handleAPIResponseError('User data not found.');
        }
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
        handleAPIResponseError('An error occurred while fetching user data.');
    });

    // Toggle edit mode when "Edit Profile" button is clicked
    editProfileBtn.addEventListener('click', () => {
        const isReadOnly = formFields[0].readOnly;

        formFields.forEach(field => {
            if (field.id !== 'membership-date') {
                field.readOnly = !isReadOnly;
            }
        });

        if (isReadOnly) {
            saveChangesBtn.style.display = 'block';
            editProfileBtn.textContent = 'Cancel Edit';
        } else {
            saveChangesBtn.style.display = 'none';
            editProfileBtn.textContent = 'Edit Profile';
        }
    });

    saveChangesBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const first_name = document.getElementById("first-name").value;
        const last_name = document.getElementById("last-name").value;
        const address = document.getElementById("address").value;
        const phone_number = document.getElementById("phone").value;
        const birth_date = document.getElementById("birth-date").value;
    
        const formData = new FormData();
        formData.append("email", email);
        formData.append("first_name", first_name);
        formData.append("last_name", last_name);
        formData.append("address", address);
        formData.append("phone_number", phone_number);
        formData.append("birth_date", birth_date);
    
        // Put info into the database
        fetch(`http://localhost:8080/users/${userId}`, {
            method: "PUT",
            body: formData, // Send FormData directly
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to edit information");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Information edited:", data);
                alert("Edit added successfully!");
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Failed to edit. Please check the console for details.");
            });
    });

    // Handle the "Delete Profile" button click
    deleteProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
            fetch(`${baseUserUrl}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if (response.status === 200) {
                    alert('Your profile has been deleted successfully.');
                    sessionStorage.removeItem('e-book_user_id');
                    window.location.href = 'login.htm';
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Failed to delete the profile');
                    });
                }
            })
            .catch(error => {
                console.error('Error deleting profile:', error);
                handleAPIResponseError('An error occurred while deleting your profile.');
            });
    });
    
});
