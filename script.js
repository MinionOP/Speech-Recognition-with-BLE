/*------------------------------------------------------
Voice Recognition BLE
ECE 5436
Team 4
-------------------------------------------------------*/
//---------------------------SpeechRecognition---------------------------


var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var grammer = '#JSGF V1.0;';

var recognition = new SpeechRecognition();
var SpeechRecognitionGrammerList = new SpeechGrammarList();
SpeechRecognitionGrammerList.addFromString(grammer,1);
recognition.grammars = SpeechRecognitionGrammerList;
recognition.lang = 'en-US';
recognition.interimResults = false;


recognition.onresult = function(event){
    console.log(event);
    var message = event.results[0][0].transcript;
    document.getElementById('paragraphText').innerHTML = message;

    if(characteristicCache){
        if(message.toLowerCase() === 'light on' || message.toLowerCase() === 'turn the light on'|| message.toLowerCase() === 'turn on light'|| message.toLowerCase() === 'turn on the light'|| message.toLowerCase() === 'turn on the lights'|| message.toLowerCase() === 'turn light on'){
            characteristicCache.writeValue(new TextEncoder().encode('1'));   
        }
        else if(message.toLowerCase() === 'light off'|| message.toLowerCase() === 'turn the light off'|| message.toLowerCase() === 'turn off light'  || message.toLowerCase() === 'turn off the light' || message.toLowerCase() === 'turn off the lights' || message.toLowerCase() === 'turn the light off'){
            characteristicCache.writeValue(new TextEncoder().encode('0'));   
        }
        else if(message.toLowerCase() === 'open garage' || message.toLowerCase() === 'open the garage'){
            characteristicCache.writeValue(new TextEncoder().encode('2'));   
        }
        else if(message.toLowerCase() === 'close garage'|| message.toLowerCase() === 'close the garage'){
            characteristicCache.writeValue(new TextEncoder().encode('3'));   
        }
        else if(message.toLowerCase() === 'alarm on' || message.toLowerCase() === 'turn alarm on' || message.toLowerCase() === 'turn the alarm on'|| message.toLowerCase() === 'turn on the alarm'){
            characteristicCache.writeValue(new TextEncoder().encode('4'));   
        }
        else if(message.toLowerCase() === 'alarm off' || message.toLowerCase() === 'turn alarm off' || message.toLowerCase() === 'turn the alarm off'|| message.toLowerCase() === 'turn off the alarm'){
            characteristicCache.writeValue(new TextEncoder().encode('5'));   
        }
    }
    else{
        console.log('No characteristic');
    }
};


recognition.onspeechend = function(){
    document.getElementById('recording').style.display = "none";
    document.getElementById('button1').style.display = "block";
    recognition.stop();
};

recognition.onerror = function(event){
    document.getElementById('recording').style.display = "none";
    document.getElementById('button1').style.display = "block";
    document.getElementById('paragraphText').innerHTML = 'Error occurred in recognition: ' + event.error;
}

document.querySelector('#button1').addEventListener('click', function(){
    document.getElementById('button1').style.display = "none";
    document.getElementById('recording').style.display = "block";
    recognition.start();
});


//---------------------------Bluetooth---------------------------
let characteristicCache = null;
let deviceCache = null;

function connectDevice(){
    navigator.bluetooth.requestDevice({
        filters:
        [
            {services: [0xFFE0]}
        ]
    })
    .then(device =>{
        console.log('Name: ' +device.name);
        deviceCache = device;
        return device.gatt.connect();
    })
    .then(server =>{
        console.log('Getting GATT Service...')
        return server.getPrimaryService(0xFFE0);
    })
    .then(service =>{
        console.log('Getting GATT Characteristic...')
        return service.getCharacteristic(0xFFE1);
    })
    .then(characteristic =>{
        console.log('Found characteristic');
        characteristicCache  = characteristic;
        document.getElementById('connecting').style.display = "none";
        document.getElementById('disconnect').style.display = "block";
    })
    .catch(error =>{
        console.log('Request device error: ' + error);
        document.getElementById('connect').style.display = "block";
        document.getElementById('connecting').style.display = "none";
    })
    
}

document.querySelector('#connect').addEventListener('click', function(event){
    if(navigator.bluetooth){
        console.log('Web Bluetooth is available');
        document.getElementById('connect').style.display = "none";
        document.getElementById('connecting').style.display = "block";
        connectDevice();
    }
    else{
        console.log('Web Bluetooth is available');
    }
});

document.querySelector('#disconnect').addEventListener('click', function(event){
    if(deviceCache){
        if(deviceCache.gatt.connected){
            deviceCache.gatt.disconnect();
            console.log(deviceCache.name + ' disconnected');
        }
        else{
            console.log(deviceCache.name +' is already disconnected');
        }
    }
    characteristicCache = null;
    deviceCache = null;
    document.getElementById('disconnect').style.display = "none";
    document.getElementById('connect').style.display = "block";
});



