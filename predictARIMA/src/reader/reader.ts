import {InfluxDB, QueryApi, FluxTableMetaData} from '@influxdata/influxdb-client'

export class ReaderFromInflux {
    org: string;
    queryApi: QueryApi;

    constructor(org: string, bucket:string, url:string, token:string){
        const influxDB = new InfluxDB({url, token})
        this.org = org;
        this.queryApi = influxDB.getQueryApi(org);
    }

    iterOnReadElement(fluxQuery: string, funToApply: (row: string[], tableMeta: FluxTableMetaData) => void, exitFun: () => void) {
        this.queryApi.queryRows(fluxQuery, {
            next(row: string [], tableMeta: FluxTableMetaData) {
                funToApply(row, tableMeta);
            },
            error(error: Error) {
                console.error(error)
                console.log('\nFinished ERROR')
            },
            complete() {
                console.log("exit fun");
                exitFun();
                console.log(` \nFinished SUCCESS`);
            }
        })
    }
}
