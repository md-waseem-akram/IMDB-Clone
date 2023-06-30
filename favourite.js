// Function to add the provided parameter to the favorite movies list stored in local storage
function makeFavList(params) {
    var movies = JSON.parse(localStorage.getItem("movies")) || []; // Retrieve movies or initialize as an empty array
    movies.push(params);
    localStorage.setItem("movies", JSON.stringify(movies));
}

// Function to retrieve favorite movies from local storage and displays them in the favorite list also button to remove movies from favoutites List
function showFavList(){
    let arr = JSON.parse(localStorage.getItem("movies"));
    // console.log(arr);
    if(arr == null || arr.length == 0) {
        window.alert("Add Movies from Search bar to view in Favourite List....");
        return;
    }

    for (var i = 0; i < arr.length; i++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = i;
        movieListItem.classList.add('fav-res-img');
        movieListItem.style.backgroundImage = `url(${arr[i]})`;
        movieListItem.classList.add('rounded-lg');
        movieListItem.classList.add('flex');
        movieListItem.classList.add('items-end');
        movieListItem.innerHTML = `
        <button class="remove-fav" onclick="removeMovie(${i})">
            <p class="shadow-2xl p-2"><i class="fa-solid fa-trash text-xl"></i></p>
        </button>
        `;
        document.querySelector('.fav-list').appendChild(movieListItem);
        document.querySelector('#favourite-result').style.opacity = "1";
    }
}

// Function to exit from favorite page by clearing the favorite list and adjusting the opacity of the favorite result section
function exitFavPage() {
    let arr = JSON.parse(localStorage.getItem("movies"));
    if(arr == null || arr.length == 0) {
        window.alert("Add Movies from Search bar to view in Favourite List....");
        return;
    }
    document.querySelector('#favourite-result').style.opacity = "0";
    document.querySelector('.fav-list').innerHTML = "";
}

//Function to clear from favourite list and remove from local storage
function clearList() {
    exitFavPage();
    localStorage.clear();
}

// Function to remove a movie from the favorite list, updates the local storage, and refreshes the favorite list display
function removeMovie(idx) {
    let arr = JSON.parse(localStorage.getItem("movies"));
    arr.splice(idx, 1);
    localStorage.setItem("movies", JSON.stringify(arr));
    document.querySelector('.fav-list').innerHTML = "";
    if(arr.length == 0) {
        document.querySelector('.fav-list').innerHTML = "";
        document.querySelector('#favourite-result').style.opacity = "0";
        exitFavPage();
    }
    showFavList();
}