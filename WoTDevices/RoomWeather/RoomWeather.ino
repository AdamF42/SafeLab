#define LARGE_JSON_BUFFERS 1
#define ARDUINOJSON_USE_LONG_LONG 1

#include <Arduino.h>
#include <Thing.h>
#include <WebThingAdapter.h>
#include <DHT.h>
#include <SFE_BMP180.h>
#include <Wire.h>

const char* ssid = "NETGEAR20";
const char* password = "dynamicflower339";

// DHT Sensor
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
#define DHTPIN D5     // Digital pin connected to the DHT sensor
#define ALTITUDE 54.0 // Altitude in meters

SFE_BMP180 pressure;
DHT dht(DHTPIN, DHTTYPE);

float tempValue;
float humValue;
int pressValue;
char status;
double T,P;

int samplingPeriod = 2000;

WebThingAdapter *adapter;

const char *sensorType[] = {"TemperatureSensor","MultiLevelSensor", nullptr};
ThingDevice device("room-weather", "RoomWeather", sensorType);

// PROPERTIES
ThingProperty temperature("temperature", "", NUMBER, "TemperatureProperty");
ThingProperty humidity("humidity", "", NUMBER, "LevelProperty");
ThingProperty pressureProp("pressure", "", INTEGER, "");

ThingEvent newTempValue("newTempValue",
                      "A new temperature value is produced",
                      NUMBER, "newTempValueEvent");
ThingEvent newHumValue("newHumValue",
                      "A new humidity value is produced",
                      NUMBER, "newHumValueEvent");
ThingEvent newPressValue("newPressValue",
                      "A new pressure value is produced",
                      NUMBER, "newPressValueEvent");

void setup(void) {
  dht.begin();
  pressure.begin();
  Serial.begin(115200);
  Serial.println("");
  Serial.print("Connecting to \"");
  Serial.print(ssid);
  Serial.println("\"");
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  adapter = new WebThingAdapter("room-weather", WiFi.localIP());

  device.description = "Multisensor";

  temperature.title = "Temperature";
  temperature.unit = "degree celsius";
  temperature.readOnly = true;
  device.addProperty(&temperature);

  humidity.title = "Humidity";
  humidity.minimum = 0;
  humidity.maximum = 100;
  humidity.unit = "percent";
  humidity.readOnly = true;
  device.addProperty(&humidity);

  pressureProp.title = "Atmospheric Pressure";
  pressureProp.unit = "hPa";
  pressureProp.readOnly = true;
  device.addProperty(&pressureProp);

  newTempValue.unit = "degree celsius";
  device.addEvent(&newTempValue);

  newHumValue.unit = "percent";
  device.addEvent(&newHumValue);

  newPressValue.unit = "hPa"
  device.addEvent(&newPressValue);

  adapter->addDevice(&device);
  adapter->begin();

  Serial.println("HTTP server started");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.print("/things/");
  Serial.println(device.id);
}


void loop(void) {
  getValues();
  adapter->update();

  ThingPropertyValue temperatureValue;
  temperatureValue.number = tempValue;
  temperature.setValue(temperatureValue);
  
  ThingPropertyValue humidityValue;
  humidityValue.number = humValue;
  humidity.setValue(humidityValue);

  ThingPropertyValue pressureValue;
  pressureValue.number = pressValue;
  pressureProp.setValue(pressureValue);

  if ( tempValue != temperature.getValue().number ) {
    ThingDataValue val;
    val.number = tempValue;
    ThingEventObject *ev = new ThingEventObject("newTempValue", NUMBER, val);
    device.queueEventObject(ev);
  }

  if ( humValue != humidity.getValue().number ) {
    ThingDataValue val;
    val.number = humValue;
    ThingEventObject *ev = new ThingEventObject("newHumValue", NUMBER, val);
    device.queueEventObject(ev);
  }

  if ( pressValue != pressureProp.getValue().number ) {
    ThingDataValue val;
    val.number = pressValue;
    ThingEventObject *ev = new ThingEventObject("newPressValue", INTEGER, val);
    device.queueEventObject(ev);
  }

}


void getValues(){
  int counter = 0;
  humValue = dht.readHumidity();
  while (isnan(humValue))) {
      humValue = dht.readHumidity();
      delay(samplingPeriod);
  }      

  status = pressure.startTemperature();
  if (status != 0)
  {
    // Wait for the measurement to complete:
    delay(status);
    tempValue = status = pressure.getTemperature(T);
    if (status != 0)
    {
      status = pressure.startPressure(3);
      if (status != 0)
      {
        // Wait for the measurement to complete:
        delay(status);
        status = pressure.getPressure(P,T);
        if (status != 0)
        {
          pressValue = pressure.sealevel(P,ALTITUDE); // we're at 54 meters (Bologna, Bo)
        }
        else Serial.println("error retrieving pressure measurement\n");
      }
      else Serial.println("error starting pressure measurement\n");
    }
    else Serial.println("error retrieving temperature measurement\n");
  }
  else Serial.println("error starting temperature measurement\n");

  Serial.print("[LOG] Read the humidity value ... ");
  Serial.println(humValue);
  Serial.print("[LOG] Read the temperature value ... ");
  Serial.println(tempValue);
  Serial.print("[LOG] Read the pressure value ... ");
  Serial.println(pressValue);
}