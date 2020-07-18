import HttpClient  from './http-client';
import { Prediction } from '../model/Prediction';

export class PredictionClient extends HttpClient {
  
  public constructor(url:string) {
    super(url);
  }

  public getPrediction = () => this.instance.get<Prediction>('/predict');
                                            //.then(response => console.log(response));

}