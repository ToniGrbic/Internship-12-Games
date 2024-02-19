const baseUrl = "https://api.rawg.io/api";
const API_KEY = "464bc085dbbf4f33bcb2ccb39d36a6ec"; //samo za dev, nije sigurno exposati API key na front-endu

const keyParam = () => {
  return new URLSearchParams(`key=${API_KEY}`);
};

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

async function getTopRatedGames() {
  const searchParams = keyParam();
  searchParams.append("ordering", "-metacritic");

  const games = await fetchData(`${baseUrl}/games?${searchParams}`);
  return games.results;
}

async function getGamesBySearchTerm(searchTerm) {
  const searchParams = keyParam();
  searchParams.append("search", searchTerm);
  searchParams.append("page_size", "10");
  searchParams.append("ordering", "released");

  const games = await fetchData(`${baseUrl}/games?${searchParams}`);
  return games.results;
}

async function getGamesByPlatforms(platformIds) {
  const searchParams = keyParam();
  searchParams.append("platforms", platformIds);
  searchParams.append("page_size", "20");
  searchParams.append("metacritic", "50,100"); // nije specificirano u zadatku, dodano kako nebi prikazivalo igre sa null metacritic rating
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

async function getGamesByDeveloper(developerParamValue) {
  const searchParams = keyParam();
  searchParams.append("developers", developerParamValue);
  searchParams.append("page_size", "10");
  searchParams.append("ordering", "-metacritic");

  const games = await fetchData(`${baseUrl}/games?${searchParams}`);
  return games.results;
}

async function getGamesByDateRange(startDate, endDate) {
  const searchParams = keyParam();
  searchParams.append("dates", `${startDate},${endDate}`);
  searchParams.append("page_size", "10");
  searchParams.append("ordering", "-metacritic");

  const games = await fetchData(`${baseUrl}/games?${searchParams}`);
  return games.results;
}

async function getGamesByMetacriticRange(min, max) {
  const searchParams = keyParam();
  searchParams.append("metacritic", `${min},${max}`);
  searchParams.append("page_size", "20");
  searchParams.append("ordering", "-metacritic,name");

  const games = await fetchData(`${baseUrl}/games?${searchParams}`);
  return games.results;
}

export {
  getTopRatedGames,
  getGamesBySearchTerm,
  getPlatforms,
  getGamesByPlatforms,
  getGameDetails,
  getDevelopers,
  getGamesByDeveloper,
  getGamesByDateRange,
  getGamesByMetacriticRange,
};
