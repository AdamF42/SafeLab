#define LARGE_JSON_BUFFERS 1
#define ARDUINOJSON_USE_LONG_LONG 1

#include <Arduino.h>
#include "Thing.h"
#include "WebThingAdapter.h"
#define timeSeconds 500

// Variables 
const int Receiver1 = 12;
const int Receiver2 = 14;
int T1;
int T2;
boolean firstEventEnter = 0;
boolean firstEventExit = 0;
int peopleCounter = 0;
int maxCapacity = 0;

// Timer: Auxiliary variables
unsigned long now = millis();
unsigned long lastTrigger = 0;
boolean startTimer = false;

// Variables for web thing
WebThingAdapter* adapter;
const char* sensorTypes[] = {"MotionSensor", nullptr};
ThingDevice peopleDevice("peopleInside", "People Counter Sensors", sensorTypes);
ThingProperty peopleProp("peopleNum", "", INTEGER, nullptr);
ThingProperty maxPeople("maxPeople", "", INTEGER, nullptr);
ThingEvent maxPeopleReached("maxPeopleReached", "Reached the maximum capacity of the room", INTEGER, "AlarmEvent");

// Wifi
const char* ssid = "--------";
const char* password = "---------";



ICACHE_RAM_ATTR void funReceiver1() {
  T1 = millis(); 
  if (T2 == 0) {
    startTimer = true;
  }
  lastTrigger = millis();
}


ICACHE_RAM_ATTR void funReceiver2() {
  T2 = millis();
  if (T1 == 0) {
    startTimer = true;
  }  lastTrigger = millis();
}

void handlePassage() {
  if(T1 > T2 && firstEventEnter == 0) {
    peopleCounter ++;
    Serial.println(peopleCounter);
    firstEventEnter = 1;
    firstEventExit = 0;
    if (peopleCounter > maxCapacity) {
        Serial.println("MAXIMUM REACHED");
        ThingPropertyValue val;
        val.integer = peopleCounter;
        ThingEventObject *ev = new ThingEventObject("maxPeopleReached", INTEGER, val);
        peopleDevice.queueEventObject(ev);    
    }
  }
  else if (T2 > T1 && firstEventExit == 0) {
    if (peopleCounter > 0) {
      peopleCounter --;      
    }
    Serial.println(peopleCounter);
    firstEventEnter = 0;
    firstEventExit = 1;
  }

}

void handleTimeout() {
    T1 = 0;
    T2 = 0;
    firstEventEnter = 0;
    firstEventExit = 0;
    startTimer = false;
}

void setMaxPeople() {
    ThingPropertyValue maxP;
    maxP = maxPeople.getValue();
    maxCapacity = maxP.integer;
}

void setup() {
  Serial.begin(115200);
  Serial.println("Starting...");
  pinMode(Receiver1, INPUT_PULLUP);
  pinMode(Receiver2, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(Receiver1),funReceiver1,RISING);
  attachInterrupt(digitalPinToInterrupt(Receiver2),funReceiver2,RISING);
  Serial.println("Starting...");

  // Connect to WiFi access point
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while ( WiFi.status() != WL_CONNECTED ) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  adapter = new WebThingAdapter("w25", WiFi.localIP());

  peopleDevice.description = "Counter for people in a room";
  peopleProp.title = "PeopleCounter";
  peopleProp.minimum = 0;
  peopleProp.readOnly = true;
  maxPeople.minimum = 0;
  maxPeople.readOnly = false;
  maxPeople.title = "MaxCapacity";
  peopleDevice.addProperty(&peopleProp);
  peopleDevice.addProperty(&maxPeople);
  peopleDevice.addEvent(&maxPeopleReached);
  adapter -> addDevice(&peopleDevice);
  adapter -> begin();

  Serial.println("HTTP server started");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.print("/things/");
  Serial.println(peopleDevice.id);

  setMaxPeople();
}

void loop() {
  
  if (T1 != 0 && T2 != 0){
    setMaxPeople();
    handlePassage();
    ThingPropertyValue tpVal;
    tpVal.integer = peopleCounter;
    peopleProp.setValue(tpVal);
  }
  
  now = millis();
  if(startTimer && (now - lastTrigger > (timeSeconds))) {
    handleTimeout();
  }
  
  adapter -> update();
}
