import getGames from "./api.js";

const cardsContainer = document.querySelector(".cards-container");

async function fetchGames() {
  try {
    const games = await getGames();
    console.log(games.results);
    return games.results;
  } catch (error) {
    console.error(error);
  }
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

fetchGames().then((games) => {
  for (const game of games) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = createCard(game);
    cardsContainer.appendChild(card);
  }
});
