# Create environment for InfluxDB 2.0

Use the command `tsc` to compile all TypeScript files.

To create an environment you have to get
- Your token for influxDB
- The address of influxDB (followd by "/api/v2", example "http://localhost:9999/api/v2")

Run the following command to check if the name for organization, user, bucket and alert are not already in use

``` node ./dist/testExistence.js influx-token influx-address org-name user-name bucket-name auth-name```


If all names are not in use, you can proceed with the creation of an environment

```node ./dist/createEnv.js influx-token influx-address org-name user-name bucket-name expire-time auth-name ```

This will return you the id for organization, user, bucket and authorization for your environment



# Create alert for InfluxDB 2.0

Use the command `tsc` to compile all TypeScript files.

To create an environment you have to get
- Your token for influxDB
- The address of influxDB (followd by "/api/v2", example "http://localhost:9999/api/v2")
- Organizatio ID
- User ID
- Bucket Name

Run the following line:

```node ./dist/createAlert.js influx-token influx-address org-id user-id bucket-name alert-name alert-description time-interval start-query measurement time-aggregate critical-limit type-threshold device```

Example:

```node ./dist/createAlert.js influx-token http://localhost:9999/api/v2 org-id user-id iot-demo tempAlert monitor-temperature 1m 1m temperature 10s 32 grater RoomWeather```



