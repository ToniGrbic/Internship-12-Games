import {
  getTopRatedGames,
  getGamesBySearchTerm,
  getGamesByPlatform,
  getPlatforms,
  getGameDetails,
  getDevelopers,
  getGamesByDeveloper,
  getGamesByDateRange,
  getGamesByMetacriticRange,
} from "./api.js";

import {
  inputString,
  inputMetacriticRange,
  inputPlatforms,
  inputDevelopersAndConvertToSlugs,
  inputDate,
} from "./input.js";

const cardsContainer1 = document.querySelector("#zdk1 .cards-container");
const cardsContainer2 = document.querySelector("#zdk2 .cards-container");
const cardsContainer3 = document.querySelector("#zdk3 .cards-container");
const cardDetails = document.querySelector("#zdk4");
const storesContainer = document.querySelector(" #zdk5 .cards-container");
const gamesByDevelopersContainer = document.querySelector("#zdk6");
const cardsContainer7 = document.querySelector("#zdk7 .cards-container");
const cardsContainer8 = document.querySelector("#zdk8 .cards-container");

function filterUnsafeGames(games) {
  return games.filter(
    (game) => game.esrb_rating !== null && game.esrb_rating.id != 5
  );
}

function appendGameCards(games, container) {
  for (const game of games) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = createGameCard(game);
    container.appendChild(card);
  }
}

function appendStoreCards(stores, container) {
  for (const store of stores) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = createStoreCard(store.store);
    container.appendChild(card);
  }
}

function createGameCard(game) {
  return `
    <img class="card-img" src=${game.background_image} alt=${game.name}>
    <div class="card-body">
      <h5 class="card-title">${game.name}</h5>
      <p class="card-text">
           Release Date: 
           <span class="release-date">${game.released}</span>
       </p>
      <p class="card-text">
           Metacritic rating: 
           <span class="rating">${game.metacritic}</span>
       </p>
    </div>
    `;
}

function createStoreCard(store) {
  return `
  <img class="card-img" src=${store.image_background} alt=${store.name}>
    <div class="card-body">
      <h5 class="card-title">${store.name}</h5>
      <p class="card-text"> 
           <a href="https://${store.domain}" class="store-link">Website</a>
       </p>
       <p class="card-text">
            ${store.games_count} games available
       </p>
    </div>
    `;
}

function createStarRating(rating) {
  const cardDetailsContainer = document.querySelector("#zdk4 .card");

  const starsContainer = document.createElement("div");
  starsContainer.classList.add("stars-container");

  const ratingExact = document.createElement("p");
  ratingExact.textContent = `Rating: ${rating}/5`;
  starsContainer.appendChild(ratingExact);

  for (let i = 0; i < 5; i++) {
    const star = document.createElement("i");
    star.classList.add("fa-regular", "fa-star");
    const ratingRounded = Math.round(rating);
    if (i + 1 <= ratingRounded) {
      star.classList.add("filled-star");
    }
    starsContainer.appendChild(star);
  }
  cardDetailsContainer.appendChild(starsContainer);
}

(async () => {
  //************ ZDK1 ************
  const topGames = await getTopRatedGames();
  appendGameCards(filterUnsafeGames(topGames), cardsContainer1);

  //************ ZDK2 ************
  const searchTerm = inputString("Enter a game name to search for:");
  const searchTermTextEl = document.querySelector(".search-term");
  searchTermTextEl.textContent = searchTerm;

  const gamesBySearch = await getGamesBySearchTerm(searchTerm);
  appendGameCards(filterUnsafeGames(gamesBySearch), cardsContainer2);

  //************ ZDK3 ************
  const platforms = await getPlatforms();

  const platformNames = platforms.map((platform) => {
    return {
      id: platform.id,
      name: platform.name,
    };
  });

  const platformsContainer = document.querySelector(".platforms");

  for (const platform of platformNames) {
    const platformEl = document.createElement("li");
    platformEl.classList.add("platform");
    platformEl.textContent = platform.name;
    platformsContainer.appendChild(platformEl);
  }

  const platformIds = inputPlatforms(platformNames);

  const gamesByPlatform = await getGamesByPlatform(platformIds);
  appendGameCards(filterUnsafeGames(gamesByPlatform), cardsContainer3);

  //************ ZDK4 ************
  const gameId = inputString("Enter a game id to get details:");

  getGameDetails(gameId).then((game) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = createGameCard(game);
    cardDetails.appendChild(card);

    createStarRating(game.rating);
  });

  //************ ZDK5 ************
  const gameIdForStores = inputString("Enter a game id to get its stores:");

  getGameDetails(gameIdForStores).then((game) => {
    const stores = game.stores;
    const storesTitleSpan = document.querySelector("#game-name-stores");
    storesTitleSpan.textContent = game.name;

    appendStoreCards(stores, storesContainer);
  });

  //************ ZDK6 ************
  const developers = await getDevelopers();
  const developerSlugs = developers.map((developer) => developer.slug);
  const developerNames = developers.map((developer) => developer.name);

  const selectedDeveloperSlugs = inputDevelopersAndConvertToSlugs(
    developerSlugs,
    developerNames
  );

  const gamesByDevelopers = [];
  for (const developer of selectedDeveloperSlugs) {
    const developerGames = await getGamesByDeveloper(developer);
    const filteredGames = filterUnsafeGames(developerGames);
    gamesByDevelopers.push({ name: developer, games: filteredGames });
  }

  for (const developer of gamesByDevelopers) {
    const developerGamesContainer = document.createElement("div");
    developerGamesContainer.classList.add("developer-games-container");
    developerGamesContainer.innerHTML = `<h2>${developer.name}</h2>`;

    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("cards-container");

    appendGameCards(developer.games, cardsContainer);
    developerGamesContainer.appendChild(cardsContainer);
    gamesByDevelopersContainer.appendChild(developerGamesContainer);
  }

  //************ ZDK7 ************
  const startDate = inputDate("start date");
  const endDate = inputDate("end date", startDate);

  const dateRangeSpan = document.querySelector("#date-range");
  dateRangeSpan.textContent = `from: ${startDate} to: ${endDate}`;

  const gamesByDateRange = await getGamesByDateRange(startDate, endDate);
  appendGameCards(filterUnsafeGames(gamesByDateRange), cardsContainer7);

  //************ ZDK8 ************
  const [min, max] = inputMetacriticRange();

  const metacriticRangeSpan = document.querySelector("#metacritic-range");
  metacriticRangeSpan.textContent = `from: ${min} to: ${max}`;

  const gamesByMetacriticRange = await getGamesByMetacriticRange(min, max);
  appendGameCards(filterUnsafeGames(gamesByMetacriticRange), cardsContainer8);
})();
