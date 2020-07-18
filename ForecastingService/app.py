import os

import numpy as np
import pandas as pd
from flask import Flask, request, Response
from pandas.plotting import register_matplotlib_converters

register_matplotlib_converters()

from influxdb_client import InfluxDBClient

import tensorflow as tf

app = Flask(__name__)
# Load the model
# model = load()

# Auth parameters
my_token = "yaKfFeAsha8tNAZxvYeZBMmq-khO8tz-6Ut_PARgohiWzeW2j8BB86ND33Qbq7hR8bylmOROPQAUr-7M103_Yw=="
my_org = "iot-org"
bucket = "iot-demo"
client = InfluxDBClient(url="http://192.168.1.100:9999", token=my_token, org=my_org, debug=False)


class Query:

    @staticmethod
    def get_query(bucket, measurement, days, window, device):
        return '''
        from(bucket: "%s")
          |> range(start: -%s, stop: now())
          |> filter(fn: (r) => r["_measurement"] == "%s")
          |> filter(fn: (r) => r["device"] == "%s")
          |> aggregateWindow(every: %s, fn: median)
          ''' % (bucket, days, measurement, device, window)


def get_dataframe(df_press, df_temp, df_hum):
    df = pd.DataFrame(df_temp['_time']).rename(columns={'_time': 'time'})
    df['pressure'] = df_press['_value']
    df['temperature'] = df_temp['_value']
    df['humidity'] = df_hum['_value']
    df = df.set_index('time')
    df = df.asfreq(freq='300S')
    df['temperature'] = df['temperature'].fillna(method='backfill').fillna(method='ffill')
    df['humidity'] = df['humidity'].fillna(method='backfill').fillna(method='ffill')
    df['pressure'] = df['pressure'].fillna(method='backfill').fillna(method='ffill')
    return df


def multivariate_data(dataset, step):
    data = []

    start_index = 0
    end_index = len(dataset)

    indices = range(start_index, end_index, step)
    data.append(dataset[indices])

    return np.array(data)


def normalize_dataframe(df):
    # features_considered = ['pressure', 'temperature', 'humidity']
    # features = df[features_considered]
    # features.index = df.index
    dataset = df.values
    data_mean = dataset.mean(axis=0)
    data_std = dataset.std(axis=0)
    dataset = (dataset - data_mean) / data_std
    prediction_input = multivariate_data(dataset, 3)
    return tf.data.Dataset.from_tensor_slices(prediction_input).batch(1), data_mean, data_std


os.chdir(os.path.dirname(os.path.realpath(__file__)))

if (os.path.exists('./24_step_model')):
    multi_step_model = tf.keras.models.load_model('24_step_model')


@app.route('/predict', methods=['GET'])
def predict():

    # Get the data from the POST request.
    # data = request.get_json(force=True)
    data = []
    features = ["pressure", "temperature", "humidity"]
    for f in features:
        data.append(client.query_api().query_data_frame(org=my_org,query=Query.get_query(bucket, f, "1d", "5m", "RoomWeather")))

    df = get_dataframe(data[0], data[1], data[2])

    (to_be_predicted, data_mean, data_std) = normalize_dataframe(df)

    # Make prediction using model loaded from disk as per the data.
    prediction = multi_step_model.predict(to_be_predicted)
    prediction = (data_std[1] * prediction) + data_mean[1]
    end_date = df.index[len(df) - 1] + pd.to_timedelta(300, unit='S')
    dti = pd.date_range(end_date, periods=24, freq='300S')
    rdf = pd.DataFrame(dti.values, columns=['time'])
    rdf['temperature'] = prediction[0]
    rdf = rdf.set_index('time')
    return Response(rdf.to_json(), mimetype='application/json')


if __name__ == '__main__':
    app.run(port=5000, debug=True)
