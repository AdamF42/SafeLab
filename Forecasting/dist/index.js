"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reader_1 = require("./reader/reader");
const writer_1 = require("./writer/writer");
const constants_1 = require("./config/constants");
const influxdb_client_1 = require("@influxdata/influxdb-client");
const arimaPredictor_1 = require("./prediction/arimaPredictor");
const predict_1 = require("./prediction/predict");
const rxjs_1 = require("rxjs");
const NUM_POINTS_TO_FORECAST = 5;
const DISTANCE_BETWEEN_POINTS = 15; //minuti tra un punto e il successivo
const NUM_POINT_TO_READ = "1h";
const P_ARIMA = 2;
const D_ARIMA = 2;
const Q_ARIMA = 2;
const fluxQuery = `from(bucket: "${constants_1.BUCKET}")
    |> range(start: -${NUM_POINT_TO_READ}, stop: now())
    |> filter(fn: (r) => r._measurement == "temperature")
    |> toFloat()
    |> aggregateWindow(every: ${DISTANCE_BETWEEN_POINTS}m, fn: median)`;
var url = constants_1.INFLUX_URL;
var token = constants_1.TOKEN;
const influxDB = new influxdb_client_1.InfluxDB({ url, token });
const reader = new reader_1.ReaderFromInflux(influxDB, constants_1.ORG);
const writer = new writer_1.WriterToInflux(influxDB, constants_1.ORG, constants_1.BUCKET);
const arima = new arimaPredictor_1.Arima(NUM_POINTS_TO_FORECAST, P_ARIMA, D_ARIMA, Q_ARIMA);
// reader.iterOnReadElement(fluxQuery, new Predictor(DISTANCE_BETWEEN_POINTS, arima, writer));
rxjs_1.interval(DISTANCE_BETWEEN_POINTS * 60 * 100 /* ms */)
    .subscribe(() => {
    reader.iterOnReadElement(fluxQuery, new predict_1.Predictor(DISTANCE_BETWEEN_POINTS, arima, writer));
}, (err) => {
    console.log('Error: ' + err);
});
