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
    "_check_id": "05a5547a510fb000",
    "_check_name": "Temperature",
    "_level": "crit",
    "_measurement": "notifications",
    "_message": "",
    "_notification_endpoint_id": "05a554abfdcfb000",
    "_notification_endpoint_name": "Telegram",
    "_notification_rule_id": "05eec2ceea796000",
    "_notification_rule_name": "Temperature",
    "_source_measurement": "temperature",
    "_source_timestamp": 1593626205000000000,
    "_start": "2020-07-01T17:55:00Z",
    "_status_timestamp": 1593626205000000000,
    "_stop": "2020-07-01T17:57:00Z",
    "_time": "2020-07-01T17:57:00Z",
    "_type": "threshold",
    "_version": 1,
    "device": "RoomWeather",
    "location": "ubuntu",
    "value": 30.6 
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
