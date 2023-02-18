const axios = require("axios");
const { withCache } = require("../utils/with-cache");

const stateMap = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

const axiosInstance = axios.create({
  baseURL: "https://api.mapbox.com/geocoding/v5/mapbox.places/",
  method: "get",
  timeout: 10000,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

const apiKey =
  "pk.eyJ1IjoiY2hhc2VoODgiLCJhIjoiY2s4MHQxN2JjMGkwYzNlbG44Zm5yNXFnbyJ9.5T_O4eM8FvzMiNXzZm5s9g";

/**
 *
 * @param {number} latitude
 * @param {number} longitude
 */
const getLocationData = async (latitude, longitude) =>
  withCache(`${latitude},${longitude}`, async () => {
    const response = await axiosInstance.get(
      `${longitude},${latitude}.json?access_token=${apiKey}`
    );
    return transformData(response.data);
  });

const transformData = (data) => {
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
  getLocationData,
};
