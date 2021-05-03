#include <Arduino_FreeRTOS.h>
#include <semphr.h>

#include <SoftwareSerial.h>
#include <Servo.h>
SoftwareSerial HM10(10, 11);  //[RX, TX]

Servo myServo;
char msg;
SemaphoreHandle_t xBinarySemaphore;


void setup()
{
  
    Serial.begin(9600);
    HM10.begin(9600);
    xBinarySemaphore = xSemaphoreCreateBinary();
    
    xTaskCreate(TaskReadHM10, // Task function
              "ReadHM10", // Task name
              128, // Stack size 
              NULL, 
              0 ,// Priority
              NULL );
   xTaskCreate(TaskAction, // Task function
              "Action", // Task name
              128, // Stack size 
              NULL, 
              0, // Priority
              NULL );
  
  vTaskStartScheduler();

    
}
void loop(){
}


void TaskReadHM10(void *pvParameters){
  (void) pvParameters;
   while(1){
    if (HM10.available()) {
      msg = HM10.read();
      xSemaphoreGive(xBinarySemaphore);
    }
  }
}




void TaskAction(void *pvParameters){
  (void) pvParameters;
   myServo.attach(3);
   pinMode(8, OUTPUT);
   pinMode(9, OUTPUT);
   while(1){
    if (xSemaphoreTake(xBinarySemaphore, portMAX_DELAY)){
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
      else if(msg == '4'){
        tone(9, 100,8000);
      }
      else if(msg == '5'){
        noTone(9);
      }
    }
  }
}
