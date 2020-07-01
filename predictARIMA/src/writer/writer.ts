import {InfluxDB, Point} from '@influxdata/influxdb-client'


export class WriterToInflux {
    org: string;
    bucket: string;
    influxDB: InfluxDB;

    constructor(org: string, bucket:string, url:string, token:string){
        this.org = org;
        this.bucket = bucket;
        this.influxDB = new InfluxDB({url, token})
    }
    
    writePoint(time: Date, measure: string, value: number){
        console.log("Time to wirte", time);
        const writeApi = this.influxDB.getWriteApi(this.org, this.bucket);
        const point = new Point(measure)
            .timestamp(time)
            .floatField('value', value)
        writeApi.writePoint(point)
        writeApi
            .close()
            .catch(e => {
                console.log('WRITE FAILED', e)
            })
    }
}