import { INFLUX_URL, INFLUX_TOKEN, ORG, BUCKET } from './config/constants';
import { PredictionClient } from './client/prediction-client'
import { interval } from 'rxjs';
import { Persister } from './persister/persister_influx';

const persister = new Persister(INFLUX_URL,INFLUX_TOKEN,ORG,BUCKET);
const sensorName = "Forcaster";

const predictor = new PredictionClient("http://127.0.0.1:5000")

interval(2 * 60 * 60 * 1000 /* ms */)
    .subscribe(async (result) => {

        let response = await predictor.getPrediction();
        let temperature = response.temperature
        let humidity = response.humidity
        let people = response.people
        let pressure = response.pressure

        Object.keys(temperature).forEach(e => { 
            let date = e;
            let value = temperature[e];
            let dateTime = new Date(parseInt(date));
            let result = parseFloat(value);
            persister.writeData(dateTime, sensorName, result);
        });

    }, (err) => {
        console.log('Error: ' + err);
    })



