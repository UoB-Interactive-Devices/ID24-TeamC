#include <Servo.h>

// constants won't change. They're used here to set pin numbers:
Servo myservo;  
const int buttonPin = 2;  // the number of the pushbutton pin

// variables will change:
int pos = 0;
int buttonState = 0;

void setup() {
  myservo.attach(10);
  pinMode(buttonPin, INPUT);
}

void loop() {
  // read the state of the pushbutton value:
  buttonState = digitalRead(buttonPin);

  // check if the pushbutton is pressed. If it is, the buttonState is HIGH:
  if (buttonState == HIGH) {
    // turn LED on:
    if (pos <= 0){
      sweep1();
      Serial.print(pos);
    }
    else if (pos >= 90){
      sweep2();
      Serial.print(pos);
    }
  }
}

void sweep1(){
  for (pos = 0; pos <= 90; pos += 1) { // goes from 0 degrees to 90 degrees
    myservo.write(pos);  
    delay(20);
  }
}

void sweep2(){
  for (pos = 90; pos >= 0; pos -= 1) { 
    myservo.write(pos);  
    delay(20);
  }
}
