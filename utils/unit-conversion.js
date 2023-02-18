const celsiusToFahrenheit = (celsius) =>
  Math.round((celsius * 9) / 5 + 32).toFixed(2);

const centimetersToInches = (valueInCm) =>
  Math.round(valueInCm / 2.54).toFixed(2);

const msToMph = (valueInMs) => Math.round(valueInMs * 2.237);

module.exports = {
  celsiusToFahrenheit,
  centimetersToInches,
  msToMph,
};
