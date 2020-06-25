# AlertBot Service

Simple telegram bot to warn the users. It should be called by influx.
In order to test and use, you should retrieve the telegram chat id used. 

## REST API

| HTTP Method           | Action              | Description                              |
| --------------------- | ------------------- | ---------------------------------------- |
| POST                  | [Alert](#alert)     | Send alert with the number of people in a certain place.|

## Alert

### Request
`http://localhost:4000/alert` 

``` JSON
{
    "location":"living room",
    "people": 8
}
```

### Response

The service will return the following status codes:
* 201: if everithing works fine
* 404: if an error occurr

## How to setup

1. Insert token and chat id in .env file as shown in [.env.example](.env.example)

2. Build and run with docker:

`docker-compose up -d --build` 


## How to test

Import *AlertBot.postman_collection.json* and *AlertBot.postman_environment* in Postman.
