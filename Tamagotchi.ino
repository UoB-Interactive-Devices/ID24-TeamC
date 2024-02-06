#include <Servo.h>

// constants won't change. They're used here to set pin numbers:
// twelve servo objects can be created on most boards
const int buttonPin = 2;  // the number of the pushbutton pin
const int green = 12;    // the number of the LED pin
const int red = 8;
const int blue = 13;
const int yellow = A0;
Servo myservo;  // create servo object to control a servo

// variables will change:
int buttonState = 0;  // variable for reading the pushbutton status
double happy = 100;
int pos = 0;

void setup() {
  // initialize the LED pin as an output:
  pinMode(green, OUTPUT);
  pinMode(red, OUTPUT);
  pinMode(blue, OUTPUT);
  pinMode(yellow, OUTPUT);
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT);
  myservo.attach(10);  // attaches the servo on pin 9 to the servo object
  Serial.begin(9600);
}

void loop() {
  // read the state of the pushbutton value:
  buttonState = digitalRead(buttonPin);

  //feeding button
  if (buttonState == HIGH && happy > -10) {
    digitalWrite(blue, HIGH); //blue light turns on when button is pressed
    delay(100);
    happy += 2; //add 5 points to happiness ever time button is pressed
    Serial.println(int(happy));
  }
  else if (buttonState == HIGH && happy <= -10) { // if the pet is dead and the button is pressed 
    digitalWrite(blue, LOW);
    digitalWrite(yellow, HIGH);
    happy = 10; //reset happiness to 10
    Serial.println(int(happy));
  }
  else {
    digitalWrite(blue, LOW);
    digitalWrite(yellow, LOW);
    delay(100);
    happy -= 0.1; // happiness decrease by 1 every second
    Serial.println(int(happy));
  }

  //pet is happy and full
  if (happy > 20) {
    //Green (happy) light remains on
    digitalWrite(green, HIGH);
    //Red light is off
    digitalWrite(red, LOW);
    sweep();
  }
  //pet starts getting hungry and unhappy
  else if (happy <= 20 && happy > 0) {
    //Green (happy) light blinks
    digitalWrite(green, HIGH);
    delay(250);
    digitalWrite(green, LOW);
    delay(250);

    //Red light is off
    digitalWrite(red, LOW);
  }
  //pet is hungry and unhappy
  else if (happy <= 0 && happy > -10) {
    //Green (happy) light turns off
    digitalWrite(green, LOW);
    //Red light turns on
    digitalWrite(red, HIGH);
    delay(250);
    digitalWrite(red, LOW);
    delay(250);
  } 
  //pet is dead
  else if (happy <= -10) {
    digitalWrite(red, HIGH);
  }
}

void sweep() {
  for (pos = 0; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
    // in steps of 1 degree
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(5);                       // waits 15ms for the servo to reach the position
  }
  for (pos = 180; pos >= 0; pos -= 1) { // goes from 180 degrees to 0 degrees
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(5);                       // waits 15ms for the servo to reach the position
  }
}

