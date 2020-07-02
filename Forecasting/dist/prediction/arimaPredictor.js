"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arima = void 0;
const arima = require('arima');
class Arima {
    constructor(pointToForecast, pArima, dArima, qArima) {
        this.pointToForecast = pointToForecast;
        this.pArima = pArima;
        this.dArima = dArima;
        this.qArima = qArima;
    }
    makePrediction(timeSeries) {
        return __awaiter(this, void 0, void 0, function* () {
            if (timeSeries.length == 0) {
                console.log("No values to do prediction");
                return Promise.resolve([]);
            }
            else {
                const [pred, err] = arima(timeSeries, this.pointToForecast, {
                    method: 0,
                    optimizer: 6,
                    p: this.pArima,
                    q: this.qArima,
                    d: this.dArima,
                    verbose: false
                });
                return Promise.resolve(pred);
            }
        });
    }
}
exports.Arima = Arima;
