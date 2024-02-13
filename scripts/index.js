import { getTopRatedGames, getGamesBySearchTerm } from "./api.js";

const cardsContainer1 = document.querySelector("#zdk1 .cards-container");
const cardsContainer2 = document.querySelector("#zdk2 .cards-container");
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

getTopRatedGames().then((games) => {
  appendCards(games, cardsContainer1);
});

const searchTerm = prompt("Enter a game name to search for:");
const searchTermTextEl = document.querySelector(".search-term");
searchTermTextEl.textContent = searchTerm;

getGamesBySearchTerm(searchTerm).then((games) => {
  appendCards(games, cardsContainer2);
});
