"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriterToInflux = void 0;
const influxdb_client_1 = require("@influxdata/influxdb-client");
class WriterToInflux {
    constructor(influxDB, org, bucket) {
        this.org = org;
        this.bucket = bucket;
        this.influxDB = influxDB;
    }
    writePoint(time, measure, value) {
        const writeApi = this.influxDB.getWriteApi(this.org, this.bucket);
        const point = new influxdb_client_1.Point(measure)
            .timestamp(time)
            .floatField('value', value);
        writeApi.writePoint(point);
        writeApi
            .close()
            .catch(e => {
            console.log('WRITE FAILED', e);
        });
    }
}
exports.WriterToInflux = WriterToInflux;
