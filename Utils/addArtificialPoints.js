const {InfluxDB, Point} = require('@influxdata/influxdb-client');

const url = '******';
const token = '******';
const org = '******';
const bucket = '******';

const influxDB = new InfluxDB({url, token})

async function writeToInfluxDB(epoch, temp, hum, device) {

    let ran = (Math.floor(Math.random() * 200)-100)/1000;
    let randTemp = temp + ran;
    let randHum = hum + ran;
    console.log("Temp "+temp+" - Hum "+hum+" RandTemp "+Math.round(randTemp * 1000) / 1000+" - Hum "+Math.round(randHum * 1000) / 1000);

    var time = new Date(0);
    time.setUTCSeconds(epoch);

    const writeApi = influxDB.getWriteApi(org, bucket)

    const tempPoint = new Point("temperature")
        .timestamp(time)
        .floatField('value', randTemp)
        .tag('device', device)
        .tag('location', 'ubuntu')
    writeApi.writePoint(tempPoint)
    
    const humPoint = new Point("humidity")
        .timestamp(time)
        .floatField('value', randHum)
        .tag('device', device)
        .tag('location', 'ubuntu')
    writeApi.writePoint(humPoint)

    // const pressPoint = new Point("pressure")
    //     .timestamp(time)
    //     .floatField('value', press)
    //     .tag('device', 'test')
    //     .tag('location', 'ubuntu')
    // writeApi.writePoint(pressPoint)

    writeApi
        .close()
        .catch(e => {
            console.log('WRITE FAILED', e)
        })
}

var startEpoch = 1594462835;



async function addPoints() {
    startTime = 1594544400;
    endTime = 1594548300;
    numPoint = (endTime-startTime)/300;

    console.log(numPoint);

    startTemp = 28.9;
    endTemp = 28.5;
    deltaTemp = (endTemp-startTemp)/numPoint;
    
    startHum = 52.2;
    endHum = 52.7;
    deltaHum = (endHum - startHum)/numPoint;

    var temp = startTemp;
    var hum = startHum;

    for (i = startTime; i < endTime; i = i + 300, temp = temp + deltaTemp, hum = hum + deltaHum){
        await writeToInfluxDB(i, temp, hum, 'RoomWeather');       
    }
}

addPoints();
