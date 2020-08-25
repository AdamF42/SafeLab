const {InfluxDB, Point, dateToProtocolTimestamp} = require('@influxdata/influxdb-client');

const url = 'http://192.168.1.100:9999';
const token = 'n7d9lmC2soRW7-PhxfYhrR1ZXqRQBcrQCKIil8gUa2UqaOmlJ04sgrURIZ2Cy6dBQuWSb1P1HUSgQlmwffWcfQ==';
const org = 'iot-org';
const bucket = 'iot-demo';

const influxDB = new InfluxDB({url, token})

var args = process.argv.slice(2);

var year = args[0];
var month = args[1];
var day = args[2];
var startWork = args[3];
var stopWork = args[4];

async function writeToInfluxDB(epoch, type, value, device, location) {

    var time = new Date(0);
    time.setUTCSeconds(epoch);

    setTimeout(() => {  
        console.log("ore "+time+" value "+value);

        const writeApi = influxDB.getWriteApi(org, bucket)
    
        const point = new Point(type)
            .timestamp(time)
            .intField('value', value)
            .tag('device', device)
            .tag('location', location)
        writeApi.writePoint(point)
    
        writeApi
            .close()
            .catch(e => {
                console.log('WRITE FAILED', e)
            }) 
    }, 
    (Math.random()*50000)+1000);
}

async function getNumPeople(now, startWorkEpoch, stopWorkEpoch, startSleepEpoch, stopSleepEpoch) {

    var time = new Date(0);
    time.setUTCSeconds(now);
    var startWork = new Date(0);
    startWork.setUTCSeconds(startWorkEpoch);
    var stopWork = new Date(0);
    stopWork.setUTCSeconds(stopWorkEpoch);
    var startSleep = new Date(0);
    startSleep.setUTCSeconds(startSleepEpoch);
    var stopSleep = new Date(0);
    stopSleep.setUTCSeconds(stopSleepEpoch);

    if ((time > startWork) && (time < stopWork)) {
        return 0;
    } else if ((time > startSleep) && (time < stopSleep)) {
        return 1;
    } else {
        return ((Math.random() < 0.6) ? 1 : 0);
    }
}

async function dayRoutine(year, month, day, startHour, endHour, distanceBetweenPoints) {
    console.log("Y "+year+" M "+month+" D "+day);
    let today = new Date(year, month, day).getTime() / 1000;
    let tomorrow = new Date(year, month, parseInt(day) + 1).getTime() / 1000;
    let startWork = new Date(year, month, day, startHour).getTime() / 1000;
    let endWork = new Date(year, month, day, endHour).getTime() / 1000;
    let startSleep = new Date(year, month, day, 0).getTime() / 1000;
    let stopSleep = new Date(year, month, day, 7).getTime() / 1000;

    for (i = today; i < tomorrow; i = i + distanceBetweenPoints){
        value = await getNumPeople(i, startWork, endWork, startSleep, stopSleep);  
        writeToInfluxDB(i, "people", value, "peopleCounter", "ubuntu"); 
    }
}

let oneHour = 3600;
let distanceBetweenPoints = oneHour/6; 

dayRoutine(year, month-1, day, startWork, stopWork, distanceBetweenPoints);
