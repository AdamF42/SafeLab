/** InfluxDB v2 URL */
const url = process.env['INFLUXDB_URL'] || 'http://192.168.1.100:9999'
/** InfluxDB authorization token */
const token = process.env['INFLUXDB_TOKEN'] || 'n7d9lmC2soRW7-PhxfYhrR1ZXqRQBcrQCKIil8gUa2UqaOmlJ04sgrURIZ2Cy6dBQuWSb1P1HUSgQlmwffWcfQ=='
/** Organization within InfluxDB URL  */
const org = process.env['INFLUXDB_ORG'] || 'iot-org'
/**InfluxDB bucket used in examples  */
const bucket = 'iot-demo'

const mqtt_url = process.env['MQTT_URL'] || 'mqtt://192.168.1.100:1883'

module.exports = {
  url,
  token,
  org,
  bucket,
  mqtt_url
}
