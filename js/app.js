import { fetchMovies, getFromLC, renderMovies } from "./utils.js";

/* ========================================================================= */
/* === === === === === === === GLOABL VARIABLES === === === === === === ===  */
/* ========================================================================= */
const ALL_TAB = { currentPage: 0, totalPages: 0, movies: [], active: "all" };
export const FAV_TAB = {
  currentPage: 0,
  totalPages: 0,
  movies: new Map(),
  active: "fav",
};
export let CURR_TAB = ALL_TAB;

/* ========================================================================== */
/* === === === === === === === HTML NODE ELEMENTS === === === === === === === */
/* ========================================================================== */
const allTabBtnEle = document.getElementById("all-tab");
const favTabBtnEle = document.getElementById("fav-tab");
const cardsContainer = document.getElementById("cards-container");
const prevBtnEle = document.getElementById("prev-btn");
const nextBtnEle = document.getElementById("next-btn");
const pageNoEle = document.getElementById("page-no");

/* ========================================================================= */
/* === === === === === === === TAB FUNCTIONALITY === === === === === === === */
/* ========================================================================= */

const tabSwitch = (currTab) => {
  allTabBtnEle.classList.toggle("btn-active");
  favTabBtnEle.classList.toggle("btn-active");
  CURR_TAB = currTab === "fav" ? FAV_TAB : ALL_TAB;
  handelPaginationState();
};

allTabBtnEle.addEventListener("click", () => {
  tabSwitch("all");

  const movies = CURR_TAB.movies.slice(
    (CURR_TAB.currentPage - 1) * 20,
    CURR_TAB.currentPage * 20
  );
  renderMovies(movies, cardsContainer);
});
favTabBtnEle.addEventListener("click", () => {
  tabSwitch("fav");
  const movieArr = Array.from(CURR_TAB.movies.values());
  const movies = movieArr.slice(
    (CURR_TAB.currentPage - 1) * 20,
    CURR_TAB.currentPage * 20
  );
  renderMovies(movies, cardsContainer);
});

/* ================================================================================ */
/* === === === === === === === Pagination FUNCTIONALITY === === === === === === === */
/* ================================================================================ */

const handelPaginationState = () => {
  if (CURR_TAB.currentPage <= 1) {
    prevBtnEle.setAttribute("disabled", true);
  } else {
    prevBtnEle.removeAttribute("disabled");
  }
  if (CURR_TAB.currentPage >= CURR_TAB.totalPages) {
    nextBtnEle.setAttribute("disabled", true);
  } else {
    nextBtnEle.removeAttribute("disabled");
  }
  pageNoEle.textContent = `${CURR_TAB.currentPage} of ${CURR_TAB.totalPages}`;
};

const handelNextPage = async () => {
  let movies;
  CURR_TAB.currentPage += 1;
  if (CURR_TAB.active === "all") {
    if (CURR_TAB.movies.length >= CURR_TAB.currentPage * 20) {
      movies = CURR_TAB.movies.slice(
        (CURR_TAB.currentPage - 1) * 20,
        CURR_TAB.currentPage * 20
      );
    } else {
      movies = await fetchMovies(CURR_TAB.currentPage);
      CURR_TAB.movies = [...CURR_TAB.movies, ...movies];
    }
  } else if (CURR_TAB.active === "fav") {
    const movieArr = Array.from(CURR_TAB.movies.values());
    movies = movieArr.slice(
      (CURR_TAB.currentPage - 1) * 20,
      CURR_TAB.currentPage * 20
    );
  }
  renderMovies(movies, cardsContainer);
  handelPaginationState();
};

const handelPrevPage = async () => {
  CURR_TAB.currentPage -= 1;
  let movies;
  if (CURR_TAB.active === "all") {
    movies = CURR_TAB.movies.slice(
      (CURR_TAB.currentPage - 1) * 20,
      CURR_TAB.currentPage * 20
    );
  } else if (CURR_TAB.active === "fav") {
    const movieArr = Array.from(CURR_TAB.movies.values());
    movies = movieArr.slice(
      (CURR_TAB.currentPage - 1) * 20,
      CURR_TAB.currentPage * 20
    );
  }
  renderMovies(movies, cardsContainer);
  handelPaginationState();
};

nextBtnEle.addEventListener("click", handelNextPage);
prevBtnEle.addEventListener("click", handelPrevPage);

/* ============================================================================= */
/* === === === === === === === Initial FUNCTIONALITY === === === === === === === */
/* ============================================================================= */
const handelInitialAllTab = async () => {
  ALL_TAB.currentPage = 1;
  ALL_TAB.totalPages = 10;
  ALL_TAB.movies = await fetchMovies(ALL_TAB.currentPage);
  renderMovies(ALL_TAB.movies, cardsContainer);
  handelPaginationState();
};
const handelInitialFavTab = () => {
  FAV_TAB.movies = getFromLC();
  const length = FAV_TAB.movies.size;
  FAV_TAB.totalPages = Math.floor(length / 20) + (length % 20 === 0 ? 0 : 1);
  FAV_TAB.currentPage = FAV_TAB.totalPages >= 1 ? 1 : 0;
};

const init = () => {
  handelInitialAllTab();
  handelInitialFavTab();
};
init();
