import pickle

import pandas as pd
from flask import Flask, request, Response, Blueprint

app = Flask(__name__)
app_blueprint = Blueprint(
    "forecasting_service", __name__)


@app_blueprint.route('/temperature', methods=['GET'])
def predict_temperature():
    with open('models/temperature.pkl', 'rb') as f:
        model_t = pickle.load(f)
    end_date, start_date = get_date_range()
    predictions = model_t.predict(start=start_date, end=end_date)
    return Response(predictions.to_json(), mimetype='application/json')


@app_blueprint.route('/humidity', methods=['GET'])
def predict_humidity():
    with open('models/humidity.pkl', 'rb') as f:
        model_h = pickle.load(f)
    end_date, start_date = get_date_range()
    predictions = model_h.predict(start=start_date, end=end_date)
    return Response(predictions.to_json(), mimetype='application/json')


@app_blueprint.route('/pressure', methods=['GET'])
def predict_pressure():
    with open('models/pressure.pkl', 'rb') as f:
        model_press = pickle.load(f)
    end_date, start_date = get_date_range()
    predictions = model_press.predict(start=start_date, end=end_date)
    return Response(predictions.to_json(), mimetype='application/json')


@app_blueprint.route('/peouple', methods=['GET'])
def predict_peouple():
    with open('models/peouple.pkl', 'rb') as f:
        model_peouple = pickle.load(f)
    end_date, start_date = get_date_range()
    predictions = model_peouple.predict(start=start_date, end=end_date)
    return Response(predictions.to_json(), mimetype='application/json')


def get_date_range():
    start_date = pd.Timestamp(request.args.get('start'), tz='Europe/Rome')
    end_date = pd.Timestamp(request.args.get('end'), tz='Europe/Rome')
    return end_date, start_date


app.register_blueprint(
    app_blueprint, url_prefix="/predict")

if __name__ == '__main__':
    app.run(port=5000, debug=False)
