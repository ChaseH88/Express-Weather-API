const express = require("express");
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("apikeys.db");

const { getLocationData } = require("./api/mapbox");
const { getCurrentWeatherData } = require("./api/currentweather");
const { getFutureWeatherData } = require("./api/future-weather");

const app = express();
const PORT = 4001;

db.run(`CREATE TABLE IF NOT EXISTS apikeys (email TEXT PRIMARY KEY, key TEXT)`);

// Create a new endpoint to generate or retrieve API keys
app.get("/api-key", (req, res) => {
  const email = req.query.email.toLowerCase();
  db.get(`SELECT * FROM apikeys WHERE email = ?`, email, (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send({
        message: "Error retrieving API key",
        key: null,
      });
    } else if (row) {
      res.status(200).send({
        message: "API key retrieved successfully",
        key: row.key,
      });
    } else {
      const apiKey = uuidv4();
      db.run(
        `INSERT INTO apikeys (email, key) VALUES (?, ?)`,
        email,
        apiKey,
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).send({
              message: "Error generating API key",
              key: null,
            });
          } else {
            res.status(200).send({
              message: "API key generated successfully",
              key: apiKey,
            });
          }
        }
      );
    }
  });
});

// Add middleware to verify API key on each request
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  db.get(`SELECT * FROM apikeys WHERE key = ?`, apiKey, (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error verifying API key");
    } else if (!row) {
      res.status(401).send("Invalid API key");
    } else {
      next();
    }
  });
});

app.get("/", async ({ query }, res) => {
  const { latitude, longitude } = query;
  const [location, currentWeather, futureWeather] = await Promise.all([
    getLocationData(latitude, longitude),
    getCurrentWeatherData(latitude, longitude),
    getFutureWeatherData(latitude, longitude),
  ]);
  res.status(200).send({
    location,
    currentWeather: currentWeather ? currentWeather.data : null,
    futureWeather: futureWeather ? futureWeather.data : null,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
