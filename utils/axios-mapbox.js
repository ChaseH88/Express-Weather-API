const axios = require("axios");

const axiosMapbox = axios.create({
  baseURL: "https://api.mapbox.com/geocoding/v5/mapbox.places/",
  method: "get",
  timeout: 10000,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

module.exports = {
  axiosMapbox,
};
