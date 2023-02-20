const { stateMap } = require("../utils/state-map");

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

module.exports = {
  transformLocationData,
};
