const countryData = require("./modules/country-service");
const path = require("path");
const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware to parse request bodies for POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render("home");
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get("/countries", async (req, res) => {
  let countries = [];
  try {
    if (req.query.region) {
      countries = await countryData.getCountriesByRegion(req.query.region);
    } else if (req.query.subRegion) {
      countries = await countryData.getCountriesBySubRegion(req.query.subRegion);
    } else {
      countries = await countryData.getAllCountries();
    }
    res.render("countries", { countries });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
});

app.get("/countries/:id", async (req, res) => {
  try {
    let country = await countryData.getCountryById(req.params.id);
    res.render("country", { country });
  } catch (err) {
    console.log("err:", err);
    res.status(404).render("404", { message: err });
  }
});

// New: GET /editCountry/:id
app.get("/editCountry/:id", async (req, res) => {
  try {
    const country = await countryData.getCountryById(req.params.id);
    const subRegions = await countryData.getAllSubRegions();  // Fetch all subregions
    res.render("editCountry", { country, subRegions });
  } catch (err) {
    res.status(404).render("404", { message: err });
  }
});

// New: GET /addCountry
app.get("/addCountry", async (req, res) => {
  try {
    const subRegions = await countryData.getAllSubRegions(); // Fetch all subregions for dropdown
    res.render("addCountry", { subRegions });
  } catch (err) {
    res.status(500).render("500", { message: `Error fetching subregions: ${err}` });
  }
});

// New: POST /addCountry
app.post("/addCountry", async (req, res) => {
  try {
    await countryData.addCountry(req.body); // Add the new country data to the database
    res.redirect("/countries");
  } catch (err) {
    res.status(500).render("500", { message: `Error adding country: ${err}` });
  }
});

// New: POST /editCountry
app.post("/editCountry", async (req, res) => {
  try {
    await countryData.editCountry(req.body.id, req.body);
    res.redirect("/countries");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});

// New: GET /deleteCountry/:id
app.get("/deleteCountry/:id", async (req, res) => {
  try {
    await countryData.deleteCountry(req.params.id);
    res.redirect("/countries");
  } catch (err) {
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});

app.use((req, res, next) => {
  res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for" });
});

countryData.initialize().then(() => {
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`); });
});
