const createDummySevereAlertsData = () => {
  const data = {
    country_code: "US",
    lon: -84.19161,
    timezone: "America/New_York",
    lat: 39.75895,
    city_name: "Dayton",
    state_code: "OH",
    alerts: [createDummyWeatherAlert(), createDummyWeatherAlert()],
  };

  return data;
};

const randomWeatherEvent = () => {
  const events = [
    "Thunderstorm",
    "Tornado",
    "Hurricane",
    "Blizzard",
    "Heat Wave",
    "Flood",
    "Drought",
    "Wildfire",
    "High Wind",
    "Hailstorm",
    "Tropical Storm",
    "Ice Storm",
    "Heavy Snow",
    "Severe Thunderstorm",
    "Flash Flood",
    "Dust Storm",
    "Frost",
    "Freezing Rain",
    "Gale Warning",
  ];
  const randomIndex = Math.floor(Math.random() * events.length);
  return events[randomIndex];
};

const createDummyWeatherAlert = () => {
  const effectiveUtc = new Date().toISOString();
  const effectiveLocal = new Date().toLocaleString();
  const expiresUtc = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const expiresLocal = new Date(Date.now() + 60 * 60 * 1000).toLocaleString();
  const onsetUtc = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  const onsetLocal = new Date(Date.now() + 30 * 60 * 1000).toLocaleString();
  const endsUtc = new Date(Date.now() + 90 * 60 * 1000).toISOString();
  const endsLocal = new Date(Date.now() + 90 * 60 * 1000).toLocaleString();
  const regions = ["Region 1", "Region 2", "Region 3"];
  const title = `Weather Alert: ${randomWeatherEvent()} Alert`;
  const description = `This is a ${randomWeatherEvent()} alert description`;
  const severity = ["Advisory", "Watch", "Warning"][
    Math.floor(Math.random() * 3)
  ];

  return {
    title,
    description,
    severity,
    effective_utc: effectiveUtc,
    effective_local: effectiveLocal,
    expires_utc: expiresUtc,
    expires_local: expiresLocal,
    onset_utc: onsetUtc,
    onset_local: onsetLocal,
    ends_utc: endsUtc,
    ends_local: endsLocal,
    uri: "https://example.com/alert",
    regions,
  };
};

module.exports = {
  createDummySevereAlertsData,
};
