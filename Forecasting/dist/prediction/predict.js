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
exports.Predictor = void 0;
class Predictor {
    constructor(distBetweenPoint, arima, writer) {
        this.previousValues = [];
        this.distBetweenPoint = distBetweenPoint;
        this.arima = arima;
        this.writer = writer;
        this.measure = "";
    }
    pushReadValues(response) {
        this.previousValues.push(response.value);
        this.measure = response.measurement + "Prevision";
    }
    writePrevision() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.previousValues.length == 0) {
                console.log("Can't find values");
            }
            else {
                var prediction = yield this.arima.makePrediction(this.previousValues);
                var timePrev = Date.now() + this.distBetweenPoint;
                var nextPrediction = Math.round(prediction[0] * 100) / 100;
                this.writer.writePoint(new Date(timePrev), this.measure, nextPrediction);
                console.log("With this history " + this.previousValues + "\nArima predicts: " + nextPrediction);
            }
        });
    }
}
exports.Predictor = Predictor;
