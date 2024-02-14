const baseUrl = "https://api.rawg.io/api";
//const proxyUrl = "https://cors-anywhere.herokuapp.com";
const API_KEY = "464bc085dbbf4f33bcb2ccb39d36a6ec";

function keyParam() {
  return new URLSearchParams(`key=${API_KEY}`);
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data.results;
  } catch (error) {
    console.error(error);
  }
}
async function getTopRatedGames() {
  const searchParams = keyParam();
  searchParams.append("ordering", "-metacritic");

  const games = await fetchData(`${baseUrl}/games?${searchParams}`);
  return games;
}

async function getGamesBySearchTerm(searchTerm = "GTA") {
  const searchParams = keyParam();
  searchParams.append("search", searchTerm);
  searchParams.append("page_size", "10");
  searchParams.append("ordering", "released");

  const games = await fetchData(`${baseUrl}/games?${searchParams}`);
  return games;
}

async function getGamesByPlatform(platformIds) {
  const searchParams = keyParam();
  searchParams.append("platforms", platformIds);
  searchParams.append("page_size", "20");
  searchParams.append("metacritic", "80,100");
  searchParams.append("ordering", "name");

  const games = await fetchData(`${baseUrl}/games?${searchParams}`);
  return games;
}

async function getPlatforms() {
  const searchParams = keyParam();
  searchParams.append("page_size", "10");
  searchParams.append("ordering", "-games_count");

  const platforms = await fetchData(`${baseUrl}/platforms?${searchParams}`);
  return platforms;
}

export {
  getTopRatedGames,
  getGamesBySearchTerm,
  getPlatforms,
  getGamesByPlatform,
};
