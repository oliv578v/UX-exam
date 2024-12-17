import { baseUserUrl, handleAPIResponseError } from './common.js';

document.querySelector('#frmSignup').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById("txtEmail").value.trim();
    const password = document.getElementById("txtPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const first_name = document.getElementById("txtFirstname").value.trim();
    const last_name = document.getElementById("txtLastname").value.trim();
    const birth_date = document.getElementById("txtbirthDate").value;
    const address = document.getElementById("txtAddress").value.trim();
    const phone_number = document.getElementById("txtPhone").value.trim();

    if (password !== confirmPassword) {
        alert("Passwords don't match.");
        return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("address", address);
    formData.append("phone_number", phone_number);
    formData.append("birth_date", birth_date);

    fetch(`${baseUserUrl}/users`, {
        method: "POST",
        body: formData,
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to sign up");
        }
        return response.json();
    })
    .then((data) => {
        console.log("User added:", data);
        sessionStorage.setItem("userEmail", email);
        sessionStorage.setItem("userRole", 'user'); // Default role for signups is user
        window.location.href = "login.htm";
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Failed to sign up user. Please check the console for details.");
    });
});
