const baseAPIUrl = 'http://localhost:8080'; // Base API URL

// DOM Elements
const authorList = document.querySelector('#author-list');
const authorSearchInput = document.querySelector('#author-search-input'); // Author search input

// Array of portrait images (10 portraits)
const portraitImages = [
    'img/avatars/portrait1.png',
    'img/avatars/portrait2.png',
    'img/avatars/portrait3.png',
    'img/avatars/portrait4.png',
    'img/avatars/portrait5.png',
    'img/avatars/portrait6.png',
    'img/avatars/portrait7.png',
    'img/avatars/portrait8.png',
    'img/avatars/portrait9.png',
    'img/avatars/portrait10.png',
    'img/avatars/portrait11.png',
    'img/avatars/portrait12.png',
    'img/avatars/portrait13.png',
    'img/avatars/portrait14.png',
    'img/avatars/portrait15.png',
    'img/avatars/portrait16.png'
];

// Fetch All Authors
async function fetchAllAuthors() {
    try {
        const response = await fetch(`${baseAPIUrl}/authors`);
        const authors = await response.json();
        console.log('All Authors:', authors); // Debugging: Log the authors response

        // Cache the authors data globally to use when filtering
        window.authors = authors;

        displayAuthors(authors);  // Initially display all authors
    } catch (error) {
        console.error('Error fetching authors:', error);
        authorList.innerHTML = '<p>Failed to load authors. Please try again later.</p>';
    }
}

// Search Authors by Name (Filter authors by name)
function searchAuthorsByName(query) {
    query = query.toLowerCase().trim(); // Convert query to lowercase for case-insensitive search

    // Filter authors based on the search query
    const filteredAuthors = window.authors.filter(author => 
        author.author_name.toLowerCase().includes(query)  // Check if the author's name contains the search query
    );

    console.log('Filtered Authors:', filteredAuthors); // Debugging: Log the filtered authors

    displayAuthors(filteredAuthors);
}

// Display Authors as Cards
const displayAuthors = (authors) => {
    authorList.innerHTML = ''; // Clear previous results

    if (authors.length === 0) {
        authorList.innerHTML = '<p>No authors found with that name.</p>';
        return;
    }

    authors.forEach(author => {
        const authorCard = document.createElement('div');
        authorCard.classList.add('author-card');

        // Select a random portrait image from the array
        const randomImage = portraitImages[Math.floor(Math.random() * portraitImages.length)];

        // Author Image
        const authorImage = document.createElement('img');
        authorImage.src = randomImage;
        authorImage.alt = `${author.author_name} Image`;
        authorImage.classList.add('author-image');
        authorCard.appendChild(authorImage);

        // Author Name
        const authorName = document.createElement('h3');
        authorName.textContent = author.author_name;
        authorCard.appendChild(authorName);

        // Add event listener to redirect to a specific author's page
        authorCard.addEventListener('click', () => {
            window.location.href = `specific-author.html?author_name=${encodeURIComponent(author.author_name)}&image_path=${encodeURIComponent(authorImage.src)}&author_id=${author.author_id}`;
        });
        

        authorList.appendChild(authorCard);
    });
};

// Event Listener for input change in the search input
authorSearchInput.addEventListener('input', () => {
    const authorName = authorSearchInput.value.trim();
    if (authorName) {
        searchAuthorsByName(authorName);  // Filter authors by name
    } else {
        displayAuthors(window.authors);  // Display all authors if no search is entered
    }
});

// Initial Load (show all authors when no search is done)
fetchAllAuthors();
