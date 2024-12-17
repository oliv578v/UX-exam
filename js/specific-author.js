// Base API URL
const baseAPIUrl = 'http://localhost:8080';

// DOM Elements
const specificAuthorElement = document.querySelector('#specific-author');

// Array of random descriptions
const descriptions = [
    "A skilled storyteller with a passion for crafting immersive narratives. Adept at transforming ideas into compelling plots, memorable characters, and vivid worlds that captivate readers from the first page to the last.",
    "A master of imagination, weaving dreams into words and worlds onto paper. This author conjures unforgettable stories that transport readers to places where the extraordinary feels familiar and the ordinary becomes magical.",
    "An author who writes with the reader in mind, delivering gripping plots, relatable characters, and emotional depth. Each story is a journey designed to provoke thought, inspire emotion, and leave a lasting impression.",
    "A literary detective, unraveling webs of mystery and intrigue one clue at a time. With heart-racing twists and unpredictable endings, this writer keeps readers on the edge of their seats until the very last page.",
    "A playful dreamer with a heart full of wonder, bringing magical adventures to life for young minds. Each story is a colorful journey filled with laughter, lessons, and a touch of imagination that sparks joy in readers of all ages.",
    "A thoughtful observer of the human condition, this author explores life's big questions through nuanced storytelling. Their books invite readers to reflect, challenge assumptions, and see the world through fresh perspectives.",
    "A heart-driven storyteller with a gift for capturing love, loss, and the complexity of human relationships. With raw emotion and authenticity, this writer creates stories that tug at heartstrings and stay with readers long after the final page.",
    "A world-builder of epic proportions, crafting fantastical realms and futuristic visions where imagination knows no bounds. With dynamic characters and mind-bending plots, this writer takes readers on unforgettable journeys beyond reality.",
    "A literary adrenaline junkie, known for writing pulse-pounding action, high-stakes drama, and heroes who rise to the challenge. Their stories are relentless, heart-pounding rides where every page counts.",
    "A storyteller of lived experiences, transforming personal journeys into universal lessons. Their writing offers wisdom, insight, and an authentic voice that resonates with readers seeking inspiration and growth."
];

// Get the author name, image path, and author_id from the query string
const urlParams = new URLSearchParams(window.location.search);
const authorName = urlParams.get('author_name'); // e.g., "Augustine"
const imagePath = urlParams.get('image_path'); // e.g., "img/avatar/portrait3.jpg"
const authorId = urlParams.get('author_id'); // e.g., "3"

// Debugging: Log the author name, image path, and author ID from the URL
console.log('Author Name from URL:', authorName);
console.log('Image Path from URL:', imagePath);
console.log('Author ID from URL:', authorId);

// Check if the required query parameters exist in the URL
if (!authorName || !imagePath || !authorId) {
    specificAuthorElement.innerHTML = '<p>Author details not provided in URL.</p>';
} else {
    // Display author details
    displayAuthorDetails(authorName, imagePath);
    
    // Fetch and display books written by the author
    fetchBooksByAuthor(authorId);
}

// Display Author Details
function displayAuthorDetails(authorName, imagePath) {
    // Create the main author content container
    const authorContent = document.createElement('div');
    authorContent.classList.add('author-content');

    // === Image Section ===
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('author-image-container');
    
    const authorImageElement = document.createElement('img');
    authorImageElement.src = imagePath; 
    authorImageElement.alt = `${authorName} Image`;
    authorImageElement.classList.add('author-image');
    imageContainer.appendChild(authorImageElement);
    
    // === Details Section (Name + Description) ===
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('author-details');

    const authorNameElement = document.createElement('h2');
    authorNameElement.textContent = authorName;
    
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    const authorDescription = document.createElement('p');
    authorDescription.textContent = randomDescription;

    detailsContainer.appendChild(authorNameElement);
    detailsContainer.appendChild(authorDescription);

    authorContent.appendChild(imageContainer);
    authorContent.appendChild(detailsContainer);

    specificAuthorElement.appendChild(authorContent);
}

// Fetch and Display Books by Author
async function fetchBooksByAuthor(authorId) {
    try {
        const response = await fetch(`${baseAPIUrl}/books?a=${encodeURIComponent(authorId)}`);
        const books = await response.json();

        console.log('Books by Author:', books);

        if (books.length === 0) {
            const noBooksMessage = document.createElement('p');
            noBooksMessage.textContent = 'This author has no books available.';
            specificAuthorElement.appendChild(noBooksMessage);
            return;
        }

        const booksSection = document.createElement('div');
        booksSection.classList.add('books-section');

        const booksTitle = document.createElement('h3');
        booksTitle.textContent = 'Books by this Author';
        booksSection.appendChild(booksTitle);

        const booksList = document.createElement('div');
        booksList.classList.add('books-list');

        books.forEach(book => fetchBookDetails(book.book_id, booksList));

        booksSection.appendChild(booksList);
        specificAuthorElement.appendChild(booksSection);

    } catch (error) {
        console.error('Error fetching books by author:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Failed to load books for this author. Please try again later.';
        specificAuthorElement.appendChild(errorMessage);
    }
}

// Fetch Book Details
async function fetchBookDetails(bookId, booksList) {
    try {
        const response = await fetch(`${baseAPIUrl}/books/${bookId}`);
        const book = await response.json();

        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        const imageElement = document.createElement('img');
        imageElement.src = book.cover || 'img/placeholder-image.webp';
        imageElement.alt = `${book.title} Cover`;
        bookCard.appendChild(imageElement);

        const bookTitle = document.createElement('h4');
        bookTitle.textContent = book.title;
        bookCard.appendChild(bookTitle);

        if (book.description) {
            const bookDescription = document.createElement('p');
            bookDescription.textContent = book.description;
            bookCard.appendChild(bookDescription);
        }

        booksList.appendChild(bookCard);
    } catch (error) {
        console.error(`Error fetching book details for Book ID ${bookId}:`, error);
    }
} 
