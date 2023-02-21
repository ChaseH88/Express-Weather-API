const { axiosWeatherbit } = require("../../utils/axios-weatherbit");
const { axiosMapbox } = require("../../utils/axios-mapbox");
const { withCache } = require("../../utils/with-cache");
const {
  transformLocationData,
} = require("../../transformers/transform-location");
const { transformData } = require("../../transformers/transform-data");

const getWeatherData = async (latitude, longitude) => {
  if (!latitude || !longitude) {
    throw new Error("Latitude and longitude are required");
  }

  const locationDataPromise = withCache(
    `${latitude},${longitude}`,
    async () => {
      const response = await axiosMapbox.get(
        `${longitude},${latitude}.json?access_token=${process.env.MAPBOX_API_KEY}`
      );
      return response.data;
    }
  );

  const futureWeatherPromise = withCache(
    `future-weather-${latitude},${longitude}`,
    async () => {
      const response = await axiosWeatherbit.get(
        `forecast/daily?lat=${latitude}&lon=${longitude}&key=${process.env.WEATHERBIT_API_KEY}`
      );
      return response.data;
    }
  );

  const currentWeatherPromise = withCache(
    `current-weather-${latitude},${longitude}`,
    async () => {
      const response = await axiosWeatherbit.get(
        `current?lat=${latitude}&lon=${longitude}&key=${process.env.WEATHERBIT_API_KEY}`
      );
      return response.data.data[0];
    }
  );

  const [location, currentWeather, futureWeather] = await Promise.all([
    locationDataPromise,
    currentWeatherPromise,
    futureWeatherPromise,
  ]);

  return transformData({
    futureWeather,
    location: transformLocationData(location),
    currentWeather,
  });
};

module.exports = {
  getWeatherData,
};
