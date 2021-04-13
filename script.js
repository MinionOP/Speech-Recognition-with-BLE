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
        alert("Living room light is on")
    }
    else if(message.toLowerCase() === 'light off'){
        alert('Living room light is off')
    }
    else if(message.toLowerCase() === 'open garage'){
        alert('Opening garage')
    }
    else if(message.toLowerCase() === 'close garage'){
        alert('Closing garage')
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

