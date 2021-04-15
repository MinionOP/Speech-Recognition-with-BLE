#include <SoftwareSerial.h>



SoftwareSerial HM10(10, 11);  //[RX, TX]


char msg;


void setup()
{
    Serial.begin(9600);
    //testAllBaudRates();
    pinMode(8, OUTPUT);
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
    }
    if (Serial.available()) {
        HM10.write(Serial.read());       
    }
}
