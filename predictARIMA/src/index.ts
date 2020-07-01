import { ReaderFromInflux } from './reader/reader';
import { WriterToInflux } from './writer/writer'
import { INFLUX_URL, TOKEN, ORG, BUCKET } from './config/constants';
import { FluxTableMetaData } from '@influxdata/influxdb-client'
// import { P_ARIMA, D_ARIMA, Q_ARIMA } from './arima/arimaParam'
import { Predictor } from './arima/arimaPredictor'
import { Observable, timer, interval, of } from 'rxjs';




const NUM_POINTS_TO_FORECAST = 1;
const DISTANCE_BETWEEN_POINTS = 10; //minuti tra un punto e il successivo
const NUM_POINT_TO_READ = "4h"

const fluxQuery =
    `from(bucket: "${BUCKET}")
     |> range(start: -${NUM_POINT_TO_READ}, stop: now())
     |> filter(fn: (r) => r._measurement == "temperature")
     |> toFloat()
     |> aggregateWindow(every: ${DISTANCE_BETWEEN_POINTS}m, fn: median)`

console.log(fluxQuery)

const reader = new ReaderFromInflux(ORG, BUCKET, INFLUX_URL, TOKEN);
const predictor = new Predictor(NUM_POINTS_TO_FORECAST, 2, 1, 2);
const writer = new WriterToInflux(ORG, BUCKET, INFLUX_URL, TOKEN);

var history: number[] = [];

function pushHistory(row: string[], tableMeta: FluxTableMetaData){
    const o = tableMeta.toObject(row);
    var tempValue = parseFloat(o._value);
    history.push(tempValue);
}

function predictFutureValue() {
    var prediction = predictor.predict(history);
    console.log("Provo a scrivere");
    var timePrev = Date.now() + DISTANCE_BETWEEN_POINTS;
    writer.writePoint(new Date(timePrev), "tempPrev", prediction[0]);
}


interval(DISTANCE_BETWEEN_POINTS * 60 * 100 /* ms */)
.subscribe(
    () => {
        reader.iterOnReadElement(fluxQuery, pushHistory, predictFutureValue);
    },
    (err) => {
        console.log('Error: ' + err);
    });