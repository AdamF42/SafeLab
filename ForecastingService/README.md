# Forecasting Service
Simple service to forecast sensors values.

## REST API

| HTTP Method           | Action                | Description                              |
| --------------------- | --------------------- | ---------------------------------------- |
| GET                  | [temperature](#temperature)  | `Get temperature prediction for specified time range` |
| GET                   | [humidity](#humidity)      | `Get humidity prediction for specified time range` |
| GET                  | [pressure](#pressure)  | `Get pressure prediction for specified time range` |
| GET                   | [peouple](#peouple)      | `Get peouple prediction for specified time range` |

## Temperature

### Request

`http://localhost:5000/predict/temperature?start=2020-07-11 15:40:00&end=2020-07-12 15:40:00` 

### Response

``` JSON
{
    "1594474800000": 32.8699439866,
    "1594475400000": 33.289460494,
    "1594476000000": 33.5824837809,
    "1594476600000": 32.7849945722,
    "1594477200000": 32.9866181349,
    .
    .
    .
    "1594486800000": 33.4842391955
}
```

## Humidity

### Request
`http://localhost:5000/predict/humidity?start=2020-07-11 15:40:00&end=2020-07-12 15:40:00` 
### Response

## Pressure

### Request
`http://localhost:5000/predict/pressure?start=2020-07-11 15:40:00&end=2020-07-12 15:40:00` 
### Response

## Peouple

### Request
`http://localhost:5000/predict/peouple?start=2020-07-11 15:40:00&end=2020-07-12 15:40:00` 
### Response


## How to setup

1. Build the image.
    `docker build --tag=forecasting_service .`
2. Copy the model in the desidered folder.

3. Run the container.
`docker run -p 5000:5000 \
  -v /home/adamf42/Projects/test:/app/models \
    --network host \
    --name forecasting_service forecasting_service
 `

## How to test

Run the postman collection.