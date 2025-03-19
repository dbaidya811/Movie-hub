const apiKey = '95b484e84ce8a20eec48c113912372ce';
const apiUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsDiv = document.getElementById('results');
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Load Popular Movies on Home Screen
window.addEventListener('load', () => {
    fetchPopularMovies();
});

// Fetch Popular Movies
async function fetchPopularMovies() {
    const url = `${apiUrl}/movie/popular?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
}

// Search Movies
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        searchMovies(query);
    }
});

async function searchMovies(query) {
    const url = `${apiUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
}

// Display Movies
function displayMovies(movies) {
    resultsDiv.innerHTML = '';
    if (movies.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="${imageBaseUrl}${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p class="movie-description">${movie.overview.substring(0, 100)}...</p>
            <div class="rating">${getStarRating(movie.vote_average)}</div>
            <button class="button" onclick="showTrailer(${movie.id})">Watch Trailer</button>
            <button class="button" onclick="downloadMovie(${movie.id}, '${movie.title}')">⬇️ Download</button>
        `;
        resultsDiv.appendChild(movieCard);
    });
}

// Download Movie
function downloadMovie(movieId, movieTitle) {
    const url = `${apiUrl}/movie/${movieId}?api_key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${movieTitle}.json`;
            link.click();
        })
        .catch(error => console.error('Error downloading movie:', error));
}

// Show Trailer
async function showTrailer(movieId) {
    const url = `${apiUrl}/movie/${movieId}/videos?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const trailer = data.results.find(video => video.type === 'Trailer');
    if (trailer) {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
    } else {
        alert('No trailer available.');
    }
}

// Dark Mode Toggle
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '☀️ Light Mode';
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        darkModeToggle.textContent = '🌙 Dark Mode';
        localStorage.setItem('dark-mode', 'disabled');
    }
});

// Check Local Storage for Dark Mode Preference
if (localStorage.getItem('dark-mode') === 'enabled') {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️ Light Mode';
}

// Download Button
document.getElementById('downloadButton').addEventListener('click', function() {
    alert('Download button clicked!');
});

// Function to fetch and display movie reviews
async function displayMovieReview(movieId) {
    const url = `${apiUrl}/movie/${movieId}/reviews?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const review = data.results.length > 0 ? data.results[0].content : 'No reviews available.';
    document.getElementById('movieReview').innerText = review;
}

// Get Star Rating
function getStarRating(voteAverage) {
    const stars = Math.round(voteAverage / 2);
    let starHtml = '';
    for (let i = 0; i < 5; i++) {
        if (i < stars) {
            starHtml += '<i class="fas fa-star"></i>';
        } else {
            starHtml += '<i class="far fa-star"></i>';
        }
    }
    return starHtml;
}

// Example function to populate movie grid with clickable movies
function populateMovieGrid(movies) {
    const results = document.getElementById('results');
    results.innerHTML = '';
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie';
        movieElement.innerText = movie.title;
        movieElement.addEventListener('click', function() {
            displayMovieReview(movie.id);
        });
        results.appendChild(movieElement);
    });
}

// Example usage
populateMovieGrid([
    { id: 1, title: 'Movie 1' },
    { id: 2, title: 'Movie 2' },
    { id: 3, title: 'Movie 3' }
]);