import { AlertGenerator, AlertObject } from './environment/alert/alertGenerator';

var Args = process.argv.slice(2);

const token = Args[0]; 
const address = Args[1]; 
const orgID = Args[2]; 
const userID = Args[3]; 
const bucketName = Args[4]; 
const taskName = Args[5]; 
const taskDescription = Args[6]; 
const timeInterval = Args[7]; 
const start = Args[8]; 
const measurement = Args[9]; 
const aggregateWindow = Args[10]; 
const msg = "Check: ${ r._check_name } is: ${ r._level }";
const criticValue = parseInt(Args[11]); 
const typeThreshold = Args[12];  
const device = Args[13];
const query = 
    `from(bucket: \"${bucketName}\")
    |> range(start: -${start}, stop: now())
    |> filter(fn: (r) => r["_measurement"] == \"${measurement}\")
    |> filter(fn: (r) => r["_field"] == "value")
    |> filter(fn: (r) => r["device"] == \"${device}\")
    `

const threshold =   [{
                        "allValues": false,
                        "level": "CRIT",
                        "value": criticValue,
                        "type": typeThreshold
                    }];


let alertGenerator = new AlertGenerator(address, token);

let alert = new AlertObject(taskName, taskDescription, timeInterval, orgID, userID, bucketName, measurement, aggregateWindow, query, msg, threshold);
let alertID = alertGenerator.create(alert);
