const baseAPIUrl = 'http://localhost:8080';

// DOM Elements
const bookSpecificSection = document.querySelector('#specific-book'); // Changed from #book-details to #specific-book

// Extract the "book_id" from the query string (e.g., specific-book.htm?book_id=1234)
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('book_id');

// If no book_id is found, display an error
if (!bookId) {
    bookSpecificSection.innerHTML = '<p>Book not found. Please try again.</p>';
} else {
    fetchBookSpecific(bookId);
}

// Fetch Book Details
async function fetchBookSpecific(bookId) {
    try {
        const response = await fetch(`${baseAPIUrl}/books/${bookId}`);
        const book = await response.json();
        displayBookSpecific(book);
    } catch (error) {
        console.error('Error fetching book details:', error);
        bookSpecificSection.innerHTML = '<p>Failed to load book details. Please try again later.</p>';
    }
}

// Display Book Details
function displayBookSpecific(book) {
    bookSpecificSection.innerHTML = ''; // Clear any loading message

    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book-container');

    // **Image Wrapper Div**
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('image-wrapper');

    // Book Cover
    const bookCover = document.createElement('img');
    bookCover.src = book.cover || "img/placeholder-image.webp"; // Use a placeholder image if no cover is provided
    bookCover.alt = `${book.title} Cover`;
    bookCover.classList.add('book-cover');
    imageWrapper.appendChild(bookCover); // Append image to image-wrapper

    // Add image wrapper to book container
    bookContainer.appendChild(imageWrapper);

    // **Info Wrapper Div**
    const infoWrapper = document.createElement('div');
    infoWrapper.classList.add('info-wrapper');

    // Book Title
    const bookTitle = document.createElement('h1');
    bookTitle.textContent = book.title;
    infoWrapper.appendChild(bookTitle);

    // **Book Info Title (H2)**
    const bookInfoTitle = document.createElement('h2');
    bookInfoTitle.textContent = 'Book Info';
    infoWrapper.appendChild(bookInfoTitle);

    // **Author (H3 and Paragraph)**
    const authorHeading = document.createElement('h3');
    authorHeading.textContent = 'Author';
    infoWrapper.appendChild(authorHeading);

    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = book.author;
    infoWrapper.appendChild(bookAuthor);

    // **Publishing Year (H3 and Paragraph)**
    const yearHeading = document.createElement('h3');
    yearHeading.textContent = 'Publishing Year';
    infoWrapper.appendChild(yearHeading);

    const bookYear = document.createElement('p');
    bookYear.textContent = book.publishing_year;
    infoWrapper.appendChild(bookYear);

    // **Publisher (H3 and Paragraph)**
    const publisherHeading = document.createElement('h3');
    publisherHeading.textContent = 'Publisher';
    infoWrapper.appendChild(publisherHeading);

    const bookPublisher = document.createElement('p');
    bookPublisher.textContent = book.publishing_company;
    infoWrapper.appendChild(bookPublisher);

    // **Borrow Button**
    const borrowButton = document.createElement('button');
    borrowButton.textContent = 'Borrow for 30 days';
    borrowButton.classList.add('borrow-button');
    borrowButton.addEventListener('click', () => borrowBook(bookId));
    infoWrapper.appendChild(borrowButton);

    // Add info wrapper to book container
    bookContainer.appendChild(infoWrapper);

    // Add book container to specific book section
    bookSpecificSection.appendChild(bookContainer);
}

// **Function to Check if User is Logged In**
function isUserLoggedIn() {
    const userId = sessionStorage.getItem('e-book_user_id'); // Get the user ID from sessionStorage
    return userId !== null; // Return true if user ID exists
}

// **Function to Borrow the Book**
async function borrowBook(bookId) {
    const userId = sessionStorage.getItem('e-book_user_id'); // Get the user ID from sessionStorage

    // Check if the user is logged in
    if (!userId) {
        alert('You must be logged in to borrow a book.');
        return;
    }

    const userEmail = sessionStorage.getItem('userEmail'); // Get the user email from sessionStorage
    if (!userEmail) {
        alert('Email not found. Please log in again.');
        return;
    }

    try {
        const response = await fetch(`${baseAPIUrl}/users/${userId}/books/${bookId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            }
        });

        if (response.ok) {
            // Success message when borrowing a book
            alert('Book successfully borrowed for 30 days! An access link to the e-book will be sent to your email address.');

            // Optionally, you could display a message on the page instead of an alert
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Book successfully borrowed for 30 days! An access link to the e-book will be sent to your email address.';
            successMessage.style.color = 'green'; // You can style the message if needed
            bookSpecificSection.appendChild(successMessage);
        } else if (response.status === 400) {
            alert('You cannot borrow this book because you already borrowed it within the past 30 days.');
        } else {
            alert('Failed to borrow the book. Please try again.');
        }
    } catch (error) {
        console.error('Error borrowing book:', error);
        alert('An error occurred while borrowing the book.');
    }
}
