import {InfluxDB, QueryApi, FluxTableMetaData} from '@influxdata/influxdb-client'
import { Predictor } from '../prediction/predictor';
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
                let response:ReaderResponse = <ReaderResponse>tableMeta.toObject(row);
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
