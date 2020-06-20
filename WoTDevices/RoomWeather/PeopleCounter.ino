#define LARGE_JSON_BUFFERS 1
#define ARDUINOJSON_USE_LONG_LONG 1

#include <Arduino.h>
#include "Thing.h"
#include "WebThingAdapter.h"
#define timeSeconds 500

// Variables 
const int Receiver1 = 12;
const int Receiver2 = 14;
const int ReceiverCenter = A0;
const int THRESHOLD = 200;
int TDown1;   //Time laser 1 is obscured
int TUp1;     //Time laser 1 return visible
int TDown2;   //Time laser 2 is obscures
int TUp2;     //Time laser 2 return visible
boolean firstEventEnter = 0;
boolean firstEventExit = 0;
int peopleCounter = 0;

// Timer: Auxiliary variables
unsigned long now = millis();
unsigned long lastTrigger = 0;
boolean startTimer = false;

// Variables for web thing
WebThingAdapter* adapter;
const char* sensorTypes[] = {"MotionSensor", nullptr};
ThingDevice peopleDevice("peopleInside", "People Counter Sensors", sensorTypes);
ThingProperty peopleProp("peopleNum", "", INTEGER, nullptr);
ThingEvent changeNumPeople("changeNumPeople", "A new person entered in/exited from the room", INTEGER, "AlarmEvent");

// Wifi
const char* ssid = "NETGEAR20";
const char* password = "dynamicflower339";


ICACHE_RAM_ATTR void funReceiver1() {
  int timer = millis();
  if (TDown1 == 0) {
    TDown1 = timer;
  } else if (timer != TDown1){
    TUp1 = timer;
  }
  if (TDown2 == 0) {
    startTimer = true;
  }
  lastTrigger = millis();
}


ICACHE_RAM_ATTR void funReceiver2() {
  int timer = millis();
  if (TDown2 == 0) {
    TDown2 = timer;
  } else if (timer != TDown2){
    TUp2 = timer;
  }
  if (TDown1 == 0) {
    startTimer = true;
  }  
  lastTrigger = millis();
}

void newEvent() {
  ThingPropertyValue val;
  val.integer = peopleCounter;
  peopleProp.setValue(val);
  ThingEventObject *ev = new ThingEventObject("changeNumPeople", INTEGER, val);
  peopleDevice.queueEventObject(ev);    
}

void handlePassage() {
  if(TUp1 > TUp2 && TDown1 > TDown2 && firstEventEnter == 0) {
    peopleCounter ++;
    Serial.println(peopleCounter);
    newEvent();
    firstEventEnter = 1;
    firstEventExit = 0;
  }
  else if (TUp2 > TUp1 && TDown2 > TDown1 && firstEventExit == 0) {
    if (peopleCounter > 0) {
      peopleCounter --;      
    }
    Serial.println(peopleCounter);
    newEvent();
    firstEventExit = 1;
    firstEventEnter = 0;
  }

}


void resetVars() {
    TDown1 = 0; TUp1 = 0;
    TDown2 = 0; TUp2 = 0;
    firstEventEnter = 0;
    firstEventExit = 0;
    startTimer = false;
}


void setup() {
  Serial.begin(115200);
  Serial.println("Starting...");
  pinMode(ReceiverCenter, INPUT);
  pinMode(Receiver1, INPUT_PULLUP);
  pinMode(Receiver2, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(Receiver1),funReceiver1,CHANGE);
  attachInterrupt(digitalPinToInterrupt(Receiver2),funReceiver2,CHANGE);
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
  peopleDevice.addProperty(&peopleProp);
  peopleDevice.addEvent(&changeNumPeople);
  adapter -> addDevice(&peopleDevice);
  adapter -> begin();

  Serial.println("HTTP server started");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.print("/things/");
  Serial.println(peopleDevice.id);

}


void loop() {
  //Serial.println(analogRead(ReceiverCenter));
  if (TUp1 != 0 && TUp2 != 0){
    handlePassage();
  }
  
  now = millis();
  if(startTimer && (now - lastTrigger > (timeSeconds)) && !((TDown1 != 0)&&(TDown2 != 0) && (TUp1 == 0) && (TUp2 == 0))){
    resetVars();
  }
  
  adapter -> update();
}

//TESTARE
// - entrata/uscita
// - prendere un solo led e poi tornare indietro
// - prendere i due led e poi tornare indietro
// - prendere i due led contemporaneamente e poi tornare indietro
// - non vada sotto zero
