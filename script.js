/*------------------------------------------------------
Voice Recognition BLE
ECE 5436
Team 4:Charles Nguyen, Monica Pena, Kevin Nguyen
/*------------------------------------------------------
Resoucres:
https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API
https://medium.com/samsung-internet-dev/promises-promises-c91d454aea11
https://web.dev/bluetooth/
https://webbluetoothcg.github.io/web-bluetooth/
-------------------------------------------------------*/
//---------------------------SpeechRecognition---------------------------

//Create the object. "webkitSpeechRecognition" is included for Android Chrome
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

//State the format and verison used
var grammer = '#JSGF V1.0;';

//Define a speech recogntion instance to control the recognition for our application
//Created using the SpeechRecognition() constructor
var recognition = new SpeechRecognition();
//Create a variable to hold the speech grammar list, using the SpeechGrammerList constructor
var SpeechRecognitionGrammerList = new SpeechGrammarList();
//Add the format
SpeechRecognitionGrammerList.addFromString(grammer,1);
recognition.grammars = SpeechRecognitionGrammerList;
//Set the default language
recognition.lang = 'en-US';
//Return the final result only
recognition.interimResults = false;


//onresult is one of the many event handlers provided by SpeechRecognition
//will run when the speech recognition service returns a result
recognition.onresult = function(event){
    //Output object to console for debugging 
    console.log(event);
    //Store result
    var message = event.results[0][0].transcript;
    //Output message onto webpage
    document.getElementById('paragraphText').innerHTML = message;

    //Send instruction to arduino if message match
    //TextEncoder takes a stream of code points as input and emits a stream of UTF-8 bytes
    //TextEncoder.encode() accept a string input and returns a Uint8Array containing UTF-8 encoded text
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


//Run when service ends
recognition.onspeechend = function(){
    //Replace "recording" with "Click to speak"
    document.getElementById('recording').style.display = "none";
    document.getElementById('button1').style.display = "block";
    //Stop speech recognition
    recognition.stop();
};

//Run if there was an error
recognition.onerror = function(event){
    document.getElementById('recording').style.display = "none";
    document.getElementById('button1').style.display = "block";
    //output error onto webpage
    document.getElementById('paragraphText').innerHTML = 'Error occurred in recognition: ' + event.error;
}

//When user click button "Click to speak" on the webpage
document.querySelector('#button1').addEventListener('click', function(){
    //Replace "Click to speak" icon with "recording"
    document.getElementById('button1').style.display = "none";
    document.getElementById('recording').style.display = "block";
    //Start speech recognition
    recognition.start();
});


//---------------------------Bluetooth---------------------------
//The Primary Service and Characteristic number were obtained by connecting the HM-10 to a BLE Scanner app
let characteristicCache = null;
let deviceCache = null;

function connectDevice(){
    navigator.bluetooth.requestDevice({
        //Filter everything that does not match the Gatt service
        filters:
        [
            {services: [0xFFE0]}
        ]
    })
    .then(device =>{
        console.log('Name: ' +device.name);
        // Store object to disconnect later
        deviceCache = device;
        // Attempts to connect to remote GATT Server.
        return device.gatt.connect();
    })
    .then(server =>{
        console.log('Getting GATT Service...')
        // Getting Primary Service
        return server.getPrimaryService(0xFFE0);
    })
    .then(service =>{
        console.log('Getting GATT Characteristic...')
        // Getting Characteristic
        return service.getCharacteristic(0xFFE1);
    })
    .then(characteristic =>{
        console.log('Found characteristic');
        // Store object to write to later
        characteristicCache  = characteristic;
        //"Connecting" -> "Disconnect"
        document.getElementById('connecting').style.display = "none";
        document.getElementById('disconnect').style.display = "block";
    })
    .catch(error =>{
        console.log('Request device error: ' + error);
        //"Connecting" -> "Connect"
        document.getElementById('connect').style.display = "block";
        document.getElementById('connecting').style.display = "none";
    })
    
}

//Runs when user click "Connect HM-10 with Arduino"
document.querySelector('#connect').addEventListener('click', function(event){

    //Check browser compatibility
    if(navigator.bluetooth){
        console.log('Web Bluetooth is available');
        //"Connect HM-10 with Arduino" -> "Connecting"
        document.getElementById('connect').style.display = "none";
        document.getElementById('connecting').style.display = "block";
        //Attempt to connect to device
        connectDevice();
    }
    else{
        console.log('Web Bluetooth is available');
    }
});

//Runs when user click "Disconnect HM-10 from Arduino"
document.querySelector('#disconnect').addEventListener('click', function(event){
    //If object exist
    if(deviceCache){
        //If connected
        if(deviceCache.gatt.connected){
            //Disconnect
            deviceCache.gatt.disconnect();
            console.log(deviceCache.name + ' disconnected');
        }
        else{
            console.log(deviceCache.name +' is already disconnected');
        }
    }
    characteristicCache = null;
    deviceCache = null;
    //"Disconnect" -> "Connect"
    document.getElementById('disconnect').style.display = "none";
    document.getElementById('connect').style.display = "block";
});



