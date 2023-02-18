const { withCache } = require("../utils/with-cache");
const {
  celsiusToFahrenheit,
  centimetersToInches,
  msToMph,
} = require("../utils/unit-conversion");
const { axiosWeatherbit } = require("../utils/axios-weatherbit");

const apiKey = "47b4b166bf68465eb7c4695bd5f4e6f5";

/**
 *
 * @param {number} latitude
 * @param {number} longitude
 */
const getFutureWeatherData = async (latitude, longitude) =>
  withCache(`future-weather-${latitude},${longitude}`, async () => {
    const response = await axiosWeatherbit.get(
      `forecast/daily?lat=${latitude}&lon=${longitude}&key=${apiKey}`
    );

    return transformData(response.data);
  });

const transformData = (weatherData) => {
  const result = weatherData.data.map((day) => {
    console.log(day);
    return {
      app_max_temp: `${Math.round(celsiusToFahrenheit(day.app_max_temp))} °F`,
      app_min_temp: `${Math.round(celsiusToFahrenheit(day.app_min_temp))} °F`,
      cloud_cover: `${day.clouds}%`,
      clouds_hi: `${day.clouds_hi}%`,
      clouds_low: `${day.clouds_low}%`,
      clouds_mid: `${day.clouds_mid}%`,
      date: day.datetime,
      dew_point: `${Math.round(celsiusToFahrenheit(day.dewpt))} °F`,
      high_temp: `${Math.round(celsiusToFahrenheit(day.high_temp))} °F`,
      low_temp: `${Math.round(celsiusToFahrenheit(day.low_temp))} °F`,
      max_temp: `${Math.round(celsiusToFahrenheit(day.max_temp))} °F`,
      min_temp: `${Math.round(celsiusToFahrenheit(day.min_temp))} °F`,
      moon_phase: `${day.moon_phase}`,
      moon_phase_lunation: `${day.moon_phase_lunation}`,
      moonrise: new Date(day.moonrise_ts * 1000).toLocaleString(),
      moonset: new Date(day.moonset_ts * 1000).toLocaleString(),
      ozone: `${day.ozone} DU`,
      pop: `${day.pop}%`,
      precip: `${centimetersToInches(day.precip)} in`,
      pressure: `${day.pres} mb`,
      relative_humidity: `${day.rh}%`,
      snowfall: `${centimetersToInches(day.snow)} in`,
      snow_depth: `${centimetersToInches(day.snow_depth)} in`,
      sunrise: new Date(day.sunrise_ts * 1000).toLocaleString(),
      sunset: new Date(day.sunset_ts * 1000).toLocaleString(),
      temp: `${Math.round(celsiusToFahrenheit(day.temp))} °F`,
      unix_timestamp: day.ts,
      uv_index: `${day.uv}`,
      valid_date: day.valid_date,
      visibility: `${centimetersToInches(day.vis)} in`,
      weather_description: day.weather?.description || "N/A",
      wind_direction: `${day.wind_dir}° ${day.wind_cdir_full}`,
      wind_gust_speed: `${Math.round(msToMph(day.wind_gust_spd))} mph`,
      wind_speed: `${Math.round(msToMph(day.wind_spd))} mph`,
    };
  });
  return result;
};

module.exports = {
  getFutureWeatherData,
};
