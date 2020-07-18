import { INFLUX_URL, INFLUX_TOKEN, ORG, BUCKET } from './config/constants';
import { interval } from 'rxjs';
import { Persister } from './persister/persister_influx';
import {map} from 'rxjs/operators'
import axios, { AxiosInstance } from 'axios';


const persister = new Persister(INFLUX_URL,INFLUX_TOKEN,ORG,BUCKET);

function makeQuery(measurement: string):string {
    return `from(bucket: "${BUCKET}")
    |> range(start: -${NUM_POINT_TO_READ}, stop: now())
    |> filter(fn: (r) => r._measurement == "${measurement}")
    |> toFloat()
    |> aggregateWindow(every: ${DISTANCE_BETWEEN_POINTS}m, fn: median)`;
}

function performRequest(options: RequestOptions) {
    return new Promise((resolve, reject) => {
      request(
        options,
        function(response) {
          const { statusCode } = response;
          if (statusCode >= 300) {
            reject(
              new Error(response.statusMessage)
            )
          }
          const chunks = [];
          response.on('data', (chunk) => {
            chunks.push(chunk);
          });
          response.on('end', () => {
            const result = Buffer.concat(chunks).toString();
            resolve(JSON.parse(result));
          });
        }
      )
        .end();
    })
  }

function forecast(query:string, saved_name:string) {
    interval(2 * 60 * 60 * 1000 /* ms */)
        .pipe(map(async () => { return await persister.getLastData(query); }))
        .subscribe(async (result) => {
            let predictions = arima.makePrediction(await result);
            (await predictions)
                .forEach(val => {
                    console.log(val);
                    persister.writeData(new Date(Date.now() + DISTANCE_BETWEEN_POINTS), saved_name, val);
                });
        }, (err) => {
            console.log('Error: ' + err);
        });
}

["temperature", "humidity", "pressure"]
.forEach(measurement => forecast(makeQuery(measurement), `${measurement}_prevision`));