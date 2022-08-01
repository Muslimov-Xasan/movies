let elForm = document.querySelector(".js-form");
let elSearchInput = document.querySelector(".js-search-input", elForm);
let elCatagorySelect = document.querySelector(".js-catagory", elForm);
let elRatingInput = document.querySelector(".js-rating-input", elForm);
let elSortingSealect = document.querySelector(".js-soring-select", elForm);

let elSerchResult = document.querySelector(".js-list");

let elTemplate = document.querySelector(".js-template").content;

// kinolarning kalit so'zlarini tog'irlash

let normalizedMovies = movies.map((movie,i) => {
  return{
    id: i + 1,
    title: movie.Title.toString(),
    year: movie.movie_year,
    rating: movie.imdb_rating,
    catagories: movie.Categories.split("|").join(", "),
    trailer: `https://www.youtube.com/watch?v=${movie.ytid}`,
    smallPoster: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
  }
})

// category select uchun options lar yaratish va render qilish

let createGenreSelectOptions = function () {
  let movieCatagory = [];

  normalizedMovies.splice(200).forEach(function(movie) {
    movie.catagories.split(", ").forEach(function(catagory) {
      if(!movieCatagory.includes(catagory)) {
        movieCatagory.push(catagory);
      }
    })
  })

  movieCatagory.sort();

  let elOptionsFragment = document.createDocumentFragment();

  movieCatagory.forEach(function(catagory) {
    let elCatagoryOption = createElement("option", "", catagory);
    elCatagoryOption.value = catagory.toLowerCase();
    catagory.name = "catagory";

    elOptionsFragment.appendChild(elCatagoryOption);
    elCatagorySelect.appendChild(elOptionsFragment);
  })
}
createGenreSelectOptions();

// kinolarni render qilish

let renderMovies = function(searchResults) {
  elSerchResult.innerHTML = "";

  let elResultFragment = document.createDocumentFragment();

  searchResults.forEach(function(movie) {
    let elMovie = elTemplate.cloneNode(true);

    elMovie.querySelector(".movie-title").textContent = movie.title;
    elMovie.querySelector(".movie-poster").src = movie.smallPoster;
    elMovie.querySelector(".movie-year").textContent = movie.year;
    elMovie.querySelector(".movie-catagory").textContent = movie.catagories;
    elMovie.querySelector(".movie-rating").textContent = movie.rating;
    elMovie.querySelector(".movie-trailer-link").href = movie.trailer;

    elResultFragment.appendChild(elMovie);
  })

  elSerchResult.appendChild(elResultFragment);
}
renderMovies(normalizedMovies);

let sortAz = function(arr) {
  return arr.sort(function(a, b) {
    if (a.title > b.title) {
      return 1;
    } else if (a.title < b.title) {
      return -1;
    } else{
      return 0;
    }
  })
}

let sortSearchResult = function(results, sortType) {
  if (sortType === "az") {
    sortAz(results);
  } else if (sortType === "za") {
    sortAz(results).reverse();
  }
}

let findMovies = function(title , rating){
  return normalizedMovies.filter(function (movie) {
    return movie.title.match(title) && movie.rating >= rating;
  })
}

elForm.addEventListener("submit", function(evt) {
  evt.preventDefault();
  let searchTitle = elSearchInput.value.trim();
  elSearchInput.value = null;
  let movieTitleRegExp = new RegExp(searchTitle, "gi");

  let minimumRating = Number(elRatingInput.value);
  let sorting = elSortingSealect.value;

  let searchResults = findMovies(movieTitleRegExp, minimumRating);
  sortSearchResult(searchResults, sorting);

  renderMovies(searchResults);
})