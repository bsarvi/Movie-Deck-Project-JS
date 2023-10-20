import { CURR_TAB, FAV_TAB } from "./app.js";

/* ======================================================================== */
/* === === === === === === === GLOBAL VARIABLES === === === === === === === */
/* ======================================================================== */
const TOP_RATED_MOVIE_URI =
  "https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&include_adult=false";

/* === === === === === === === Fetch DATA FROM API  === === === === === === */
export const fetchMovies = async (page = 1) => {
  try {
    const res = await fetch(`${TOP_RATED_MOVIE_URI}&page=${page}`);

    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status}`);
    }

    const data = await res.json();
    if (data.results.length) {
      return data.results.map((movie) => {
        let { id, poster_path, release_date, title, vote_average, vote_count } =
          movie;

        if (poster_path === null) {
          poster_path = "/images/noImage.jpg";
        } else {
          poster_path = `https://image.tmdb.org/t/p/original${poster_path}`;
        }

        return {
          id,
          release_date,
          title,
          vote_average,
          vote_count,
          poster_path,
        };
      });
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error in fetchMovies:", error);
    throw error;
  }
};

/* === === === === === === === RENDER MOVIE CARD IN CONATINER  === === === === === === */
export function renderMovies(movies, movieContainer) {
  movieContainer.innerHTML = "";

  movies.forEach((movie) => {
    const { vote_count, vote_average, poster_path, id, title } = movie;

    // Create the main container div
    const movieDiv = document.createElement("div");
    movieDiv.className = "group";

    // Create the inner movie content div
    const innerDiv = document.createElement("div");
    innerDiv.className =
      "bg-primary-400 w-60 h-80 rounded-lg overflow-hidden group-hover:p-2 duration-200 transition-all hover:bg-primary-100";

    // Create the relative container
    const relativeContainer = document.createElement("div");
    relativeContainer.className = "relative w-full h-full";

    // Create the image element
    const imgLoader = new Image();
    const img = document.createElement("img");
    img.className = "w-full h-full object-cover object-top rounded-lg";
    img.setAttribute("loading", "lazy");
    imgLoader.src = poster_path;
    imgLoader.onload = () => {
      img.src = imgLoader.src;
    };

    // Create the details container
    const detailsDiv = document.createElement("div");
    detailsDiv.className =
      "absolute bottom-0 h-20 w-full bg-primary-100 text-primary-600 opacity-0 group-hover:opacity-100 duration-300 transition-all";

    // Create the title element
    const titleElement = document.createElement("h2");
    titleElement.className =
      "text-lg font-young-serif my-2 w-full line-clamp-1";
    titleElement.textContent = title;

    // Create the metadata container
    const metadataDiv = document.createElement("div");
    metadataDiv.className = "flex gap-4 text-primary-300";

    // Create the vote count element
    const voteCountElement = document.createElement("p");
    voteCountElement.innerHTML = `<i class="fa-solid fa-fingerprint"></i> ${vote_count}`;

    // Create the vote average element
    const voteAverageElement = document.createElement("p");
    voteAverageElement.innerHTML = `<i class="fa-regular fa-star"></i> ${vote_average}`;

    // Create the heart button
    const heartButton = document.createElement("button");
    heartButton.className = `absolute bottom-2 right-2 text-3xl  text-primary-300 duration-300 transition-all hover:text-red-500 ${
      FAV_TAB.movies.has(id) && "text-red-500"
    }`;
    heartButton.innerHTML = '<i class="fa-solid fa-heart"></i>';

    heartButton.addEventListener("click", () => {
      handleFavIconClick(movie);
      heartButton.classList.toggle("text-red-500");
    });

    // Append elements to their respective containers
    metadataDiv.appendChild(voteCountElement);
    metadataDiv.appendChild(voteAverageElement);
    detailsDiv.appendChild(titleElement);
    detailsDiv.appendChild(metadataDiv);
    relativeContainer.appendChild(img);
    relativeContainer.appendChild(detailsDiv);
    relativeContainer.appendChild(heartButton);

    innerDiv.appendChild(relativeContainer);
    movieDiv.appendChild(innerDiv);

    // Append the movie div to the movie container
    movieContainer.appendChild(movieDiv);
  });
}

const handleFavIconClick = (movie) => {
  if (FAV_TAB.movies.has(movie.id)) {
    FAV_TAB.movies.delete(movie.id);
  } else {
    FAV_TAB.movies.set(movie.id, movie);
  }

  const length = Array.from(FAV_TAB.movies).length;
  FAV_TAB.totalPages = Math.floor(length / 20) + (length % 20 === 0 ? 0 : 1);
  saveToLs();
};

/* === === === === === === === FUNCTION FOR LS  === === === === === === */
const saveToLs = () => {
  const favMovieString = JSON.stringify(Array.from(FAV_TAB.movies.values()));
  localStorage.setItem("favMovies", favMovieString);
};

export const getFromLs = () => {
  const favMovieString = localStorage.getItem("favMovies");
  const movieArr = JSON.parse(favMovieString);

  if (movieArr === null) {
    return new Map();
  }

  const movieMap = movieArr.reduce((acc, curr) => {
    acc.set(curr.id, curr);
    return acc;
  }, new Map());
  return movieMap;
};

/* === === === === === === === RENDER MOVIE CARD IN CONATINER  === === === === === === */

export function sortByDateAscending(movies) {
  return movies
    .slice()
    .sort((a, b) => a.release_date.localeCompare(b.release_date));
}

export function sortByDateDescending(movies) {
  return movies
    .slice()
    .sort((a, b) => b.release_date.localeCompare(a.release_date));
}

export function sortByRatingAscending(movies) {
  return movies.slice().sort((a, b) => a.vote_average - b.vote_average);
}

export function sortByRatingDescending(movies) {
  return movies.slice().sort((a, b) => b.vote_average - a.vote_average);
}
