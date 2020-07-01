import {InfluxDB, Point} from '@influxdata/influxdb-client'


export class WriterToInflux {
    org: string;
    bucket: string;
    influxDB: InfluxDB;

    constructor(influxDB: InfluxDB, org: string, bucket:string){
        this.org = org;
        this.bucket = bucket;
        this.influxDB = influxDB;
    }
    
    writePoint(time: Date, measure: string, value: number){
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