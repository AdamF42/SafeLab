"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaderFromInflux = void 0;
const response_1 = require("../response");
class ReaderFromInflux {
    constructor(influxDB, org) {
        this.org = org;
        this.queryApi = influxDB.getQueryApi(org);
    }
    iterOnReadElement(fluxQuery, predictor) {
        this.queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                var time = new Date(o._time);
                var value = o._value;
                var field = o._field;
                var measurement = o._measurement;
                var response = new response_1.ReaderResponse(time, value, field, measurement);
                predictor.pushReadValues(response);
            },
            error(error) {
                console.error(error);
                console.log('\nFinished ERROR');
            },
            complete() {
                predictor.writePrevision();
                console.log(` \nFinished SUCCESS`);
            }
        });
    }
}
exports.ReaderFromInflux = ReaderFromInflux;
