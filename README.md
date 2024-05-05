# Promocode validator API

Time spent: around 6h \
Wishes: type correctly, find a better way to validate OR/AND conditions, something like creating a new data structure to analyze and evaluate all conditions in one pass (or like 2 generative functions passing/returning values)

## Setup

Create a `.env` in the root folder.\
The file must contains the following variables:

```
OPEN_WEATHER_API_KEY=<YOUR-API-KEY>
OPEN_WEATHER_API_URL=https://api.openweathermap.org/data/2.5/weather
PORT=3000
```

## Run the app

install package\
`npm i`

launch app with ts-node\
`npm start`
\
you should see `Fastify server running on port: 3000`

launch tests suite (optional)\
`npm run test`

## Endpoints

(for your information, requests and responses are validated by schemas, so they only take on certain values, see `promocode.schema.ts`)

#### register a promocode:

`http://localhost:3000/api/v1/promocode/register`

payload:

```
{
    "name": "WeatherCode",
    "advantage": {
        "percent": 20
    },
    "restrictions": [
        {
            "date": {
                "after": "2019-01-01",
                "before": "2020-06-30"
            }
        },
        {
            "or": [
                {
                    "age": {
                        "eq": 40
                    }
                },
                {
                    "and": [
                        {
                            "age": {
                                "lt": 30,
                                "gt": 15
                            }
                        },
                        {
                            "weather": {
                                "is": "Clouds",
                                "temp": {
                                    "gt": 5
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
```

#### validate a promocode:

`http://localhost:3000/api/v1/promocode/validate`

payload:

```
{
    "promocode_name": "WeatherCode",
    "arguments": {
        "date": "2020-01-01",
        "age": 40,
        "town": "paris"
    }
}
```

## Basic step-by-step description:

- store a received promocode (no duplicate management, very basic),
- when requesting validation, find it by name.

- browse all JSON items, according to keys, validate/invalidate them and add a field containing the result

- browse this new result to see if all conditions are met to validate the promocode
