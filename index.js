const express = require("express");
const { getLocationData } = require("./api/mapbox");
const app = express();
const PORT = 4001;

app.get("/", async ({ query }, res) => {
  const { latitude, longitude } = query;
  const data = await getLocationData(latitude, longitude);
  res.status(200).send(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
