
#define timeSeconds 500

const int IR1 = 12;
const int IR2 = 14;

int T1;
int T2;

int S;

// Timer: Auxiliary variables
unsigned long now = millis();
unsigned long lastTrigger = 0;
boolean startTimer = false;

void setup() {
  Serial.begin(115200);
  Serial.println("Starting...");
  pinMode(IR1, INPUT_PULLUP);
  pinMode(IR2, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(IR1),ISR1,RISING);
  attachInterrupt(digitalPinToInterrupt(IR2),ISR2,RISING);
  Serial.println("Starting...");
}

ICACHE_RAM_ATTR void ISR1() {
  T1 = millis(); 
  if (T2 == 0) {
    startTimer = true;
  }
  lastTrigger = millis();
}


ICACHE_RAM_ATTR void ISR2() {
  T2 = millis();
  if (T1 == 0) {
    startTimer = true;
  }  lastTrigger = millis();
}


boolean firstEventEnter = 0;
boolean firstEventExit = 0;
int peopleCounter = 0;

void loop() 
{
  if(T1 > T2 && T1 != 0 && T2 != 0 && firstEventEnter == 0) {
    peopleCounter ++;
    Serial.print("Entrance - ");
    Serial.println(peopleCounter);
    firstEventEnter = 1;
    firstEventExit = 0;
  }
  else if (T2 > T1 && T1 != 0 && T2 != 0 && firstEventExit == 0) {
    peopleCounter --;
    Serial.print("Exit - ");
    Serial.println(peopleCounter);
    firstEventEnter = 0;
    firstEventExit = 1;
  }

  //Serial.println(peopleCounter);
  now = millis();
  if(startTimer && (now - lastTrigger > (timeSeconds))) {
    T1 = 0;
    T2 = 0;
    firstEventEnter = 0;
    firstEventExit = 0;
    startTimer = false;
  }

  
}
