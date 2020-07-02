"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReaderResponse = void 0;
class ReaderResponse {
    constructor(time, value, field, measurement) {
        this._time = time;
        this._value = value;
        this._field = field;
        this._measurement = measurement;
    }
    get value() {
        return this._value;
    }
    get measurement() {
        return this._measurement;
    }
}
exports.ReaderResponse = ReaderResponse;
