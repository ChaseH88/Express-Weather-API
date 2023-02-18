# Introduction

The Weather API provides location-based weather data using the Mapbox and OpenWeather APIs. To access the Weather API, you will need to register for an API key.

## Registering for an API Key

To register for an API key, you will need to make a `GET` request to the `/api-keys` endpoint with your email address as a query parameter:

```
GET /api-keys?email=youremail@example.com
```

The server will respond with a JSON object containing the API key:

```
{
  "message": "API key generated successfully",
  "key": "a1b2c3d4-e5f6-4f53-8f12-8e7a94c61b36"
}
```

If you have already registered with the same email address, the server will respond with the existing API key:

```
{
  "message": "API key retrieved successfully",
  "key": "a1b2c3d4-e5f6-4f53-8f12-8e7a94c61b36"
}
```

Keep your API key secret and do not share it with anyone.

## Using the API Key

To use the Weather API, you will need to include your API key in the `X-API-Key` header of your HTTP requests:

```
GET /?latitude=37.7749&longitude=-122.4194
X-API-Key: a1b2c3d4-e5f6-4f53-8f12-8e7a94c61b36
```

# Development

## Setting Up the Server/API

You will need to create a `.env` file in the root directory of the project. This file will contain your API keys for Mapbox and OpenWeather. The file should look like this:

```
WEATHERBIT_API_KEY=
MAPBOX_API_KEY=
```

## Running

To run the server, run the following command:

```
npm run dev
```

This command will start the server and the API as well as listen for changes to the server and API files. If you make any changes to the server or API files, the server will automatically restart using Nodemon.
