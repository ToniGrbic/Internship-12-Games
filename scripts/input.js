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

function inputMetacriticRange() {
  let min = 0;
  let max = 0;
  const promptHelp =
    "(range: 0-100, note: decimals are rounded to nearest int)";
  do {
    min = Number(prompt(`Enter a minimum metacritic rating ${promptHelp}:`));

    if (isNaN(min) || min < 0 || min > 100) {
      alert("Invalid input. Please enter a number between 0 and 100.");
      continue;
    }
    max = Number(prompt(`Enter a maximum metacritic rating ${promptHelp}:`));

    if (isNaN(max) || max < 0 || max > 100) {
      alert("Invalid input. Please enter a number between 0 and 100.");
      continue;
    }
    if (min > max) {
      alert("Minimum rating should be less than maximum rating.");
    }
  } while (min > max);
  return [Math.round(min), Math.round(max)];
}

function inputPlatforms(platformNames) {
  let containsPlatforms = true;
  let platformIds = "";
  do {
    const selectedPlatforms = prompt(
      `Enter names of platforms separated by comma:\n top platforms: ${platformNames
        .map((platform) => platform.name)
        .join(", ")}`
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
      alert("input contains invalid platform names. Please try again.");
      continue;
    }
    const platformListSpan = document.querySelector("#selected-platforms");
    platformListSpan.textContent = selectedPlatforms;

    // find the platform ids
    platformIds = getPlatformIds(platformNames, selectedPlatformsArray);
  } while (!containsPlatforms);
  return platformIds;
}

function getPlatformIds(platformNames, selectedPlatforms) {
  const platformIds = selectedPlatforms.map((platform) => {
    return platformNames.find((platformName) => platformName.name === platform)
      .id;
  });
  return platformIds.join(",");
}

function inputDevelopersAndConvertToSlugs(developerSlugs, developerNames) {
  let areSlugsValid = false;
  let selectedDeveloperSlugs = [];
  do {
    const selectedDevelopers = prompt(
      `top developers: ${developerNames.join(
        ", "
      )}\nEnter a list of developer names separated by commas:\n `
    );
    const selectedDevelopersArray = selectedDevelopers.split(",");

    // convert all developer names to slug format (ex. "Rockstar Games" -> "rockstar-games")
    selectedDeveloperSlugs = selectedDevelopersArray.map((developer) => {
      const trimmedName = developer.trim();
      return formatToSlug(trimmedName);
    });

    // Check that all inputed slugs are from the developerSlugs list
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

function formatToSlug(trimmedName) {
  let slug = "";
  if (trimmedName.includes(" ")) {
    const words = trimmedName.split(" ");
    slug = words.join("-");
  } else {
    slug = trimmedName;
  }
  return slug.toLowerCase();
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

export {
  inputString,
  inputMetacriticRange,
  inputPlatforms,
  inputDevelopersAndConvertToSlugs,
  inputDate,
};
