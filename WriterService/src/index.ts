import { INFLUX_URL, INFLUX_TOKEN, ORG, BUCKET } from './config/constants';
import { Persister } from './persister/persister_influx';
import { PredictionClient } from './client/prediction-client'
import { Prediction } from './model/Prediction'
import { AxiosResponse } from 'axios';

var axios = require('axios');


const persister = new Persister(INFLUX_URL,INFLUX_TOKEN,ORG,BUCKET);
const sensorName = "RoomWeather";

const predictor = new PredictionClient("http://127.0.0.1:5000")
predictor.getPrediction().then((response: AxiosResponse<Prediction>) => {
    response.then( (prediction) => {
        prediction.temperature.forEach((key, value) => console.log(key, value));
    })
})

// var request = {
//     method: 'get',
//     url: 'http://127.0.0.1:5000/predict',
//     headers: { }
// };

// axios(request)
// .then(function (response) {
//     var prediction = new Prediction(JSON.stringify(response.data));
//     prediction.getTempMap().forEach((value: string, key: string) => {
//         let dateTime = new Date(parseInt(key));
//         let result = parseFloat(value);
//         persister.writeData(dateTime, sensorName, result);
//     })
//     prediction.getHumMap().forEach((value: string, key: string) => {
//         let dateTime = new Date(parseInt(key));
//         let result = parseFloat(value);
//         persister.writeData(dateTime, sensorName, result);
//     })
//     prediction.getPressMap().forEach((value: string, key: string) => {
//         let dateTime = new Date(parseInt(key));
//         let result = parseFloat(value);
//         persister.writeData(dateTime, sensorName, result);
//     })
// })
// .catch(function (error) {
//     console.log(error);
// });



























// interval(2 * 60 * 60 * 1000 /* ms */)
//     .subscribe(async (result) => {
//         let predictions = predictor.getPrediction();
//         (await predictions)
//             .forEach(value => {
//                 console.log(value);
//                 persister.writeData(new Date(Date.now() + DISTANCE_BETWEEN_POINTS), sensorName, value);
//             });
//     }, (err) => {
//         console.log('Error: ' + err);
//     })



