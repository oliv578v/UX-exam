const baseAPIUrl = 'http://localhost:8080'; // Base API URL

// DOM Elements
const bookList = document.querySelector('#book-list');
const searchInput = document.querySelector('#search-input');
const adminSection = document.querySelector('#admin-section');
const addBookForm = document.querySelector('#add-book-form');
const addAuthorForm = document.querySelector('#add-author-form');
const addPublisherForm = document.querySelector('#add-publisher-form');

// Fetch Random Books
async function fetchRandomBooks(numberOfBooks = 996) {
    try {
        const response = await fetch(`${baseAPIUrl}/books?n=${numberOfBooks}`);
        const books = await response.json();
        console.log('Random Books:', books); // Debugging: Log the books response
        displayBooks(books);
    } catch (error) {
        console.error('Error fetching random books:', error);
        bookList.innerHTML = '<p>Failed to load books. Please try again later.</p>';
    }
}

// Search Books by Title
async function searchBooksByTitle(query) {
    try {
        const response = await fetch(`${baseAPIUrl}/books?s=${encodeURIComponent(query)}`);
        const books = await response.json();
        console.log('Books by Title:', books); // Debugging: Log the books response
        displayBooks(books);
    } catch (error) {
        console.error('Error searching books by title:', error);
        bookList.innerHTML = '<p>Failed to search books. Please try again later.</p>';
    }
}

// Display Books
const displayBooks = (books) => {
    bookList.innerHTML = ''; // Clear previous results

    if (books.length === 0) {
        bookList.innerHTML = '<p>No books found.</p>';
        return;
    }

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');

        // Click a book to see specific book page
        bookItem.addEventListener('click', () => {
            console.log('Book clicked:', book.book_id); // Debug: Log book id
            window.location.href = `specific-book.htm?book_id=${book.book_id}`;
        });

        // Book cover image
        const bookCover = document.createElement('img');
        bookCover.src = book.cover || "img/placeholder-image.webp"; // Assuming the API returns the cover URL
        bookCover.alt = `${book.title} Cover`;
        bookCover.classList.add('book-cover');
        bookItem.appendChild(bookCover);

        // Book title
        const bookTitle = document.createElement('h3');
        bookTitle.textContent = book.title;
        bookItem.appendChild(bookTitle);

        // Book author and publishing year
        const bookDetails = document.createElement('p');
        bookDetails.textContent = `By ${book.author} (${book.publishing_year})`;
        bookItem.appendChild(bookDetails);

        bookList.appendChild(bookItem);
    });
};

// Event Listener for "Enter" key press in the search input for Title
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchBooksByTitle(query); // Search for books by title
        } else {
            fetchRandomBooks(); // Show random books if no title is entered
        }
    }
});

// Handle Admin Section Visibility
document.addEventListener('DOMContentLoaded', () => {
    const userRole = sessionStorage.getItem('userRole');

    // If the user is an admin, show the admin section
    if (userRole === 'admin') {
        adminSection.classList.remove('hidden');
    }
});

// Handle form submissions for adding a book
addBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.querySelector('#book-title').value;  // Book title
    const authorId = document.querySelector('#author-id').value;  // Author ID
    const publishingYear = document.querySelector('#publishing-year').value;  // Publishing year
    const publisherId = document.querySelector('#publisher-id').value;  // Publisher ID

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author_id', authorId);
    formData.append('publishing_year', publishingYear);
    formData.append('publisher_id', publisherId);

    const response = await fetch(`${baseAPIUrl}/admin/books`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    if (response.ok) {
        alert('Book added successfully!');
        fetchRandomBooks(); // Refresh book list
    } else {
        alert('Error adding book: ' + data.error);
    }
});

// Handle author form submission
addAuthorForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.querySelector('#author-first-name').value;  // Author's first name
    const lastName = document.querySelector('#author-last-name').value;  // Author's last name

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);

    const response = await fetch(`${baseAPIUrl}/admin/authors`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    if (response.ok) {
        alert('Author added successfully!');
    } else {
        alert('Error adding author: ' + data.error);
    }
});

// Handle publisher form submission
addPublisherForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const publisherName = document.querySelector('#publisher-name').value;  // Publisher's name

    const formData = new FormData();
    formData.append('name', publisherName);

    const response = await fetch(`${baseAPIUrl}/admin/publishers`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    if (response.ok) {
        alert('Publisher added successfully!');
    } else {
        alert('Error adding publisher: ' + data.error);
    }
});

// Initial Load (show random books when no search is done)
fetchRandomBooks();
