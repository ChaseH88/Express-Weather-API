const { WeatherDay } = require("../classes/WeatherDay");

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

module.exports = {
  transformData,
};
