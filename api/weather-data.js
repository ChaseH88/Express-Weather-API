const { axiosWeatherbit } = require("../utils/axios-weatherbit");
const { axiosMapbox } = require("../utils/axios-mapbox");
const { withCache } = require("../utils/with-cache");
const { stateMap } = require("../utils/state-map");
const { WeatherDay } = require("../classes/WeatherDay");

const getWeatherData = async (latitude, longitude) => {
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

const getDummyWeatherData = async () => {
  return new Promise((resolve) => {
    resolve({
      location: {
        address:
          "29150 Lake Forest Boulevard, Daphne, Alabama 36526, United States",
        addressText: "Lake Forest Boulevard",
        city: "Daphne",
        state: "Alabama 36526",
        stateAbbr: "AL",
        displayCityState: "Daphne, Alabama",
      },
      weatherData: [
        {
          cloud_cover: "0%",
          air_quality: "48 AQI",
          dew_point: "48 °F",
          datetime: "2023-02-20T00:00:00.000Z",
          part_of_day: "Night",
          precipitation: "0.00 in",
          pressure: "1017 hPa",
          snowfall: "0.00 in",
          weather_station: "G2175",
          sunrise: null,
          sunset: null,
          temperature: "55 °F",
          feels_like: "55 °F",
          timezone: "America/Chicago",
          uv_index: 0,
          weather_description: "Clear sky",
          wind_direction: "179°",
          wind_speed: "4 mph",
          max_wind_speed_gust: "15 mph",
          high_temp: null,
          low_temp: null,
        },
        {
          cloud_cover: "23%",
          air_quality: " AQI",
          dew_point: "44 °F",
          datetime: "2023-02-19T00:00:00.000Z",
          part_of_day: null,
          precipitation: "0.00 in",
          pressure: "1018.8 hPa",
          snowfall: "0.00 in",
          weather_station: "",
          sunrise: null,
          sunset: null,
          temperature: "53 °F",
          feels_like: "N/A",
          timezone: "N/A",
          uv_index: 5.9,
          weather_description: "Scattered clouds",
          wind_direction: "194°",
          wind_speed: "5 mph",
          max_wind_speed_gust: "0 mph",
          high_temp: "64 °F",
          low_temp: "51 °F",
        },
        {
          cloud_cover: "61%",
          air_quality: " AQI",
          dew_point: "56 °F",
          datetime: "2023-02-20T00:00:00.000Z",
          part_of_day: null,
          precipitation: "0.00 in",
          pressure: "1012.1 hPa",
          snowfall: "0.00 in",
          weather_station: "",
          sunrise: null,
          sunset: null,
          temperature: "60 °F",
          feels_like: "N/A",
          timezone: "N/A",
          uv_index: 3.3,
          weather_description: "Broken clouds",
          wind_direction: "228°",
          wind_speed: "9 mph",
          max_wind_speed_gust: "0 mph",
          high_temp: "67 °F",
          low_temp: "62 °F",
        },
        {
          cloud_cover: "96%",
          air_quality: " AQI",
          dew_point: "63 °F",
          datetime: "2023-02-21T00:00:00.000Z",
          part_of_day: null,
          precipitation: "0.00 in",
          pressure: "1009.2 hPa",
          snowfall: "0.00 in",
          weather_station: "",
          sunrise: null,
          sunset: null,
          temperature: "64 °F",
          feels_like: "N/A",
          timezone: "N/A",
          uv_index: 2.6,
          weather_description: "Overcast clouds",
          wind_direction: "214°",
          wind_speed: "10 mph",
          max_wind_speed_gust: "0 mph",
          high_temp: "69 °F",
          low_temp: "62 °F",
        },
        {
          cloud_cover: "59%",
          air_quality: " AQI",
          dew_point: "66 °F",
          datetime: "2023-02-22T00:00:00.000Z",
          part_of_day: null,
          precipitation: "0.00 in",
          pressure: "1011.7 hPa",
          snowfall: "0.00 in",
          weather_station: "",
          sunrise: null,
          sunset: null,
          temperature: "70 °F",
          feels_like: "N/A",
          timezone: "N/A",
          uv_index: 6.1,
          weather_description: "Broken clouds",
          wind_direction: "178°",
          wind_speed: "11 mph",
          max_wind_speed_gust: "0 mph",
          high_temp: "76 °F",
          low_temp: "68 °F",
        },
        {
          cloud_cover: "73%",
          air_quality: " AQI",
          dew_point: "68 °F",
          datetime: "2023-02-23T00:00:00.000Z",
          part_of_day: null,
          precipitation: "0.00 in",
          pressure: "1016 hPa",
          snowfall: "0.00 in",
          weather_station: "",
          sunrise: null,
          sunset: null,
          temperature: "71 °F",
          feels_like: "N/A",
          timezone: "N/A",
          uv_index: 5.5,
          weather_description: "Overcast clouds",
          wind_direction: "184°",
          wind_speed: "8 mph",
          max_wind_speed_gust: "0 mph",
          high_temp: "79 °F",
          low_temp: "69 °F",
        },
        {
          cloud_cover: "68%",
          air_quality: " AQI",
          dew_point: "66 °F",
          datetime: "2023-02-24T00:00:00.000Z",
          part_of_day: null,
          precipitation: "0.00 in",
          pressure: "1019.8 hPa",
          snowfall: "0.00 in",
          weather_station: "",
          sunrise: null,
          sunset: null,
          temperature: "71 °F",
          feels_like: "N/A",
          timezone: "N/A",
          uv_index: 6.3,
          weather_description: "Broken clouds",
          wind_direction: "185°",
          wind_speed: "5 mph",
          max_wind_speed_gust: "0 mph",
          high_temp: "79 °F",
          low_temp: "65 °F",
        },
        {
          cloud_cover: "51%",
          air_quality: " AQI",
          dew_point: "65 °F",
          datetime: "2023-02-25T00:00:00.000Z",
          part_of_day: null,
          precipitation: "0.00 in",
          pressure: "1016.6 hPa",
          snowfall: "0.00 in",
          weather_station: "",
          sunrise: null,
          sunset: null,
          temperature: "70 °F",
          feels_like: "N/A",
          timezone: "N/A",
          uv_index: 6.5,
          weather_description: "Broken clouds",
          wind_direction: "167°",
          wind_speed: "7 mph",
          max_wind_speed_gust: "0 mph",
          high_temp: "77 °F",
          low_temp: "66 °F",
        },
      ],
    });
  });
};

module.exports = {
  getWeatherData,
  getDummyWeatherData,
};

const transformLocationData = (data) => {
  let result = {};

  data.features.forEach((feature) => {
    if (feature.id.includes("address")) {
      result = {
        address: feature.place_name,
        addressText: feature.text,
      };
    }
    if (feature.id.includes("postcode")) {
      const location = feature.place_name.split(",");
      const stateAbbr = location[1].trim().split(" ")[0].trim();
      result = {
        ...result,
        city: location[0].trim(),
        state: location[1].trim(),
        stateAbbr: stateMap[stateAbbr],
        displayCityState: `${location[0].trim()}, ${stateAbbr}`,
      };
    }
  });

  return result;
};

const transformData = (data) => {
  const { location, currentWeather, futureWeather } = data;
  const weatherDataArr = [];
  const currentWeatherData = {};
  currentWeatherData["location"] = location;

  weatherDataArr.push(
    new WeatherDay({
      cloud_cover: currentWeather.clouds,
      air_quality: currentWeather.aqi,
      dew_point: currentWeather.dewpt,
      datetime: currentWeather.datetime.split(":")[0],
      part_of_day: currentWeather.pod,
      precipitation: currentWeather.precip,
      pressure: currentWeather.pres,
      snowfall: currentWeather.snow,
      weather_station: currentWeather.station,
      sunrise: currentWeather.sunrise * 1000, // in Unix time
      sunset: currentWeather.sunset * 1000, // in Unix time
      temperature: currentWeather.temp,
      feels_like: currentWeather.app_temp,
      timezone: currentWeather.timezone,
      uv_index: currentWeather.uv,
      weather_description: currentWeather.weather.description,
      wind_direction: currentWeather.wind_dir,
      wind_speed: currentWeather.wind_spd,
      max_wind_speed_gust: currentWeather.gust,
    })
  );

  futureWeather.data.forEach((day) => {
    weatherDataArr.push(
      new WeatherDay({
        cloud_cover: day.clouds,
        air_quality: day.aqi,
        dew_point: day.dewpt,
        datetime: day.valid_date,
        part_of_day: day.pod,
        precipitation: day.precip,
        pressure: day.pres,
        snowfall: day.snow,
        weather_station: day.station,
        sunrise: day.sunrise,
        sunset: day.sunset,
        temperature: day.temp,
        feels_like: day.app_temp,
        timezone: day.timezone,
        uv_index: day.uv,
        weather_description: day.weather.description,
        wind_direction: day.wind_dir,
        wind_speed: day.wind_spd,
        max_wind_speed_gust: day.gust,
        high_temp: day.high_temp,
        low_temp: day.low_temp,
      })
    );
  });

  currentWeatherData["weatherData"] = weatherDataArr;

  return currentWeatherData;
};
