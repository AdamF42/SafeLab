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
          |> toFloat()
          |> aggregateWindow(every: %s, fn: median)
          ''' % (bucket, days, measurement, device, window)


def get_dataframe(df_press, df_temp, df_hum, df_people):
    df = pd.DataFrame(df_temp['_time']).rename(columns={'_time': 'time'})
    df['pressure'] = df_press['_value']
    df['temperature'] = df_temp['_value']
    df['humidity'] = df_hum['_value']
    df['people'] = df_people['_value']
    df = df.set_index('time')
    df = df.asfreq(freq='300S')
    df['temperature'] = df['temperature'].fillna(method='backfill').fillna(method='ffill')
    df['humidity'] = df['humidity'].fillna(method='backfill').fillna(method='ffill')
    df['pressure'] = df['pressure'].fillna(method='backfill').fillna(method='ffill')
    df['people'] = df['people'].fillna(method='backfill').fillna(method='ffill')
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


def predict_people(df):
    df = df.drop(columns=['temperature', 'pressure', 'humidity'])
    prediction_input = multivariate_data(df.values, 3)
    to_be_predicted = tf.data.Dataset.from_tensor_slices(prediction_input).batch(1)
    prediction = people_model.predict(to_be_predicted)
    return prediction


def predict_room(df):
    df = df.drop(columns=['people'])
    (to_be_predicted, data_mean, data_std) = normalize_dataframe(df)
    prediction_temperature = temperature_model.predict(to_be_predicted)
    prediction_temperature = (data_std[1] * prediction_temperature) + data_mean[1]
    prediction_humidity = humidity_model.predict(to_be_predicted)
    prediction_humidity = (data_std[2] * prediction_humidity) + data_mean[2]
    prediction_pressure = pressure_model.predict(to_be_predicted)
    prediction_pressure = (data_std[0] * prediction_pressure) + data_mean[0]
    return prediction_temperature, prediction_humidity, prediction_pressure


os.chdir(os.path.dirname(os.path.realpath(__file__)))

if (os.path.exists('./model/people_model.h5')):
    people_model = tf.keras.models.load_model('./model/people_model.h5')

if (os.path.exists('./model/humidity_model.h5')):
    humidity_model = tf.keras.models.load_model('./model/humidity_model.h5')

if (os.path.exists('./model/pressure_model.h5')):
    pressure_model = tf.keras.models.load_model('./model/pressure_model.h5')

if (os.path.exists('./model/temperature_model.h5')):
    temperature_model = tf.keras.models.load_model('./model/temperature_model.h5')

@app.route('/predict', methods=['GET'])
def predict():

    data = []
    room_features = ["pressure", "temperature", "humidity"]
    for f in room_features:
        data.append(client.query_api().query_data_frame(org=my_org,
                                                        query=Query.get_query(bucket, f, "1d", "5m", "RoomWeather")))

    data.append(client.query_api().query_data_frame(org=my_org,
                                                    query=Query.get_query(bucket, "people", "1d", "5m", "peopleCounter")))
                

    df = get_dataframe(data[0], data[1], data[2], data[3])
    end_date = df.index[len(df) - 1] + pd.to_timedelta(300, unit='S')

    temperature_prediction, humidity_prediction, pressure_prediction = predict_room(df)
    people_prediction = predict_people(df)
    
    dti = pd.date_range(end_date, periods=24, freq='300S')
    rdf = pd.DataFrame(dti.values, columns=['time'])
    rdf['temperature'] = temperature_prediction[0]
    rdf['humidity'] = humidity_prediction[0]
    rdf['pressure'] = pressure_prediction[0]
    rdf['people'] = people_prediction[0].astype('int')
    rdf = rdf.set_index('time')
    return Response(rdf.to_json(), mimetype='application/json')


if __name__ == '__main__':
    app.run(port=5000, debug=True)
