const baseUrl = "https://api.rawg.io/api";
//const proxyUrl = "https://cors-anywhere.herokuapp.com";
const API_KEY = "464bc085dbbf4f33bcb2ccb39d36a6ec";
const keyParam = new URLSearchParams(`key=${API_KEY}`);

async function getGames() {
  try {
    const response = await fetch(
      `${baseUrl}/games?${keyParam}&ordering=metacritic-released`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default getGames;
