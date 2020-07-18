import os

import numpy as np
import pandas as pd
import tensorflow as tf
from flask import Flask, Response
from influxdb_client import InfluxDBClient

app = Flask(__name__)

# Auth parameters
my_token = os.environ['INFLUX_TOKEN']
my_org = os.environ['INFLUX_ORG']
bucket = os.environ['INFLUX_BUCKET']
influx_url = os.environ['INFLUX_URL']

client = InfluxDBClient(url=influx_url, token=my_token, org=my_org, debug=False)

print(os.environ)


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
    dataset = df.values
    data_mean = dataset.mean(axis=0)
    data_std = dataset.std(axis=0)
    dataset = (dataset - data_mean) / data_std
    prediction_input = multivariate_data(dataset, 3)
    return tf.data.Dataset.from_tensor_slices(prediction_input).batch(1), data_mean, data_std


os.chdir(os.path.dirname(os.path.realpath(__file__)))

if (os.path.exists('./model')):
    multi_step_model = tf.keras.models.load_model('model')


@app.route('/predict', methods=['GET'])
def predict():
    data = []
    features = ["pressure", "temperature", "humidity"]
    for f in features:
        data.append(client.query_api().query_data_frame(org=my_org,
                                                        query=Query.get_query(bucket, f, "1d", "5m", "RoomWeather")))

    df = get_dataframe(data[0], data[1], data[2])

    (to_be_predicted, data_mean, data_std) = normalize_dataframe(df)

    # Make prediction using model loaded from disk as per the data.
    prediction = multi_step_model.predict(to_be_predicted)
    prediction = (data_std[1] * prediction) + data_mean[1]
    end_date = df.index[len(df) - 1] + pd.to_timedelta(300, unit='S')
    dti = pd.date_range(end_date, periods=24, freq='300S')
    rdf = pd.DataFrame(dti.values, columns=['time'])
    rdf['temperature'] = prediction[0]
    rdf['humidity'] = prediction[0]
    rdf['pressure'] = prediction[0]
    rdf['people'] = prediction[0]
    rdf = rdf.set_index('time')
    return Response(rdf.to_json(), mimetype='application/json')


if __name__ == '__main__':
    app.run(port=5000, debug=True)
