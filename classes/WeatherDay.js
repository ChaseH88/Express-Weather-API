const {
  celsiusToFahrenheit,
  centimetersToInches,
  msToMph,
} = require("../utils/unit-conversion");

class WeatherDay {
  constructor({
    cloud_cover = "",
    air_quality = "",
    dew_point = "",
    datetime = new Date(),
    part_of_day = "",
    precipitation = "",
    pressure = "",
    snowfall = "",
    weather_station = "",
    sunrise = "",
    sunset = "",
    temperature = "",
    feels_like = null,
    timezone = "",
    uv_index = "",
    weather_description = "",
    wind_direction = "",
    wind_speed = "",
    max_wind_speed_gust = "",
    high_temp = null,
    low_temp = null,
  }) {
    this.cloud_cover = `${cloud_cover}%`;
    this.air_quality = `${air_quality} AQI`;
    this.dew_point = `${Math.round(celsiusToFahrenheit(dew_point))} °F`;
    this.datetime = new Date(datetime);
    this.part_of_day = part_of_day
      ? part_of_day === "n"
        ? "Night"
        : "Day"
      : null;
    this.precipitation = `${centimetersToInches(precipitation)} in`;
    this.pressure = `${pressure} hPa`;
    this.snowfall = `${centimetersToInches(snowfall)} in`;
    this.weather_station = weather_station;
    this.sunrise = new Date(sunrise);
    this.sunset = new Date(sunset);
    this.temperature = `${Math.round(celsiusToFahrenheit(temperature))} °F`;
    this.feels_like = feels_like
      ? `${Math.round(celsiusToFahrenheit(feels_like))} °F`
      : "N/A";
    this.timezone = timezone ? timezone : "N/A";
    this.uv_index = Math.round(uv_index * 10) / 10;
    this.weather_description = weather_description ? weather_description : null;
    this.wind_direction = `${wind_direction}°`;
    this.wind_speed = `${msToMph(wind_speed)} mph`;
    this.max_wind_speed_gust = `${msToMph(max_wind_speed_gust)} mph`;
    this.high_temp = high_temp
      ? `${Math.round(celsiusToFahrenheit(high_temp))} °F`
      : null;
    this.low_temp = low_temp
      ? `${Math.round(celsiusToFahrenheit(low_temp))} °F`
      : null;
  }
}

module.exports = {
  WeatherDay,
};
