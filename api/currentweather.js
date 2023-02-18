const { withCache } = require("../utils/with-cache");
const {
  celsiusToFahrenheit,
  centimetersToInches,
  msToMph,
} = require("../utils/unit-conversion");
const { axiosWeatherbit } = require("../utils/axios-weatherbit");

/**
 *
 * @param {number} latitude
 * @param {number} longitude
 */
const getCurrentWeatherData = async (latitude, longitude) =>
  withCache(`current-weather-${latitude},${longitude}`, async () => {
    const response = await axiosWeatherbit.get(
      `current?lat=${latitude}&lon=${longitude}&key=${process.env.WEATHERBIT_API_KEY}`
    );
    return transformData(response.data.data[0]);
  });

const transformData = (weatherData) => {
  const result = {};
  result["feels_like"] = `${Math.round(
    celsiusToFahrenheit(weatherData.app_temp)
  )} °F`;
  result["air_quality_index"] = weatherData.aqi;
  result["cloud_cover"] = `${weatherData.clouds}%`;
  result["date_time"] = weatherData.datetime;
  result["dew_point"] = `${Math.round(
    celsiusToFahrenheit(weatherData.dewpt)
  )} °F`;
  result["direct_horizontal_irradiance"] = weatherData.dhi;
  result["direct_normal_irradiance"] = weatherData.dni;
  result["elevation_angle"] = `${weatherData.elev_angle}°`;
  result["global_horizontal_irradiance"] = weatherData.ghi;
  result["max_wind_gust_speed"] = `${msToMph(weatherData.gust)} mph`;
  result["observation_time"] = weatherData.ob_time;
  result["part_of_day"] = weatherData.pod === "n" ? "Night" : "Day";
  result["precipitation"] = `${centimetersToInches(weatherData.precip)} in`;
  result["pressure"] = `${weatherData.pres} hPa`;
  result["relative_humidity"] = `${weatherData.rh}%`;
  result["sea_level_pressure"] = `${weatherData.slp} hPa`;
  result["snowfall"] = `${centimetersToInches(weatherData.snow)} in`;
  result["solar_radiation"] = `${weatherData.solar_rad} W/m²`;
  result["sources"] = weatherData.sources;
  result["state"] = weatherData.state_code;
  result["weather_station"] = weatherData.station;
  result["sunrise"] = weatherData.sunrise;
  result["sunset"] = weatherData.sunset;
  result["temperature"] = `${Math.round(
    celsiusToFahrenheit(weatherData.temp)
  )} °F`;
  result["timezone"] = weatherData.timezone;
  result["unix_timestamp"] = weatherData.ts;
  result["uv_index"] = weatherData.uv;
  result["visibility"] = `${centimetersToInches(weatherData.vis)} in`;
  result["weather_description"] = weatherData.weather.description;
  result[
    "wind_direction"
  ] = `${weatherData.wind_dir}° ${weatherData.wind_cdir_full}`;
  result["wind_speed"] = `${msToMph(weatherData.wind_spd)} mph`;
  return result;
};

module.exports = {
  getCurrentWeatherData,
};
