import { TimeSeriesForecaster } from "./predictors/time-series-forecasters";
import { WriterToInflux } from "../writer/writer";
import { ReaderResponse } from "../response";


export class Predictor {

    private previousValues: Array<number>;
    private predictor: TimeSeriesForecaster;
    private writer: WriterToInflux;
    private distBetweenPoint: number;
    private measure: string;

    constructor(distBetweenPoint: number, predictor: TimeSeriesForecaster, writer: WriterToInflux) {
        this.previousValues = [];
        this.distBetweenPoint = distBetweenPoint;
        this.predictor = predictor;
        this.writer = writer;
        this.measure = "";
    }

    pushReadValues(response: ReaderResponse){
        this.previousValues.push(response._value);
        this.measure = response._measurement + "Prevision";
    }

    async writePrevision(){
        if (this.previousValues.length == 0){
            console.log("Can't find values")
        } else {
            console.log("Prediction");
            var prediction = await this.predictor.makePrediction(this.previousValues);

            var timePrev = Date.now() + this.distBetweenPoint;
            var nextPrediction =  Math.round(prediction[0] * 100) / 100;
            this.writer.writePoint(new Date(timePrev), this.measure , nextPrediction);
            console.log("With this history "+this.previousValues+"\npredictor predicts: "+ nextPrediction);
        }
    }

}