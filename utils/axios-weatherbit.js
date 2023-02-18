const axios = require("axios");

const axiosWeatherbit = axios.create({
  baseURL: "https://api.weatherbit.io/v2.0/",
  method: "get",
  timeout: 10000,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

module.exports = {
  axiosWeatherbit,
};
