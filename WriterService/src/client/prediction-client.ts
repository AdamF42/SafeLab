import HttpClient  from './http-client';
import { Prediction } from '../model/Prediction';

export class PredictionClient extends HttpClient {
  
  public constructor(url:string) {
    super(url);
  }

  public getPrediction = async () => this.instance.get<Prediction>('/predict');

}