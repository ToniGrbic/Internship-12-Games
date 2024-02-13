const baseUrl = "https://api.rawg.io/api";
//const proxyUrl = "https://cors-anywhere.herokuapp.com";
const API_KEY = "464bc085dbbf4f33bcb2ccb39d36a6ec";

async function getTopRatedGames() {
  const searchParams = new URLSearchParams(`key=${API_KEY}`);
  searchParams.append("ordering", "metacritic-released");

  try {
    const response = await fetch(`${baseUrl}/games?${searchParams}`);
    const data = await response.json();
    console.log(data);
    return data.results;
  } catch (error) {
    console.error(error);
  }
}

async function getGamesBySearchTerm(searchTerm = "GTA") {
  const searchParams = new URLSearchParams(`key=${API_KEY}`);
  searchParams.append("search", searchTerm);
  searchParams.append("page_size", "10");
  searchParams.append("ordering", "released");

  try {
    const response = await fetch(`${baseUrl}/games?${searchParams}`);
    const data = await response.json();
    console.log(data);
    return data.results;
  } catch (error) {
    console.error(error);
  }
}

export { getTopRatedGames, getGamesBySearchTerm };
