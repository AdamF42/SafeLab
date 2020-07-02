import {InfluxDB, QueryApi, FluxTableMetaData} from '@influxdata/influxdb-client'
import { Predictor } from '../predict';
import { ReaderResponse } from '../response';

export class ReaderFromInflux {
    org: string;
    queryApi: QueryApi;

    constructor(influxDB: InfluxDB, org: string){
        this.org = org;
        this.queryApi = influxDB.getQueryApi(org);
    }

    iterOnReadElement(fluxQuery: string, predictor: Predictor) {
        this.queryApi.queryRows(fluxQuery, {
            next(row: string [], tableMeta: FluxTableMetaData) {
                const o = tableMeta.toObject(row)
                var time: Date = new Date(o._time);
                var value: number = o._value;
                var field: string = o._field;
                var measurement: string = o._measurement;
                var response = new ReaderResponse(time, value, field, measurement);
                predictor.pushReadValues(response);
            },
            error(error: Error) {
                console.error(error)
                console.log('\nFinished ERROR')
            },
            complete() {
                predictor.writePrevision();
                console.log(` \nFinished SUCCESS`);
            }
        })
    }
}
