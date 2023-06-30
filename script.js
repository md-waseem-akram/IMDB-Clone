// Retrieve necessary elements from the HTML document
const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const searchBtn = document.querySelector('.search-btn');
const resultGrid = document.getElementById('result-flex');

// From API Async loading movies
async function loadMovies(searchTerm){
    await fetch(`https://omdbapi.com/?s=${searchTerm}&page=1&apikey=94397865`)
        .then((response) => response.json())
        .then((data) => {
            if(data.Response == "True")  displayMovieList(data.Search);
        });
}

// Adjusting the border radius of elements based on the length of the value in the movie search box
function searchBoxBoderTrigger() {
    if(movieSearchBox.value.length > 0) {
        movieSearchBox.style.borderBottomLeftRadius = "0px";
        searchBtn.style.borderBottomRightRadius = "0px";    
    } else {
        movieSearchBox.style.borderBottomLeftRadius = "25px";
        searchBtn.style.borderBottomRightRadius = "25px";
    }
}

// Function to search for movies based on the input value, showing or hiding the search list accordingly
function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

// Function to displays a list of movies with their details and thumbnails and images
function displayMovieList(movies){
    searchBoxBoderTrigger();
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.poster = movies[idx].Poster;

        // setting movie id in  data-id
        movieListItem.dataset.id = movies[idx].imdbID; 
        movieListItem.classList.add('search-list-item');
        
        // Hits another API where Actors working in the film are stored
        fetch(`http://www.omdbapi.com/?i=${movies[idx].imdbID}&apikey=94397865`)
        .then((response) => response.json())
        .then((data) => {
            if(movies[idx].Poster != "N/A")
                moviePoster = movies[idx].Poster;
            else 
                moviePoster = "./images/notfound.png";
                
            movieListItem.innerHTML = `
                <div class = "search-item-thumbnail shadow-md">
                    <img class="rounded" src = "${moviePoster}">
                </div>
                <div class = "search-item-info" onclick="info()">
                    <h3>${movies[idx].Title}</h3>
                    <p>${movies[idx].Year}</p>
                    <p>${data.Actors}</p>
                </div>
                <p class="heart" onclick="fav(this)"><i class="fa-solid fa-heart text-2xl"></i></p>
                `;
            });
        searchList.appendChild(movieListItem);
    }
}

//Function to dispplay movie details when clicked
function info() {
    console.log('clicked info');
    resetBar();
    loadMovieDetails();
    searchList.classList.add('hide-search-list');
}

//Function to add a movie to favourites List
function fav(data) {
    console.log('clicked fav');
    var poster = data?.parentNode?.dataset?.poster;
    if (poster) {
        makeFavList(poster);
    } else {
        console.error('Invalid data or missing parentNode/dataset/poster property.');
    }
}


let isEntering = false;

function favButtonStyle() {
    if(isEntering) {
        document.querySelector('.favourite-btn').style.backgroundColor = "transparent";
        document.querySelector('.favourite-btn').style.border = "1px solid white";
        document.querySelector('.favourite-btn').style.borderRadius = "7px";
        document.querySelector('.favourite-btn').style.opacity = "0.5";
    }
    else {
        document.querySelector('.favourite-btn').style.backgroundColor = "black";
        document.querySelector('.favourite-btn').style.opacity = "1";
        document.querySelector('.favourite-btn').style.border = "1px solid white";
    }
}

function enterFavPage() {
    console.log(isEntering);
    if(isEntering) {
        favButtonStyle();
        isEntering = false;
        exitFavPage();
    }
    else {
        favButtonStyle();
        isEntering = true;
        showFavList();
    }
}

// Function to load movie details for each movie in the search list
function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', () => {
            fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=94397865`)
            .then((response) => response.json())
            .then((data) => {
                document.querySelector('.searchbar-logo').style.display = "none";
                displayMovieDetails(data);
            });
        });
    });
}

//Function to display movie details dynamically
function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <button class="footer cursor-pointer hover:bg-black hover:shadow-2xl hover:border-0 hover:opacity-100 border rounded opacity-50 p-2 w-36  text-center">
         <a href="./index.html">Home</a> 
    </button>
    
    <div id = "movie-image">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "./images/notfound.png"}" alt = "movie poster" class="rounded shadow-2xl">
    </div>
    <div id = "movie-info">
        <h1 class = "movie-title">${details.Title}</h1>
	  <p>Year: ${details.Year} &nbsp;<span class=" bg-yellow-500 p-1 rounded">Rating: ${details.Rated}</span> &nbsp;Released: ${details.Released}</p>

	  <p class="rounded shadow-md bg-zinc-700 p-1.5 w-fit"><span>Genere:</span> ${details.Genre}</p>

	  <p><span>Writer:</span> ${details.Writer}</p>
	  <p><span>Actors:</span> ${details.Actors}</p>
        <p><span>Plot:</span> ${details.Plot}</p>
	  <p class="italic mv-lang"><span>Language: </span>${details.Language}</p>
	  <p><span><i class="fa-solid fa-award"></i></span>&nbsp;&nbsp;  ${details.Awards}</p>
    </div>
    `;
}


// Function to reset searchbar to it's initial state
function resetBar() {
    movieSearchBox.value = "";
    movieSearchBox.placeholder = "Search for any Movie..."
    movieSearchBox.style.borderBottomLeftRadius = "25px";
    searchBtn.style.borderBottomRightRadius = "25px";
}
