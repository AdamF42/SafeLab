import { Arima } from "./arima/arimaPredictor";
import { WriterToInflux } from "./writer/writer";
import { ReaderResponse } from "./response";


export class Predictor {

    private previousValues: Array<number>;
    private arima: Arima;
    private writer: WriterToInflux;
    private distBetweenPoint: number;
    private measure: string;

    constructor(distBetweenPoint: number, arima: Arima, writer: WriterToInflux) {
        this.previousValues = [];
        this.distBetweenPoint = distBetweenPoint;
        this.arima = arima;
        this.writer = writer;
        this.measure = "";
    }

    pushReadValues(response: ReaderResponse){
        this.previousValues.push(response.value);
        this.measure = response.measurement + "Prevision";
    }

    async writePrevision(){
        if (this.previousValues.length == 0){
            console.log("Can't find values")
        } else {
            var prediction = await this.arima.makePrediction(this.previousValues);
            var timePrev = Date.now() + this.distBetweenPoint;
            var nextPrediction =  Math.round(prediction[0] * 100) / 100;
            this.writer.writePoint(new Date(timePrev), this.measure , nextPrediction);
            console.log("With this history "+this.previousValues+"\nArima predicts: "+ nextPrediction);
        }
    }

}