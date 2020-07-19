import { INFLUX_URL, INFLUX_TOKEN, ORG, BUCKET, FORCASTER_URL, POLLING_INTERVAL } from './config/constants';
import { PredictionClient } from './client/prediction-client'
import { interval } from 'rxjs';
import { Persister, PointData } from './persister/persister_influx';

const persister = new Persister(INFLUX_URL,INFLUX_TOKEN,ORG,BUCKET);

const predictor = new PredictionClient(FORCASTER_URL)

const createPoints = (obj:any, measurement:string) => {
    let result:Array<PointData> = []
    Object.keys(obj).forEach(e => { 
        let value = parseFloat(obj[e]);
        let dateTime = new Date(parseInt(e));
        let point = new PointData(dateTime, measurement, value);
        
        result.push(point);
    });
    return result;
}

interval(parseInt(POLLING_INTERVAL))
    .subscribe(async () => {
        let response = await predictor.getPrediction();
        let points:Array<PointData> = []

        points = points.concat(createPoints(response.temperature, "temperature")); 
        points = points.concat(createPoints(response.humidity, "humidity"));
        points = points.concat(createPoints(response.people, "people"));
        points = points.concat(createPoints(response.pressure, "pressure"));
        
        persister.writeMultipleData(points);
    }, (err) => {
        console.log('Error: ' + err);
    })



