const API_KEY = "7d0b5029";
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieInfo = document.getElementById("movieInfo");
const reviewForm = document.getElementById("reviewForm");
const reviewList = document.getElementById("reviewList");

let currentMovie = null;

async function fetchMovie(title) {
  try {
    const res = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`);
    const data = await res.json();
    if (data.Response === "True") {
      currentMovie = data;
      displayMovie(data);
      loadReviews(data.imdbID);
    } else {
      movieInfo.innerHTML = `<p>❌ Movie not found</p>`;
    }
  } catch (err) {
    movieInfo.innerHTML = `<p>⚠️ Error fetching data</p>`;
  }
}

function displayMovie(movie) {
  movieInfo.innerHTML = `
    <h2>${movie.Title} (${movie.Year})</h2>
    <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}" />
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
    <p><strong>IMDB Rating:</strong> ⭐ ${movie.imdbRating}</p>
  `;
}

searchBtn.addEventListener("click", () => {
  const title = searchInput.value.trim();
  if (title) fetchMovie(title);
});

reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!currentMovie) {
    alert("Search a movie first!");
    return;
  }

  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;
  const review = { rating, comment };

  const movieId = currentMovie.imdbID;
  let reviews = JSON.parse(localStorage.getItem(movieId)) || [];
  reviews.push(review);
  localStorage.setItem(movieId, JSON.stringify(reviews));

  document.getElementById("reviewForm").reset();
  loadReviews(movieId);
});

function loadReviews(movieId) {
  const reviews = JSON.parse(localStorage.getItem(movieId)) || [];
  reviewList.innerHTML = "";
  reviews.forEach((rev) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>⭐ ${rev.rating}/5</strong> — ${rev.comment}`;
    reviewList.appendChild(li);
  });
}
