#include <SoftwareSerial.h>
#include <Servo.h>
SoftwareSerial HM10(10, 11);  //[RX, TX]

Servo myServo;
char msg;


void setup()
{
    Serial.begin(9600);
    myServo.attach(3);
    pinMode(8, OUTPUT);
    pinMode(9, OUTPUT);
    HM10.begin(9600);
}

void loop(){
    if (HM10.available()) {
      msg = HM10.read();
      Serial.write(msg);
      if(msg == '1'){
        digitalWrite(8,HIGH);
      }
      else if(msg == '0'){
        digitalWrite(8,LOW);
      }
      else if(msg == '2'){
        myServo.write(180);
      }
      else if(msg == '3'){
        myServo.write(0);
      }
    }
    if (Serial.available()) {
        HM10.write(Serial.read());       
    }
}
