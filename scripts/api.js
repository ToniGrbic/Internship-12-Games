const baseUrl = "https://api.rawg.io/api";
const API_KEY = "464bc085dbbf4f33bcb2ccb39d36a6ec";

function keyParam() {
  return new URLSearchParams(`key=${API_KEY}`);
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
async function getTopRatedGames() {
  const searchParams = keyParam();
  searchParams.append("ordering", "-metacritic");

  const games = await fetchData(`${baseUrl}/games?${searchParams}`);
  return games.results;
}

async function getGamesBySearchTerm(searchTerm = "GTA") {
  const searchParams = keyParam();
  searchParams.append("search", searchTerm);
  searchParams.append("page_size", "10");
  searchParams.append("ordering", "released");

  const games = await fetchData(`${baseUrl}/games?${searchParams}`);
  return games.results;
}

async function getGamesByPlatform(platformIds) {
  const searchParams = keyParam();
  searchParams.append("platforms", platformIds);
  searchParams.append("page_size", "20");
  searchParams.append("metacritic", "80,100");
  searchParams.append("ordering", "name");

  const games = await fetchData(`${baseUrl}/games?${searchParams}`);
  return games.results;
}

async function getPlatforms() {
  const searchParams = keyParam();
  searchParams.append("page_size", "10");
  searchParams.append("ordering", "-games_count");

  const platforms = await fetchData(`${baseUrl}/platforms?${searchParams}`);
  return platforms.results;
}

async function getGameDetails(gameId) {
  const searchParams = keyParam();
  const game = await fetchData(`${baseUrl}/games/${gameId}?${searchParams}`);
  return game;
}

async function getDevelopers() {
  const searchParams = keyParam();
  searchParams.append("page_size", "10");

  const developers = await fetchData(`${baseUrl}/developers?${searchParams}`);
  return developers.results;
}

export {
  getTopRatedGames,
  getGamesBySearchTerm,
  getPlatforms,
  getGamesByPlatform,
  getGameDetails,
  getDevelopers,
};
