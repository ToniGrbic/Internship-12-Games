import {
  getTopRatedGames,
  getGamesBySearchTerm,
  getPlatforms,
  getGamesByPlatform,
} from "./api.js";

const cardsContainer1 = document.querySelector("#zdk1 .cards-container");
const cardsContainer2 = document.querySelector("#zdk2 .cards-container");
const cardsContainer3 = document.querySelector("#zdk3 .cards-container");
console.log(cardsContainer3);
function filterUnsafeGames(games) {
  return games.filter(
    (game) => game.esrb_rating !== null && game.esrb_rating != 5
  );
}
function createCard(game) {
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

function appendCards(games, container) {
  for (const game of games) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = createCard(game);
    container.appendChild(card);
  }
}
//ZDK1
getTopRatedGames().then((games) => {
  appendCards(filterUnsafeGames(games), cardsContainer1);
});

//ZDK2
const searchTerm = prompt("Enter a game name to search for:");
const searchTermTextEl = document.querySelector(".search-term");
searchTermTextEl.textContent = searchTerm;

getGamesBySearchTerm(searchTerm).then((games) => {
  appendCards(filterUnsafeGames(games), cardsContainer2);
});

//ZDK3
getPlatforms().then((platforms) => {
  const platformNames = platforms.map((platform) => {
    return {
      id: platform.id,
      name: platform.name,
    };
  });
  console.log(platformNames);
  const platformsContainer = document.querySelector(".platforms");

  for (const platform of platformNames) {
    const platformEl = document.createElement("div");
    platformEl.classList.add("platform");
    platformEl.textContent = platform.name;
    platformsContainer.appendChild(platformEl);
  }

  let containsPlatforms = true;
  let platformIds = "";
  do {
    const selectedPlatforms = prompt(
      "Enter names of platforms separated by comma:"
    );
    const selectedPlatformsArray = selectedPlatforms.split(",");

    containsPlatforms = selectedPlatformsArray.every((platform) => {
      return platformNames.some(
        (platformName) => platformName.name === platform
      );
    });
    platformIds = selectedPlatformsArray.map((platform) => {
      return platformNames.find(
        (platformName) => platformName.name === platform
      ).id;
    });

    if (!containsPlatforms) {
      alert("Invalid platform names. Please try again.");
    }
  } while (!containsPlatforms);

  getGamesByPlatform(platformIds).then((games) => {
    appendCards(games, cardsContainer3);
  });
});
