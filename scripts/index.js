import {
  getTopRatedGames,
  getGamesBySearchTerm,
  getGamesByPlatform,
  getPlatforms,
  getGameDetails,
  getDevelopers,
  getGamesByDeveloper,
  getGamesByDateRange,
} from "./api.js";

const cardsContainer1 = document.querySelector("#zdk1 .cards-container");
const cardsContainer2 = document.querySelector("#zdk2 .cards-container");
const cardsContainer3 = document.querySelector("#zdk3 .cards-container");
const cardDetails = document.querySelector("#zdk4");
const gamesByDevelopersContainer = document.querySelector("#zdk6");
const cardsContainer7 = document.querySelector("#zdk7 .cards-container");

function filterUnsafeGames(games) {
  return games.filter(
    (game) => game.esrb_rating !== null && game.esrb_rating.id != 5
  );
}

function inputString(message) {
  let input = "";
  do {
    input = prompt(message);
    if (input === "" || input === null) {
      alert("Input can't be empty. Please try again.");
    }
  } while (input === "" || input === null);
  return input;
}

function appendCards(games, container) {
  for (const game of games) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = createGameCard(game);
    container.appendChild(card);
  }
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

function getPlatformIds(platformNames) {
  let containsPlatforms = true;
  let platformIds = "";
  do {
    const selectedPlatforms = prompt(
      "Enter names of platforms separated by comma:"
    );
    const selectedPlatformsArray = selectedPlatforms
      .split(",")
      .map((platform) => platform.trim());

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

function getDeveloperSlugs(developerSlugs) {
  let areSlugsValid = false;
  let selectedDeveloperSlugs = [];
  do {
    const selectedDevelopers = prompt(
      "Ender a list of developer names separated by commas:"
    );
    const selectedDevelopersArray = selectedDevelopers.split(",");

    selectedDeveloperSlugs = selectedDevelopersArray.map((developer) => {
      const trimmedName = developer.trim();
      let slug = "";
      if (trimmedName.includes(" ")) {
        const words = trimmedName.split(" ");
        slug = words.join("-");
      } else {
        slug = trimmedName;
      }
      return slug.toLowerCase();
    });

    areSlugsValid = selectedDeveloperSlugs.every((slug) => {
      const isValid = developerSlugs.includes(slug);
      if (!isValid) {
        alert(
          `Developer with slug ${slug} is not on the list or does not exist.`
        );
      }
      return isValid;
    });
  } while (!areSlugsValid);
  return selectedDeveloperSlugs;
}

function inputDate(message, startDate = "") {
  let isValidDate = false;
  let date = "";
  do {
    date = prompt(
      `Enter a ${message} (format: YYYY-MM-DD, year range: 1970-2024):`
    );
    isValidDate = !isNaN(Date.parse(date));

    if (!isValidDate) {
      alert("Invalid date format. Please try again.");
      continue;
    }

    const [year, _] = date.split("-");

    if (Number(year) < 1970 || Number(year) > 2024) {
      isValidDate = false;
      alert("Year is out of defined range, Please try again.");
      continue;
    }

    if (startDate != "" && Date.parse(startDate) > Date.parse(date)) {
      isValidDate = false;
      alert("End date should be after start date, Please try again.");
    }
  } while (!isValidDate);
  return date;
}

(async () => {
  //************ ZDK1 ************
  const topGames = await getTopRatedGames();
  appendCards(filterUnsafeGames(topGames), cardsContainer1);

  //************ ZDK2 ************
  const searchTerm = inputString("Enter a game name to search for:");
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
  const gameId = inputString("Enter a game id to get details:");
  getGameDetails(gameId).then((game) => {
    console.log(game);
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = createGameCard(game);
    cardDetails.appendChild(card);

    createStarRating(game.rating);
  });

  //************ ZDK5 ************
  const gameIdForStores = inputString("Enter a game id to get its stores:");
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

  const selectedDeveloperSlugs = getDeveloperSlugs(developerSlugs);

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

    appendCards(developer.games, cardsContainer);
    developerGamesContainer.appendChild(cardsContainer);
    gamesByDevelopersContainer.appendChild(developerGamesContainer);
  }

  //************ ZDK7 ************
  const startDate = inputDate("start date");
  const endDate = inputDate("end date", startDate);

  const dateRangeSpan = document.querySelector("#date-range");
  dateRangeSpan.textContent = `from: ${startDate} to: ${endDate}`;

  const gamesByDateRange = await getGamesByDateRange(startDate, endDate);
  appendCards(filterUnsafeGames(gamesByDateRange), cardsContainer7);
})();
