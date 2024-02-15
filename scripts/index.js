import {
  getTopRatedGames,
  getGamesBySearchTerm,
  getGamesByPlatform,
  getPlatforms,
  getGameDetails,
  getDevelopers,
} from "./api.js";

const cardsContainer1 = document.querySelector("#zdk1 .cards-container");
const cardsContainer2 = document.querySelector("#zdk2 .cards-container");
const cardsContainer3 = document.querySelector("#zdk3 .cards-container");
const cardDetails = document.querySelector("#zdk4");

function filterUnsafeGames(games) {
  return games.filter(
    (game) => game.esrb_rating !== null && game.esrb_rating.id != 5
  );
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

function appendCards(games, container) {
  for (const game of games) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = createGameCard(game);
    container.appendChild(card);
  }
}

function getPlatformIds(platformNames) {
  let containsPlatforms = true;
  let platformIds = "";
  do {
    const selectedPlatforms = prompt(
      "Enter names of platforms separated by comma:"
    );
    const selectedPlatformsArray = selectedPlatforms.split(",");

    // Check that all inputed platforms are from the top 10
    containsPlatforms = selectedPlatformsArray.every((platform) => {
      return platformNames.some(
        (platformName) => platformName.name === platform
      );
    });

    if (!containsPlatforms) {
      alert("Invalid platform names. Please try again.");
      continue;
    }
    const platformListSpan = document.querySelector("#selected-platforms");
    platformListSpan.textContent = selectedPlatforms;

    // find the platform ids
    platformIds = selectedPlatformsArray
      .map((platform) => {
        return platformNames.find(
          (platformName) => platformName.name === platform
        ).id;
      })
      .join(",");
  } while (!containsPlatforms);
  return platformIds;
}

(async () => {
  //************ ZDK1 ************
  const topGames = await getTopRatedGames();
  appendCards(filterUnsafeGames(topGames), cardsContainer1);

  //************ ZDK2 ************
  const searchTerm = prompt("Enter a game name to search for:");
  const searchTermTextEl = document.querySelector(".search-term");
  searchTermTextEl.textContent = searchTerm;

  const gamesBySearch = await getGamesBySearchTerm(searchTerm);
  appendCards(filterUnsafeGames(gamesBySearch), cardsContainer2);

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

  const platformIds = getPlatformIds(platformNames);

  const gamesByPlatform = await getGamesByPlatform(platformIds);
  appendCards(filterUnsafeGames(gamesByPlatform), cardsContainer3);

  //************ ZDK4 ************
  const gameId = prompt("Enter a game id to get details:");
  getGameDetails(gameId).then((game) => {
    console.log(game);
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = createGameCard(game);
    cardDetails.appendChild(card);

    createStarRating(game.rating);
  });

  //************ ZDK5 ************
  const gameIdForStores = prompt("Enter a game id to get its stores:");
  getGameDetails(gameIdForStores).then((game) => {
    console.log(game);
    const stores = game.stores;
    const storesContainer = document.querySelector(" #zdk5 .cards-container");
    const storesTitleSpan = document.querySelector("#game-name-stores");
    storesTitleSpan.textContent = game.name;

    for (const store of stores) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = createStoreCard(store.store);
      storesContainer.appendChild(card);
    }
  });

  //************ ZDK6 ************
  const developers = await getDevelopers();
  const developerSlugs = developers.map((developer) => developer.slug);
  console.log(developerSlugs);
})();
