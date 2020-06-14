#define timeSeconds 5se00


int ir1 = 2;
int ir2 = 3;

int T1;
int T2;

int S;


// Timer: Auxiliary variables
unsigned long now = millis();
unsigned long lastTrigger = 0;
boolean startTimer = false;



void setup() {
  Serial.begin(115200);
  attachInterrupt(digitalPinToInterrupt(ir1),ISR1,RISING);
  attachInterrupt(digitalPinToInterrupt(ir2),ISR2,RISING);
}

void ISR1()
{
  T1 = millis(); 
  Serial.print("1 DETECTED!!!");
  Serial.println(T1);
  if (T2 == 0) {
    startTimer = true;
  }
  lastTrigger = millis();
}

void ISR2()
{
  T2 = millis();
  Serial.print("2 DETECTED!!!");
  Serial.println(T2);
  if (T1 == 0) {
    startTimer = true;
  }  lastTrigger = millis();
}


void loop() 
{
  
 
  if(T1 > T2 && T1 != 0 && T2 != 0) 
  {
     Serial.println("ENTER");
  }
  else if (T2 > T1 && T1 != 0 && T2 != 0) 
  {
    Serial.println("EXIT");
  }

  now = millis();
  if(startTimer && (now - lastTrigger > (timeSeconds))) {
    Serial.println("Motion stopped...");
    T1 = 0;
    T2 = 0;
    startTimer = false;
  }

  
}