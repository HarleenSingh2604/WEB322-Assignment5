const countryData = require("../data/countryData.json");  // Corrected to load JSON
const subRegionData = require("../data/subRegionData.json");  // Corrected to load JSON

let countries = [];

// Initialize countries with subRegion data
function initialize() {
  return new Promise((resolve, reject) => {
    try {
      countryData?.forEach((country) => {
        let countryWithSubRegion = {
          ...country,
          subRegionObj: subRegionData.find((sr) => sr.id == country.subRegionId),
        };
        countries.push(countryWithSubRegion);
      });
      resolve();
    } catch (err) {
      reject("Initialization failed: " + err);
    }
  });
}

// Fetch all countries
function getAllCountries() {
  return new Promise((resolve) => {
    resolve(countries);
  });
}

// Fetch a country by ID
function getCountryById(id) {
  return new Promise((resolve, reject) => {
    const foundCountry = countries.find((c) => c.id == id);
    if (foundCountry) {
      resolve(foundCountry);
    } else {
      reject("Unable to find requested country");
    }
  });
}

// Fetch countries by sub-region
function getCountriesBySubRegion(subRegion) {
  return new Promise((resolve, reject) => {
    const foundCountries = countries.filter((c) =>
      c.subRegionObj.subRegion.toUpperCase().includes(subRegion.toUpperCase())
    );
    if (foundCountries.length > 0) {
      resolve(foundCountries);
    } else {
      reject(`Unable to find requested countries for the given subRegion - ${subRegion}`);
    }
  });
}

// Fetch countries by region
function getCountriesByRegion(region) {
  return new Promise((resolve, reject) => {
    const foundCountries = countries.filter((c) =>
      c.subRegionObj.region.toUpperCase().includes(region.toUpperCase())
    );
    if (foundCountries.length > 0) {
      resolve(foundCountries);
    } else {
      reject(`Unable to find requested countries for the given region - ${region}`);
    }
  });
}

// Edit an existing country by ID
function editCountry(id, countryData) {
  return new Promise((resolve, reject) => {
    const countryIndex = countries.findIndex((c) => c.id == id);
    if (countryIndex !== -1) {
      countries[countryIndex] = {
        ...countries[countryIndex],
        ...countryData,
        subRegionObj: subRegionData.find((sr) => sr.id == countryData.subRegionId),
      };
      resolve();
    } else {
      reject(`Unable to find country with id ${id} for editing`);
    }
  });
}

// Delete a country by ID
function deleteCountry(id) {
  return new Promise((resolve, reject) => {
    const countryIndex = countries.findIndex((c) => c.id == id);
    if (countryIndex !== -1) {
      countries.splice(countryIndex, 1);
      resolve();
    } else {
      reject(`Unable to find country with id ${id} for deletion`);
    }
  });
}

// Fetch all sub-regions
function getAllSubRegions() {
  return new Promise((resolve) => {
    resolve(subRegionData);
  });
}

// Add a new country
function addCountry(countryData) {
  return new Promise((resolve, reject) => {
    try {
      // Generate a unique ID for the new country
      const newCountryId = countries.length > 0 ? Math.max(...countries.map((c) => c.id)) + 1 : 1;

      // Add new country to the list
      const newCountry = {
        id: newCountryId,
        ...countryData,
        subRegionObj: subRegionData.find((sr) => sr.id == countryData.subRegionId),
      };
      countries.push(newCountry);
      resolve(newCountry);  // Resolving with the newly added country
    } catch (err) {
      reject(`Failed to add new country: ${err}`);
    }
  });
}

module.exports = {
  initialize,
  getAllCountries,
  getCountryById,
  getCountriesByRegion,
  getCountriesBySubRegion,
  editCountry,
  deleteCountry,
  getAllSubRegions,
  addCountry,  // Export the addCountry function
};
