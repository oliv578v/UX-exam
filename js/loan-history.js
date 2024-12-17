// Protect the page to ensure only admins can view it
const userRole = sessionStorage.getItem('userRole');
if (userRole !== 'admin') {
    alert('Access Denied: Admins only');
    window.location.href = 'login.htm'; // Redirect non-admin users to the login page
}

// Get the container where loan history will be displayed
const loanHistoryContainer = document.getElementById('loan-history-container');

if (!loanHistoryContainer) {
    console.error('Loan history container not found. Ensure an element with ID "loan-history-container" exists in the HTML.');
    alert('Error: Missing loan history container. Please contact the developer.');
    throw new Error('Loan history container not found.');
}

// Base URL for API requests
const baseAdminUrl = 'http://localhost:8080/admin/books';

/**
 * Fetches all book IDs (if available) and retrieves their loan histories.
 */
function fetchAllBooksAndLoanHistory() {
    // Simulating a list of book IDs since there's no endpoint provided for all books in admin
    const bookIds = [];
    for (let i = 1000; i <= 9999; i++) {
        bookIds.push(i);
    } // Replace with dynamic logic if your backend provides this list

    bookIds.forEach(bookId => {
        fetchBookLoanHistory(bookId);
    });
}

/**
 * Fetches the loan history for a single book and displays it.
 * @param {number} bookId - The ID of the book.
 */
function fetchBookLoanHistory(bookId) {
    fetch(`${baseAdminUrl}/${bookId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch loan history for book ID ${bookId}: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => displayBookLoanHistory(data))
        .catch(error => {
            console.error(`Error fetching loan history for book ID ${bookId}:`, error);
        });
}

/**
 * Displays a book's loan history on the page.
 * @param {object} bookData - The data containing the book details and loan history.
 */
function displayBookLoanHistory(bookData) {
    const { title, author, publishing_company, publishing_year, cover, loans } = bookData;

    // Create a container for this book's information
    const bookElement = document.createElement('div');
    bookElement.classList.add('book-loan-history');

    // Book information (title, author, publishing info, and cover image)
    const bookInfoHTML = `
        <div class="book-details">
            <img src="${cover}" alt="Cover of ${title}" class="book-cover">
            <div class="book-info">
                <h3>${title}</h3>
                <p><strong>Author:</strong> ${author}</p>
                <p><strong>Publishing Company:</strong> ${publishing_company}</p>
                <p><strong>Year:</strong> ${publishing_year}</p>
            </div>
        </div>
        <h4>Loan History</h4>
    `;

    // Loan history table for this book
    let loanHistoryHTML = `
        <table class="loan-history-table">
            <thead>
                <tr>
                    <th>User ID</th>
                    <th>Loan Date</th>
                </tr>
            </thead>
            <tbody>
    `;

    if (loans && loans.length > 0) {
        loans.forEach(loan => {
            loanHistoryHTML += `
                <tr>
                    <td>${loan.user_id}</td>
                    <td>${new Date(loan.loan_date).toLocaleDateString()}</td>
                </tr>
            `;
        });
    } else {
        loanHistoryHTML += `
            <tr>
                <td colspan="2">No loan history available for this book.</td>
            </tr>
        `;
    }

    loanHistoryHTML += `
            </tbody>
        </table>
    `;

    // Add book info and loan history to the container
    bookElement.innerHTML = bookInfoHTML + loanHistoryHTML;
    loanHistoryContainer.appendChild(bookElement);
}

// Fetch all books and their loan history on page load
fetchAllBooksAndLoanHistory();
