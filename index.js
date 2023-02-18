const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("apikeys.db");

const { getLocationData, createDummyLocationData } = require("./api/mapbox");
const {
  getCurrentWeatherData,
  createDummyWeatherData,
} = require("./api/currentweather");
const { getFutureWeatherData } = require("./api/future-weather");

const app = express();
const PORT = 4001;

// Create the apikeys table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS apikeys (email TEXT PRIMARY KEY, key TEXT)`);

// Create or retrieve an API key for the given email address
app.get("/api-keys", (req, res) => {
  const email = req.query.email.toLowerCase();
  db.get(`SELECT * FROM apikeys WHERE email = ?`, email, (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error retrieving API key",
        key: null,
      });
    }
    if (row) {
      return res.json({
        message: "API key retrieved successfully",
        key: row.key,
      });
    }
    const apiKey = uuidv4();
    db.run(
      `INSERT INTO apikeys (email, key) VALUES (?, ?)`,
      email,
      apiKey,
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            message: "Error generating API key",
            key: null,
          });
        }
        res.json({
          message: "API key generated successfully",
          key: apiKey,
        });
      }
    );
  });
});

// Verify API key on each request
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  db.get(`SELECT * FROM apikeys WHERE key = ?`, apiKey, (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error verifying API key");
    }
    if (!row) {
      return res.status(401).send("Invalid API key");
    }
    next();
  });
});

// Retrieve location and weather data
app.get("/", async ({ query }, res) => {
  const { latitude, longitude } = query;
  try {
    const [location, currentWeather, futureWeather] = await Promise.all([
      getLocationData(latitude, longitude),
      getCurrentWeatherData(latitude, longitude),
      getFutureWeatherData(latitude, longitude),
    ]);
    res.json({
      location,
      currentWeather: currentWeather?.data || null,
      futureWeather: futureWeather?.data || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data");
  }
});

/**
 * Dummy endpoint for testing
 */
app.get("/dummy", async ({ query }, res) => {
  const { latitude, longitude } = query;
  console.log(`latitude: ${latitude}, longitude: ${longitude}`);
  try {
    const currentWeather = createDummyWeatherData();
    const location = createDummyLocationData();
    res.json({
      location,
      currentWeather,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
