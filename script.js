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

    if(message.toLowerCase() === 'light on'){
        alert("Living room light is on");
    }
    else if(message.toLowerCase() === 'light off'){
        alert('Living room light is off');
    }
    else if(message.toLowerCase() === 'open garage'){
        alert('Opening garage');
    }
    else if(message.toLowerCase() === 'close garage'){
        alert('Closing garage');
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



//-----------------Bluetooth------------------------
let characteristicCache = null;
let deviceCache = null;

function connect(){
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
    })
    .catch(error =>{
        console.log('Request device error: ' + error);
    })
    
}


document.querySelector('#connectDevice').addEventListener('click', function(event){
    event.stopPropagation();
    event.preventDefault();

    if(navigator.bluetooth){
        console.log('Web Bluetooth is available');
        connect();
    }
    else{
        console.log('Web Bluetooth is available');
    }
});

document.querySelector('#disconnectDevice').addEventListener('click', function(event){
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
});

document.querySelector('#onTest').addEventListener('click', function(event){
    if(characteristicCache){
        characteristicCache.writeValue(new TextEncoder().encode('1'));   
    }
    else{
        console.log('No characteristic');
    }
});

document.querySelector('#offTest').addEventListener('click', function(event){
    if(characteristicCache){
        characteristicCache.writeValue(new TextEncoder().encode('0'));   
    }
    else{
        console.log('No characteristic');
    }
});
